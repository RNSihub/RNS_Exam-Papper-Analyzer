import os
import json
import csv
import io
import tempfile
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from bson import ObjectId
from pymongo import MongoClient
from PyPDF2 import PdfReader
import google.generativeai as genai

# MongoDB connection
client = MongoClient("mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["RNS_Exam_Analyze"]

# Configure Gemini AI
GEMINI_API_KEY = "AIzaSyB8gETGUcZwHqUmF1dJIm_MYbeWjWBup3M"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

def index(request):
    """
    Render the main application page
    """
    return render(request, 'exam_analyzer/index.html')

@csrf_exempt
def save_teacher_details(request):
    """
    Save teacher and project details
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            teacher = {
                "name": data.get('name'),
                "email": data.get('email'),
                "department": data.get('department')
            }

            project = {
                "name": data.get('projectName'),
                "created_at": timezone.now(),
                "teacher": teacher
            }

            # Save to MongoDB
            result = db.projects.insert_one(project)

            return JsonResponse({
                'status': 'success',
                'project_id': str(result.inserted_id)
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def upload_exam_files(request, project_id):
    """
    Upload question paper and answer key
    """
    if request.method == 'POST':
        try:
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            if 'questionPaper' in request.FILES:
                question_paper = request.FILES['questionPaper']
                question_paper_path = os.path.join('media', 'question_papers', question_paper.name)
                with open(question_paper_path, 'wb+') as destination:
                    for chunk in question_paper.chunks():
                        destination.write(chunk)
                project['question_paper'] = question_paper_path

            if 'answerKey' in request.FILES:
                answer_key = request.FILES['answerKey']
                answer_key_path = os.path.join('media', 'answer_keys', answer_key.name)
                with open(answer_key_path, 'wb+') as destination:
                    for chunk in answer_key.chunks():
                        destination.write(chunk)
                project['answer_key'] = answer_key_path

            db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": project})

            # Extract text from question paper for later use
            question_paper_text = extract_text_from_pdf(project['question_paper'])

            # Extract answer key text
            answer_key_text = ""
            if project['answer_key'].endswith('.pdf'):
                answer_key_text = extract_text_from_pdf(project['answer_key'])
            else:
                with open(project['answer_key'], 'r') as file:
                    answer_key_text = file.read()

            # Store extracted texts in session for later use
            request.session['question_paper_text'] = question_paper_text
            request.session['answer_key_text'] = answer_key_text

            return JsonResponse({
                'status': 'success',
                'message': 'Files uploaded successfully'
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def upload_exam_files(request):
    """
    Upload question paper and answer key, and return extracted text
    """
    if request.method == 'POST':
        try:
            if 'questionPaper' in request.FILES:
                question_paper = request.FILES['questionPaper']
                question_paper_path = os.path.join('media', 'question_papers', question_paper.name)
                with open(question_paper_path, 'wb+') as destination:
                    for chunk in question_paper.chunks():
                        destination.write(chunk)
                question_paper_text = extract_text_from_pdf(question_paper_path)

            if 'answerKey' in request.FILES:
                answer_key = request.FILES['answerKey']
                answer_key_path = os.path.join('media', 'answer_keys', answer_key.name)
                with open(answer_key_path, 'wb+') as destination:
                    for chunk in answer_key.chunks():
                        destination.write(chunk)
                answer_key_text = extract_text_from_pdf(answer_key_path)

            return JsonResponse({
                'status': 'success',
                'questionPaperText': question_paper_text,
                'answerKeyText': answer_key_text
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF file
    """
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

@csrf_exempt
def import_students_csv(request, project_id):
    """
    Import students from CSV file
    """
    if request.method == 'POST':
        try:
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            if 'file' not in request.FILES:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No file uploaded'
                }, status=400)

            csv_file = request.FILES['file']
            decoded_file = csv_file.read().decode('utf-8')
            csv_data = csv.reader(io.StringIO(decoded_file))

            # Skip header row
            next(csv_data)

            students_added = 0
            students = []
            for row in csv_data:
                if len(row) >= 2:  # Ensure we have name and roll_no
                    student = {
                        "name": row[0],
                        "roll_no": row[1],
                        "project_id": ObjectId(project_id)
                    }
                    students.append(student)
                    students_added += 1

            if students:
                db.students.insert_many(students)

            return JsonResponse({
                'status': 'success',
                'message': f'{students_added} students imported successfully'
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def add_student(request, project_id):
    """
    Add a single student manually
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            student = {
                "name": data.get('name'),
                "roll_no": data.get('rollNo'),
                "project_id": ObjectId(project_id)
            }
            result = db.students.insert_one(student)

            return JsonResponse({
                'status': 'success',
                'student': {
                    'id': str(result.inserted_id),
                    'name': student['name'],
                    'rollNo': student['roll_no'],
                    'marks': student.get('marks')
                }
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def get_students(request, project_id):
    """
    Get all students for a project
    """
    if request.method == 'GET':
        try:
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            students = db.students.find({"project_id": ObjectId(project_id)})

            students_data = []
            for student in students:
                students_data.append({
                    'id': str(student['_id']),
                    'name': student['name'],
                    'rollNo': student['roll_no'],
                    'answerSheet': bool(student.get('answer_sheet')),
                    'marks': student.get('marks')
                })

            return JsonResponse({
                'status': 'success',
                'students': students_data
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def upload_student_answer_sheet(request, student_id):
    """
    Upload a student's answer sheet and analyze it
    """
    if request.method == 'POST':
        try:
            student = db.students.find_one({"_id": ObjectId(student_id)})
            if not student:
                return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)

            if 'answerSheet' not in request.FILES:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No file uploaded'
                }, status=400)

            # Save the answer sheet
            answer_sheet = request.FILES['answerSheet']
            answer_sheet_path = os.path.join('media', 'answer_sheets', answer_sheet.name)
            with open(answer_sheet_path, 'wb+') as destination:
                for chunk in answer_sheet.chunks():
                    destination.write(chunk)
            student['answer_sheet'] = answer_sheet_path

            # Get question paper and answer key text from session
            question_paper_text = request.session.get('question_paper_text', '')
            answer_key_text = request.session.get('answer_key_text', '')

            if not question_paper_text or not answer_key_text:
                # If not in session, extract again
                project = db.projects.find_one({"_id": student['project_id']})
                question_paper_text = extract_text_from_pdf(project['question_paper'])

                if project['answer_key'].endswith('.pdf'):
                    answer_key_text = extract_text_from_pdf(project['answer_key'])
                else:
                    with open(project['answer_key'], 'r') as file:
                        answer_key_text = file.read()

            # Extract text from answer sheet
            answer_sheet_text = extract_text_from_pdf(student['answer_sheet'])

            # Analyze with Gemini AI
            marks, feedback = analyze_answer_sheet(question_paper_text, answer_key_text, answer_sheet_text)

            # Update student with marks and feedback
            student['marks'] = marks
            student['grade'] = calculate_grade(marks)
            student['feedback'] = feedback
            db.students.update_one({"_id": ObjectId(student_id)}, {"$set": student})

            return JsonResponse({
                'status': 'success',
                'student': {
                    'id': str(student['_id']),
                    'name': student['name'],
                    'rollNo': student['roll_no'],
                    'marks': student['marks'],
                    'grade': student['grade'],
                    'feedback': student['feedback']
                }
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def analyze_answer_sheet(question_paper_text, answer_key_text, answer_sheet_text):
    """
    Use Gemini AI to analyze the answer sheet and calculate marks
    """
    try:
        # Prepare the prompt for Gemini
        prompt = f"""
        Task: Evaluate a student's answer sheet against a question paper and answer key.

        Question Paper:
        {question_paper_text}

        Answer Key:
        {answer_key_text}

        Student's Answer Sheet:
        {answer_sheet_text}

        Please evaluate the answers, giving a score out of 100. Also provide brief feedback on the performance.
        Format your response as follows:
        Score: [numerical score out of 100]
        Feedback: [brief feedback]
        """

        # Get response from Gemini
        response = model.generate_content(prompt)
        response_text = response.text

        # Parse the response
        score_line = [line for line in response_text.split('\n') if line.startswith('Score:')]
        feedback_line = [line for line in response_text.split('\n') if line.startswith('Feedback:')]

        if score_line and feedback_line:
            score = float(score_line[0].replace('Score:', '').strip())
            feedback = feedback_line[0].replace('Feedback:', '').strip()
        else:
            # Fallback to a simple algorithmic approach if AI doesn't return expected format
            score = calculate_simple_score(answer_key_text, answer_sheet_text)
            feedback = "Automated assessment based on keyword matching."

        return score, feedback

    except Exception as e:
        # If Gemini fails, use a simple algorithmic approach
        print(f"Error with Gemini analysis: {str(e)}")
        score = calculate_simple_score(answer_key_text, answer_sheet_text)
        return score, "Automated assessment based on keyword matching."

def calculate_simple_score(answer_key_text, answer_sheet_text):
    """
    Fallback method: A simple algorithmic approach to estimate score based on keyword matching
    """
    # Extract key terms from answer key
    key_terms = set([word.lower() for word in answer_key_text.split() if len(word) > 4])

    # Count matching terms in student answer
    student_words = [word.lower() for word in answer_sheet_text.split()]
    matches = sum(1 for word in student_words if word in key_terms)

    # Calculate percentage of key terms found in answer
    if len(key_terms) > 0:
        match_percentage = (matches / len(key_terms)) * 100
    else:
        match_percentage = 0

    # Cap at 100 and ensure a minimum score
    return min(100, max(50, match_percentage))

def calculate_grade(marks):
    """
    Calculate letter grade based on marks
    """
    if marks >= 90:
        return 'A+'
    elif marks >= 80:
        return 'A'
    elif marks >= 70:
        return 'B'
    elif marks >= 60:
        return 'C'
    elif marks >= 50:
        return 'D'
    else:
        return 'F'

@csrf_exempt
def generate_reports(request, project_id):
    """
    Generate test report and student reports for a project
    """
    if request.method == 'POST':
        try:
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            students = db.students.find({"project_id": ObjectId(project_id), "marks": {"$exists": True}})
            students = list(students)

            if not students:
                return JsonResponse({
                    'status': 'error',
                    'message': 'No students with marks found'
                }, status=400)

            # Calculate test statistics
            marks_list = [student['marks'] for student in students]
            highest_mark = max(marks_list)
            lowest_mark = min(marks_list)
            average_mark = sum(marks_list) / len(marks_list)
            total_students = len(students)
            pass_count = sum(1 for mark in marks_list if mark >= 50)
            pass_rate = (pass_count / total_students) * 100

            # Create or update test report
            test_report = {
                "project_id": ObjectId(project_id),
                "highest_mark": highest_mark,
                "lowest_mark": lowest_mark,
                "average_mark": average_mark,
                "total_students": total_students,
                "pass_rate": pass_rate,
                "created_at": timezone.now()
            }
            db.test_reports.update_one({"project_id": ObjectId(project_id)}, {"$set": test_report}, upsert=True)

            # Prepare student reports data
            student_reports = []
            for student in students:
                if not student.get('grade'):
                    student['grade'] = calculate_grade(student['marks'])
                    db.students.update_one({"_id": ObjectId(student['_id'])}, {"$set": {"grade": student['grade']}})

                student_reports.append({
                    'id': str(student['_id']),
                    'name': student['name'],
                    'rollNo': student['roll_no'],
                    'marks': student['marks'],
                    'grade': student['grade'],
                    'feedback': student.get('feedback', f"Student has {'excellent' if student['marks'] >= 70 else 'good' if student['marks'] >= 60 else 'average'} performance.")
                })

            # Prepare test report data
            test_report_data = {
                'highestMark': highest_mark,
                'lowestMark': lowest_mark,
                'averageMark': average_mark,
                'totalStudents': total_students,
                'passRate': pass_rate
            }

            return JsonResponse({
                'status': 'success',
                'reports': {
                    'studentReports': student_reports,
                    'testReport': test_report_data
                }
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def export_student_report(request, student_id):
    """
    Export a single student's report as PDF
    """
    try:
        student = db.students.find_one({"_id": ObjectId(student_id)})
        if not student:
            return JsonResponse({'status': 'error', 'message': 'Student not found'}, status=404)

        project = db.projects.find_one({"_id": student['project_id']})
        if not project:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

        # In a real implementation, we would generate a PDF here
        # For now, let's return a simple JSON response
        report_data = {
            'studentName': student['name'],
            'rollNo': student['roll_no'],
            'projectName': project['name'],
            'teacherName': project['teacher']['name'],
            'marks': student['marks'],
            'grade': student['grade'],
            'feedback': student.get('feedback', '')
        }

        return JsonResponse({
            'status': 'success',
            'report': report_data
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

@csrf_exempt
def export_test_report(request, project_id):
    """
    Export the full test report as PDF
    """
    try:
        project = db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

        test_report = db.test_reports.find_one({"project_id": ObjectId(project_id)})
        if not test_report:
            return JsonResponse({'status': 'error', 'message': 'Test report not found'}, status=404)

        students = db.students.find({"project_id": ObjectId(project_id), "marks": {"$exists": True}})
        students = list(students)

        # In a real implementation, we would generate a PDF here
        # For now, let's return a simple JSON response
        report_data = {
            'projectName': project['name'],
            'teacherName': project['teacher']['name'],
            'teacherEmail': project['teacher']['email'],
            'department': project['teacher']['department'],
            'testReport': {
                'highestMark': test_report['highest_mark'],
                'lowestMark': test_report['lowest_mark'],
                'averageMark': test_report['average_mark'],
                'totalStudents': test_report['total_students'],
                'passRate': test_report['pass_rate']
            },
            'students': [
                {
                    'name': student['name'],
                    'rollNo': student['roll_no'],
                    'marks': student['marks'],
                    'grade': student['grade']
                }
                for student in students
            ]
        }

        return JsonResponse({
            'status': 'success',
            'report': report_data
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

def download_sample_csv(request):
    """
    Download a sample CSV file for student import
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="sample_students.csv"'

    writer = csv.writer(response)
    writer.writerow(['Name', 'Roll Number'])
    writer.writerow(['John Doe', 'R001'])
    writer.writerow(['Jane Smith', 'R002'])
    writer.writerow(['Alex Johnson', 'R003'])

    return response

def recent_projects(request):
    """
    Fetch recent projects
    """
    try:
        projects = db.projects.find().sort('created_at', -1).limit(5)
        project_list = [
            {
                'id': str(project['_id']),
                'name': project['name'],
                'teacher': project['teacher'],
                'created_at': project['created_at']
            }
            for project in projects
        ]
        return JsonResponse({'status': 'success', 'projects': project_list})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    
    
def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file.
    """
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

@csrf_exempt
def upload_exam_files(request):
    """
    Upload question paper and answer key, and return extracted text.
    """
    if request.method == 'POST':
        try:
            question_paper_text = ""
            answer_key_text = ""

            # Handle question paper upload
            if 'questionPaper' in request.FILES:
                question_paper = request.FILES['questionPaper']
                question_paper_path = os.path.join('media', 'question_papers', question_paper.name)
                os.makedirs(os.path.dirname(question_paper_path), exist_ok=True)
                with open(question_paper_path, 'wb+') as destination:
                    for chunk in question_paper.chunks():
                        destination.write(chunk)
                question_paper_text = extract_text_from_pdf(question_paper_path)

            # Handle answer key upload
            if 'answerKey' in request.FILES:
                answer_key = request.FILES['answerKey']
                answer_key_path = os.path.join('media', 'answer_keys', answer_key.name)
                os.makedirs(os.path.dirname(answer_key_path), exist_ok=True)
                with open(answer_key_path, 'wb+') as destination:
                    for chunk in answer_key.chunks():
                        destination.write(chunk)
                if answer_key.name.endswith('.pdf'):
                    answer_key_text = extract_text_from_pdf(answer_key_path)
                else:
                    with open(answer_key_path, 'r') as file:
                        answer_key_text = file.read()

            return JsonResponse({
                'status': 'success',
                'questionPaperText': question_paper_text,
                'answerKeyText': answer_key_text
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def recent_projects(request):
    """
    Fetch recent projects.
    """
    try:
        projects = db.projects.find().sort('created_at', -1).limit(5)
        project_list = [
            {
                'id': str(project['_id']),
                'name': project['name'],
                'teacher': project['teacher'],
                'created_at': project['created_at']
            }
            for project in projects
        ]
        return JsonResponse({'status': 'success', 'projects': project_list})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    
@csrf_exempt
def delete_project(request, project_id):
    """
    Delete a project by its ID.
    """
    if request.method == 'DELETE':
        try:
            # Find and delete the project
            result = db.projects.delete_one({"_id": ObjectId(project_id)})
            if result.deleted_count == 0:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            # Optionally, delete related data (e.g., students, reports)
            db.students.delete_many({"project_id": ObjectId(project_id)})
            db.test_reports.delete_one({"project_id": ObjectId(project_id)})

            return JsonResponse({'status': 'success', 'message': 'Project deleted successfully'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


@csrf_exempt
def get_project(request, project_id):
    """
    Get details of a specific project by its ID.
    """
    if request.method == 'GET':
        try:
            # Find the project by its ID
            project = db.projects.find_one({"_id": ObjectId(project_id)})
            if not project:
                return JsonResponse({'status': 'error', 'message': 'Project not found'}, status=404)

            # Fetch related students
            students = list(db.students.find({"project_id": ObjectId(project_id)}))
            for student in students:
                student['_id'] = str(student['_id'])

            # Prepare the project data
            project_data = {
                'id': str(project['_id']),
                'name': project['name'],
                'teacher': project['teacher'],
                'created_at': project['created_at'],
                'exam_date': project.get('exam_date'),
                'description': project.get('description'),
                'total_marks': project.get('total_marks'),
                'passing_marks': project.get('passing_marks'),
                'exam_duration': project.get('exam_duration'),
                'exam_type': project.get('exam_type'),
                'grade_scale': project.get('grade_scale', []),
                'students': students,
                'reports': project.get('reports', {})
            }

            return JsonResponse({'status': 'success', 'project': project_data})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
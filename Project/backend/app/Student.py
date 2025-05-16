# students/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import io
from pymongo import MongoClient

client = MongoClient("mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["RNS_Exam_Analyze"]
Student = db["students"] 

@csrf_exempt
def add_student(request):
    if request.method == 'POST':
        data = request.POST
        student_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            # Add other fields as needed
        }
        Student.insert_one(student_data)
        return JsonResponse({'message': 'Student added successfully'}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_students(request):
    students = list(Student.find({}, {'_id': 0}))
    return JsonResponse(students, safe=False)

@csrf_exempt
def bulk_upload_students(request):
    if request.method == 'POST' and request.FILES.get('file'):
        csv_file = request.FILES['file']
        csv_data = io.TextIOWrapper(csv_file.file, encoding='utf-8').read()

        # Parse CSV data
        csv_reader = csv.DictReader(io.StringIO(csv_data))
        students = [row for row in csv_reader]

        # Insert into MongoDB
        Student.insert_many(students)
        return JsonResponse({'message': 'Bulk upload successful'}, status=201)
    return JsonResponse({'error': 'Invalid request'}, status=400)

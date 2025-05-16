from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
import csv
from io import StringIO
import json

# Load environment variables
load_dotenv()

# Configure MongoDB
client = MongoClient("mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["RNS_Exam_Analyze"]
# Define the collection name explicitly
exam_projects_collection = db["exam_projects"]

@csrf_exempt
@api_view(['POST'])
def submit_all_details(request):
    try:
        # Extract data from request
        teacher_details = json.loads(request.data.get('teacherDetails', '{}'))
        subject_details = json.loads(request.data.get('subjectDetails', '{}'))
        mcq_file = request.FILES.get('mcqFile')

        if not all([teacher_details, subject_details, mcq_file]):
            return JsonResponse({"message": "Missing required data or file"}, status=400)

        # Process the uploaded file
        file_content = mcq_file.read().decode('utf-8')
        questions = parse_csv(file_content)

        # Create a structured document with only needed data
        project_data = {
            'teacher': {
                'name': teacher_details.get('name'),
                'email': teacher_details.get('email'),
                'department': teacher_details.get('department'),
                'employeeId': teacher_details.get('employeeId')
            },
            'subject': {
                'name': subject_details.get('name'),
                'code': subject_details.get('code'),
                'semester': subject_details.get('semester'),
                'branch': subject_details.get('branch')
            },
            'questions': questions,
            'created_at': datetime.now().isoformat()
        }

        # Insert the structured document into MongoDB
        exam_projects_collection.insert_one(project_data)

        return JsonResponse({"message": "All details saved successfully!"}, status=201)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

def parse_csv(file_content):
    # Use csv module to parse the CSV content
    csv_file = StringIO(file_content)
    csv_reader = csv.DictReader(csv_file)
    questions = [row for row in csv_reader]
    return questions

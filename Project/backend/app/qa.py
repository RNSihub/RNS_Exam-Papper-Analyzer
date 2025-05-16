from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Configure MongoDB
client = MongoClient("mongodb+srv://sutgJxLaXWo7gKMR:sutgJxLaXWo7gKMR@cluster0.2ytii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["RNS_Exam_Analyze"]

# Define the collection name explicitly
question_papers_collection = db["question_papers"]

@csrf_exempt
@api_view(['POST'])
def submit_question_paper(request):
    try:
        # Extract data from request
        teacher_details = json.loads(request.data.get('teacherDetails', '{}'))
        subject_details = json.loads(request.data.get('subjectDetails', '{}'))
        questions = json.loads(request.data.get('questions', '[]'))

        if not all([teacher_details, subject_details, questions]):
            return JsonResponse({"message": "Missing required data"}, status=400)

        # Create a structured document with only needed data
        question_paper_data = {
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
            'created_at': datetime.now().isoformat(),
            'Type': 'Question_Paper'
        }

        # Insert the structured document into MongoDB
        question_papers_collection.insert_one(question_paper_data)

        return JsonResponse({"message": "Question paper saved successfully!"}, status=201)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

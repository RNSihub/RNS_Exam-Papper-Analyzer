from django.urls import path
from . import views
from . import auth
from . import create

urlpatterns = [
    
    #auth
    path('api/signup/', auth.signup, name='signup'),
    path('api/verify-email/', auth.verify_email, name='verify_email'),
    path('api/login/', auth.login, name='login'),
    path('api/forgot-password/', auth.forgot_password, name='forgot_password'),
    path('api/verify-reset-code/', auth.verify_reset_code, name='verify_reset_code'),
    path('api/reset-password/', auth.reset_password, name='reset_password'),
    path('api/change-password/', auth.change_password, name='change_password'),
    
    #create
    path('', create.index, name='index'),
    path('api/teacher-details/', create.save_teacher_details, name='save_teacher_details'),
    path('api/upload-exam-files/', create.upload_exam_files, name='upload_exam_files'),
    path('api/import-students-csv/<str:project_id>/', create.import_students_csv, name='import_students_csv'),
    path('api/add-student/<str:project_id>/', create.add_student, name='add_student'),
    path('api/get-students/<str:project_id>/', create.get_students, name='get_students'),
    path('api/upload-student-answer-sheet/<str:student_id>/', create.upload_student_answer_sheet, name='upload_student_answer_sheet'),
    path('api/generate-reports/<str:project_id>/', create.generate_reports, name='generate_reports'),
    path('api/export-student-report/<str:student_id>/', create.export_student_report, name='export_student_report'),
    path('api/export-test-report/<str:project_id>/', create.export_test_report, name='export_test_report'),
    path('api/download-sample-csv/', create.download_sample_csv, name='download_sample_csv'),
    path('api/recent-projects/', create.recent_projects, name='recent_projects'),
    path('api/projects/', create.recent_projects, name='get_recent_projects'),
    path('api/delete-project/<str:project_id>/', create.delete_project, name='delete_project'),
    path('api/projects/<str:project_id>/', create.get_project, name='get_project'),
   
]
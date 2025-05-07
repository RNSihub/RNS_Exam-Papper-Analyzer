import { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Users,
  CheckCircle,
  Award,
  ChevronRight,
  Download,
  X,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  PieChart,
  Book,
  RefreshCw,
  Settings,
  Clock,
  User,
  BarChart2,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

// Main App Component
export default function ExamAnalyzer() {
  // Main application state
  const [appState, setAppState] = useState('projects'); // 'projects', 'create', 'view'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'students'

  // Projects list
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Teacher and project details
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    department: '',
    projectName: '',
    examDate: '',
    description: ''
  });

  // Exam details
  const [examDetails, setExamDetails] = useState({
    questionPaper: null,
    answerKey: null,
    questionPaperText: '',
    answerKeyText: '',
    totalMarks: 100,
    passingMarks: 40,
    examDuration: 180, // in minutes
    examType: 'multiple-choice', // 'multiple-choice', 'written', 'mixed'
    gradeScale: [
      { grade: 'A', minMarks: 80 },
      { grade: 'B', minMarks: 65 },
      { grade: 'C', minMarks: 50 },
      { grade: 'D', minMarks: 40 },
      { grade: 'F', minMarks: 0 }
    ]
  });

  // Students data
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', answerSheet: null, email: '' });
  const [studentStats, setStudentStats] = useState({
    totalCount: 0,
    withAnswerSheetsCount: 0,
    withoutAnswerSheetsCount: 0
  });

  // Reports data
  const [reports, setReports] = useState({
    studentReports: [],
    testReport: null,
    questionAnalysis: [],
    difficultyDistribution: {},
    topPerformers: [],
    improvementAreas: []
  });
  const [previewText, setPreviewText] = useState('');
const [isPreviewOpen, setIsPreviewOpen] = useState(false);

const openPreview = (text) => {
    setPreviewText(text);
    setIsPreviewOpen(true);
};

const closePreview = () => {
    setIsPreviewOpen(false);
};

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/recent-projects/');
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects);
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error fetching projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' ||
                          (filterStatus === 'active' && !project.completed) ||
                          (filterStatus === 'completed' && project.completed);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'students') {
        return b.students_count - a.students_count;
      }
      return 0;
    });

  // View project
  const viewProject = async (projectId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/`);
      const data = await response.json();
      if (response.ok) {
        setSelectedProject(data.project);
        setTeacherDetails({
          name: data.project.teacher.name,
          email: data.project.teacher.email,
          department: data.project.teacher.department,
          projectName: data.project.name,
          examDate: data.project.exam_date,
          description: data.project.description
        });
        setExamDetails({
          ...examDetails,
          totalMarks: data.project.total_marks,
          passingMarks: data.project.passing_marks,
          examDuration: data.project.exam_duration,
          examType: data.project.exam_type,
          gradeScale: data.project.grade_scale
        });
        setStudents(data.project.students);
        setStudentStats({
          totalCount: data.project.students.length,
          withAnswerSheetsCount: data.project.students.filter(s => s.answer_sheet).length,
          withoutAnswerSheetsCount: data.project.students.filter(s => !s.answer_sheet).length
        });
        setReports(data.project.reports || {
          studentReports: [],
          testReport: null,
          questionAnalysis: [],
          difficultyDistribution: {},
          topPerformers: [],
          improvementAreas: []
        });
        setProjectId(projectId);
        setAppState('view');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error loading project', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId, e) => {
    e.stopPropagation(); // Prevent triggering viewProject

    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete-project/${projectId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(prev => prev.filter(project => project.id !== projectId));
        showNotification('Project deleted successfully', 'success');
      } else {
        const data = await response.json();
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error deleting project', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Start new project
  const startNewProject = () => {
    // Reset all state
    setTeacherDetails({
      name: '',
      email: '',
      department: '',
      projectName: '',
      examDate: '',
      description: ''
    });
    setExamDetails({
      questionPaper: null,
      answerKey: null,
      questionPaperText: '',
      answerKeyText: '',
      totalMarks: 100,
      passingMarks: 40,
      examDuration: 180,
      examType: 'multiple-choice',
      gradeScale: [
        { grade: 'A', minMarks: 80 },
        { grade: 'B', minMarks: 65 },
        { grade: 'C', minMarks: 50 },
        { grade: 'D', minMarks: 40 },
        { grade: 'F', minMarks: 0 }
      ]
    });
    setStudents([]);
    setReports({
      studentReports: [],
      testReport: null,
      questionAnalysis: [],
      difficultyDistribution: {},
      topPerformers: [],
      improvementAreas: []
    });
    setSelectedProject(null);
    setProjectId(null);
    setStep(1);
    setAppState('create');
  };

  // Cancel project creation and return to projects list
  const cancelProjectCreation = () => {
    if (step > 1 && !window.confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      return;
    }
    setAppState('projects');
  };

  // Handle file upload
  
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setLoading(true);

    if (type === 'questionPaper' || type === 'answerKey') {
        const formData = new FormData();
        formData.append(type, file);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/upload-exam-files/${projectId}/`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setExamDetails(prev => ({
                    ...prev,
                    [type]: file,
                    [`${type}Text`]: data[`${type}Text`]
                }));
                showNotification(`${type === 'questionPaper' ? 'Question Paper' : 'Answer Key'} uploaded successfully`, 'success');
            } else {
                showNotification(data.message || 'Failed to upload file', 'error');
            }
        } catch (error) {
            showNotification('Error uploading file: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    } else if (type === 'studentBulk') {
        // Process bulk student upload (CSV)
        processBulkStudentUpload(file);
    } else if (type.startsWith('student-')) {
        // Process individual student answer sheet
        const studentId = type.split('-')[1];
        processStudentAnswerSheet(studentId, file);
    }
};




  // Process bulk student upload
  const processBulkStudentUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/import-students-csv/${projectId}/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
        setStudentStats({
          totalCount: data.students.length,
          withAnswerSheetsCount: data.students.filter(s => s.answer_sheet).length,
          withoutAnswerSheetsCount: data.students.filter(s => !s.answer_sheet).length
        });
        showNotification('Students imported successfully', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error importing students', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Process individual student answer sheet
  const processStudentAnswerSheet = async (studentId, file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('answerSheet', file);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/upload-student-answer-sheet/${studentId}/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        const updatedStudents = students.map(student =>
          student.id === studentId
            ? {
                ...student,
                answerSheet: file,
                marks: data.student.marks,
                grade: data.student.grade,
                feedback: data.student.feedback
              }
            : student
        );
        setStudents(updatedStudents);
        setStudentStats({
          totalCount: updatedStudents.length,
          withAnswerSheetsCount: updatedStudents.filter(s => s.answerSheet).length,
          withoutAnswerSheetsCount: updatedStudents.filter(s => !s.answerSheet).length
        });
        showNotification('Answer sheet processed successfully', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error processing answer sheet', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add a new student manually
  const addStudent = async () => {
    if (!newStudent.name || !newStudent.rollNo) {
      showNotification('Please enter student name and roll number', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/add-student/${projectId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newStudent.name,
          rollNo: newStudent.rollNo,
          email: newStudent.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        const updatedStudents = [...students, data.student];
        setStudents(updatedStudents);
        setStudentStats({
          totalCount: updatedStudents.length,
          withAnswerSheetsCount: updatedStudents.filter(s => s.answerSheet).length,
          withoutAnswerSheetsCount: updatedStudents.filter(s => !s.answerSheet).length
        });
        setNewStudent({ name: '', rollNo: '', answerSheet: null, email: '' });
        showNotification('Student added successfully', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error adding student', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedStudents = students.filter(student => student.id !== studentId);
        setStudents(updatedStudents);
        setStudentStats({
          totalCount: updatedStudents.length,
          withAnswerSheetsCount: updatedStudents.filter(s => s.answerSheet).length,
          withoutAnswerSheetsCount: updatedStudents.filter(s => !s.answerSheet).length
        });
        showNotification('Student removed successfully', 'success');
      } else {
        const data = await response.json();
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error removing student', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate reports
  const generateReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/generate-reports/${projectId}/`, {
        method: 'POST'
      });

      const data = await response.json();
      if (response.ok) {
        setReports(data.reports);
        setStep(4);
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error generating reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send reports to students
  const sendReportsToStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/send-reports/${projectId}/`, {
        method: 'POST'
      });

      const data = await response.json();
      if (response.ok) {
        showNotification('Reports sent to students successfully', 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error sending reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Next step handler
  const handleNextStep = async () => {
    if (step === 1) {
      if (!teacherDetails.name || !teacherDetails.email || !teacherDetails.projectName) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher-details/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(teacherDetails)
        });

        const data = await response.json();
        if (response.ok) {
          setProjectId(data.project_id);
          setStep(prev => prev + 1);
        } else {
          showNotification(data.message, 'error');
        }
      } catch (error) {
        showNotification('Error saving teacher details', 'error');
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (!examDetails.questionPaper || !examDetails.answerKey) {
        showNotification('Please upload question paper and answer key', 'error');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('questionPaper', examDetails.questionPaper);
      formData.append('answerKey', examDetails.answerKey);
      formData.append('totalMarks', examDetails.totalMarks);
      formData.append('passingMarks', examDetails.passingMarks);
      formData.append('examDuration', examDetails.examDuration);
      formData.append('examType', examDetails.examType);
      formData.append('gradeScale', JSON.stringify(examDetails.gradeScale));

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/upload-exam-files/`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          setStep(prev => prev + 1);
        } else {
          showNotification(data.message, 'error');
        }
      } catch (error) {
        showNotification('Error uploading exam files', 'error');
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      if (students.length === 0) {
        showNotification('Please add at least one student', 'error');
        return;
      }

      // Check if any student has answer sheets
      const hasAnswerSheets = students.some(student => student.answerSheet);
      if (!hasAnswerSheets) {
        showNotification('Please upload at least one student answer sheet', 'error');
        return;
      }

      return generateReports();
    }
  };

  // Complete project and go back to projects list
  const completeProject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/complete/`, {
        method: 'POST'
      });

      const data = await response.json();
      if (response.ok) {
        setProjects(prev =>
          prev.map(project =>
            project.id === projectId ? { ...project, completed: true } : project
          )
        );
        showNotification('Project marked as completed', 'success');
        setAppState('projects');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error completing project', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exam Paper Analyzer</h1>
          <div className="flex items-center space-x-4">
            {appState === 'create' && (
              <span className="text-yellow-300 font-medium">
                Step {step} of 4
              </span>
            )}
            {appState === 'view' && selectedProject && (
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{selectedProject.teacher.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 mt-6">
        {/* Projects View */}
        {appState === 'projects' && (
          <div>
            {/* Projects Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Exam Projects</h2>
              <button
                onClick={startNewProject}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Create New Project
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 md:flex-initial flex gap-2">
                  <select
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Projects</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="students">Sort by Students</option>
                  </select>
                  <button
                    onClick={fetchProjects}
                    className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Book size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-4">Start by creating a new exam analysis project.</p>
                <button
                  onClick={startNewProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Create New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => viewProject(project.id)}
                  >
                    <div className={`h-2 ${project.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-blue-800 mb-2 truncate">{project.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.completed ? 'Completed' : 'Active'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center mt-1">
                          <User size={14} className="mr-2" />
                          <span>{project.teacher.name}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Users size={14} className="mr-2" />
                          <span>{project.students_count} students</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewProject(project.id);
                          }}
                        >
                          <Eye size={16} className="mr-1" />
                          View Details
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          onClick={(e) => deleteProject(project.id, e)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Project View */}
        {appState === 'create' && (
          <div>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, title: "Teacher Details" },
                  { num: 2, title: "Question & Answer Key" },
                  { num: 3, title: "Student Management" },
                  { num: 4, title: "Reports" }
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center w-1/4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {s.num}
                    </div>
                    <div className="text-sm mt-2 text-center">{s.title}</div>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-500"
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Teacher Details */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Teacher & Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={teacherDetails.name}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={teacherDetails.email}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={teacherDetails.department}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={teacherDetails.projectName}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, projectName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={teacherDetails.examDate}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, examDate: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      value={teacherDetails.description}
                      onChange={(e) => setTeacherDetails({ ...teacherDetails, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Question Paper & Answer Key */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Question Paper & Answer Key</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Question Paper Upload */}
                  <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Question Paper</h3>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          examDetails.questionPaper ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                      }`}>
                          {!examDetails.questionPaper ? (
                              <div className="space-y-2">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="text-gray-700">Drag and drop your question paper here or</div>
                                  <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                                      Browse Files
                                      <input
                                          type="file"
                                          className="hidden"
                                          accept=".pdf,.doc,.docx,.txt"
                                          onChange={(e) => handleFileUpload(e.target.files[0], 'questionPaper')}
                                      />
                                  </label>
                                  <div className="text-xs text-gray-500 mt-1">Supports: PDF, DOC, DOCX, TXT</div>
                              </div>
                          ) : (
                              <div className="space-y-2">
                                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                  <div className="font-medium text-green-700">Question Paper Uploaded</div>
                                  <div className="text-sm text-gray-600 truncate">{examDetails.questionPaper.name}</div>
                                  <button
                                      className="text-red-600 text-sm hover:text-red-800"
                                      onClick={() => setExamDetails({ ...examDetails, questionPaper: null, questionPaperText: '' })}
                                  >
                                      Remove
                                  </button>
                                  <button
                                      className="text-blue-600 text-sm hover:text-blue-800"
                                      onClick={() => openPreview(examDetails.questionPaperText)}
                                  >
                                      Preview
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
          
                  {/* Answer Key Upload */}
                  <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Answer Key</h3>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          examDetails.answerKey ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                      }`}>
                          {!examDetails.answerKey ? (
                              <div className="space-y-2">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="text-gray-700">Drag and drop your answer key here or</div>
                                  <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                                      Browse Files
                                      <input
                                          type="file"
                                          className="hidden"
                                          accept=".pdf,.doc,.docx,.txt"
                                          onChange={(e) => handleFileUpload(e.target.files[0], 'answerKey')}
                                      />
                                  </label>
                                  <div className="text-xs text-gray-500 mt-1">Supports: PDF, DOC, DOCX, TXT</div>
                              </div>
                          ) : (
                              <div className="space-y-2">
                                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                  <div className="font-medium text-green-700">Answer Key Uploaded</div>
                                  <div className="text-sm text-gray-600 truncate">{examDetails.answerKey.name}</div>
                                  <button
                                      className="text-red-600 text-sm hover:text-red-800"
                                      onClick={() => setExamDetails({ ...examDetails, answerKey: null, answerKeyText: '' })}
                                  >
                                      Remove
                                  </button>
                                  <button
                                      className="text-blue-600 text-sm hover:text-blue-800"
                                      onClick={() => openPreview(examDetails.answerKeyText)}
                                  >
                                      Preview
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
            )}

            {/* Step 3: Student Management */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Student Management</h2>

                {/* Student Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-blue-800 font-medium text-lg mb-1">Total Students</h3>
                    <div className="flex items-center">
                      <Users className="text-blue-600 mr-2" size={24} />
                      <span className="text-2xl font-bold">{studentStats.totalCount}</span>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-green-800 font-medium text-lg mb-1">With Answer Sheets</h3>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={24} />
                      <span className="text-2xl font-bold">{studentStats.withAnswerSheetsCount}</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-orange-800 font-medium text-lg mb-1">Without Answer Sheets</h3>
                    <div className="flex items-center">
                      <AlertCircle className="text-orange-600 mr-2" size={24} />
                      <span className="text-2xl font-bold">{studentStats.withoutAnswerSheetsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Add Students Section */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Add Students</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Manual Input */}
                    <div>
                      <h4 className="text-gray-700 font-medium mb-2">Add Student Manually</h4>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Student Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Roll Number"
                            value={newStudent.rollNo}
                            onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Email (optional)"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          />
                        </div>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                          onClick={addStudent}
                        >
                          Add Student
                        </button>
                      </div>
                    </div>

                    {/* Bulk Upload */}
                    <div>
                      <h4 className="text-gray-700 font-medium mb-2">Bulk Upload Students</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="text-gray-700 mt-2">Upload CSV file with student data</div>
                        <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors mt-2">
                          Upload CSV
                          <input
                            type="file"
                            className="hidden"
                            accept=".csv"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'studentBulk')}
                          />
                        </label>
                        <div className="text-xs text-gray-500 mt-1">Format: Name, Roll No, Email</div>
                        <a href="#" className="text-blue-600 text-sm block mt-2">Download Template</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Students List</h3>
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="p-2 border border-gray-300 rounded-md mr-2"
                      />
                    </div>
                  </div>

                  {students.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Users size={48} className="mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg text-gray-700">No students added yet</h3>
                      <p className="text-gray-500">Add students manually or upload a CSV file</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Sheet</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{student.rollNo}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{student.email || '-'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.answerSheet ? (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Uploaded
                                  </span>
                                ) : (
                                  <label className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">
                                    Upload
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept=".pdf,.doc,.docx,.txt"
                                      onChange={(e) => handleFileUpload(e.target.files[0], `student-${student.id}`)}
                                    />
                                  </label>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  className="text-red-600 hover:text-red-900 mr-3"
                                  onClick={() => deleteStudent(student.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Reports */}
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Exam Reports</h2>

                {/* Report Tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-gray-200">
                    <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
                      Overview
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                      Student Reports
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                      Question Analysis
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                      Performance Trends
                    </button>
                  </div>
                </div>

                {/* Reports Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Performance Summary Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-800">Class Average</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {reports.testReport?.classAverage || 0}%
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-green-800">Pass Percentage</div>
                        <div className="text-2xl font-bold text-green-900">
                          {reports.testReport?.passPercentage || 0}%
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-purple-800">Highest Score</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {reports.testReport?.highestScore || 0}%
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm text-orange-800">Lowest Score</div>
                        <div className="text-2xl font-bold text-orange-900">
                          {reports.testReport?.lowestScore || 0}%
                        </div>
                      </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Grade Distribution</h4>
                      <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div style={{width: '35%'}} className="bg-green-500"></div>
                          <div style={{width: '25%'}} className="bg-blue-500"></div>
                          <div style={{width: '20%'}} className="bg-yellow-500"></div>
                          <div style={{width: '15%'}} className="bg-orange-500"></div>
                          <div style={{width: '5%'}} className="bg-red-500"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>A: 35%</span>
                        <span>B: 25%</span>
                        <span>C: 20%</span>
                        <span>D: 15%</span>
                        <span>F: 5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Performers Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                    {reports.topPerformers && reports.topPerformers.length > 0 ? (
                      <div className="space-y-3">
                        {reports.topPerformers.map((student, index) => (
                          <div key={index} className="flex items-center border-b border-gray-100 pb-2">
                            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              <span className="text-blue-800 font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.rollNo}</div>
                            </div>
                            <div className="bg-green-100 rounded-full px-3 py-1 text-green-800 font-medium">
                              {student.marks}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award size={48} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Analysis */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Question Difficulty Analysis</h3>
                  {reports.questionAnalysis && reports.questionAnalysis.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Time</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reports.questionAnalysis.map((question, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">Question {question.number}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                  question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {question.difficulty}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${question.successRate}%` }}
                                  ></div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{question.averageTime} min</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PieChart size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No data available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={cancelProjectCreation}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              {step < 4 && (
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Next
                </button>
              )}
              {step === 4 && (
                <button
                  onClick={completeProject}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Complete Project
                </button>
              )}
            </div>
          </div>
        )}

        {/* View Project View */}
        {appState === 'view' && selectedProject && (
          <div>
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                  <div className="text-gray-900">{selectedProject.teacher.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-gray-900">{selectedProject.teacher.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <div className="text-gray-900">{selectedProject.teacher.department}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <div className="text-gray-900">{selectedProject.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                  <div className="text-gray-900">{selectedProject.exam_date}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="text-gray-900">{selectedProject.description}</div>
                </div>
              </div>
            </div>

            {/* Exam Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Exam Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <div className="text-gray-900">{selectedProject.total_marks}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                  <div className="text-gray-900">{selectedProject.passing_marks}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Duration</label>
                  <div className="text-gray-900">{selectedProject.exam_duration} minutes</div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <div className="text-gray-900">{selectedProject.exam_type}</div>
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">Grade Scale</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Marks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProject.grade_scale.map((grade, index) => (
                        <tr key={index}>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="text-gray-900">{grade.grade}</div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="text-gray-900">{grade.minMarks}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Student Management */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Student Management</h2>

              {/* Student Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium text-lg mb-1">Total Students</h3>
                  <div className="flex items-center">
                    <Users className="text-blue-600 mr-2" size={24} />
                    <span className="text-2xl font-bold">{studentStats.totalCount}</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium text-lg mb-1">With Answer Sheets</h3>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" size={24} />
                    <span className="text-2xl font-bold">{studentStats.withAnswerSheetsCount}</span>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-orange-800 font-medium text-lg mb-1">Without Answer Sheets</h3>
                  <div className="flex items-center">
                    <AlertCircle className="text-orange-600 mr-2" size={24} />
                    <span className="text-2xl font-bold">{studentStats.withoutAnswerSheetsCount}</span>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Students List</h3>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="p-2 border border-gray-300 rounded-md mr-2"
                    />
                  </div>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Users size={48} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg text-gray-700">No students added yet</h3>
                    <p className="text-gray-500">Add students manually or upload a CSV file</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Sheet</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{student.rollNo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{student.email || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.answerSheet ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Uploaded
                                </span>
                              ) : (
                                <label className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">
                                  Upload
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={(e) => handleFileUpload(e.target.files[0], `student-${student.id}`)}
                                  />
                                </label>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-900 mr-3"
                                onClick={() => deleteStudent(student.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Exam Reports</h2>

              {/* Report Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
                    Overview
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                    Student Reports
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                    Question Analysis
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
                    Performance Trends
                  </button>
                </div>
              </div>

              {/* Reports Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Performance Summary Card */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-800">Class Average</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {reports.testReport?.classAverage || 0}%
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-green-800">Pass Percentage</div>
                      <div className="text-2xl font-bold text-green-900">
                        {reports.testReport?.passPercentage || 0}%
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-purple-800">Highest Score</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {reports.testReport?.highestScore || 0}%
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm text-orange-800">Lowest Score</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {reports.testReport?.lowestScore || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Grade Distribution */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Grade Distribution</h4>
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div style={{width: '35%'}} className="bg-green-500"></div>
                        <div style={{width: '25%'}} className="bg-blue-500"></div>
                        <div style={{width: '20%'}} className="bg-yellow-500"></div>
                        <div style={{width: '15%'}} className="bg-orange-500"></div>
                        <div style={{width: '5%'}} className="bg-red-500"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>A: 35%</span>
                      <span>B: 25%</span>
                      <span>C: 20%</span>
                      <span>D: 15%</span>
                      <span>F: 5%</span>
                    </div>
                  </div>
                </div>

                {/* Top Performers Card */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                  {reports.topPerformers && reports.topPerformers.length > 0 ? (
                    <div className="space-y-3">
                      {reports.topPerformers.map((student, index) => (
                        <div key={index} className="flex items-center border-b border-gray-100 pb-2">
                          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <span className="text-blue-800 font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.rollNo}</div>
                          </div>
                          <div className="bg-green-100 rounded-full px-3 py-1 text-green-800 font-medium">
                            {student.marks}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award size={48} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Question Analysis */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Question Difficulty Analysis</h3>
                {reports.questionAnalysis && reports.questionAnalysis.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reports.questionAnalysis.map((question, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">Question {question.number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {question.difficulty}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${question.successRate}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{question.averageTime} min</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChart size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setAppState('projects')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Back to Projects
              </button>
              <button
                onClick={sendReportsToStudents}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Send Reports to Students
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircle className="mr-2" />}
            {notification.type === 'error' && <X className="mr-2" />}
            {notification.type === 'info' && <AlertCircle className="mr-2" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

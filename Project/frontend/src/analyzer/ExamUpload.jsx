import { useState, useEffect } from 'react';
import { FileText, Upload, Users, CheckCircle, Award, ChevronRight, Download, X, AlertCircle } from 'lucide-react';

// Main App Component
export default function ExamAnalyzer() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Teacher and project details
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    department: '',
    projectName: ''
  });

  // Exam details
  const [examDetails, setExamDetails] = useState({
    questionPaper: null,
    answerKey: null
  });

  // Students data
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', answerSheet: null });

  // Reports data
  const [reports, setReports] = useState({
    studentReports: [],
    testReport: null
  });

  // Project ID
  const [projectId, setProjectId] = useState(null);

  // Handle file upload
  const handleFileUpload = (file, type) => {
    if (type === 'questionPaper' || type === 'answerKey') {
      setExamDetails(prev => ({ ...prev, [type]: file }));
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
      const response = await fetch(`http://127.0.0.1:8000/api/upload-answer-sheet/${studentId}/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(prev =>
          prev.map(student =>
            student.id === studentId
              ? { ...student, answerSheet: file, marks: data.student.marks, grade: data.student.grade, feedback: data.student.feedback }
              : student
          )
        );
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
        body: JSON.stringify({ name: newStudent.name, rollNo: newStudent.rollNo })
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(prev => [...prev, data.student]);
        setNewStudent({ name: '', rollNo: '', answerSheet: null });
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

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/upload-exam-files/${projectId}/`, {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exam Paper Analyzer</h1>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-300 font-medium">
              Step {step} of 4
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 mt-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={teacherDetails.name}
                  onChange={(e) => setTeacherDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter teacher name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={teacherDetails.email}
                  onChange={(e) => setTeacherDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={teacherDetails.department}
                  onChange={(e) => setTeacherDetails(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={teacherDetails.projectName}
                  onChange={(e) => setTeacherDetails(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Question Paper & Answer Key */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Question Paper & Answer Key</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <FileText size={48} className="text-blue-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">Question Paper</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">Upload your question paper in PDF format</p>

                {examDetails.questionPaper ? (
                  <div className="w-full bg-blue-50 p-3 rounded-md flex items-center justify-between">
                    <span className="text-blue-700 truncate max-w-xs">{examDetails.questionPaper.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setExamDetails(prev => ({ ...prev, questionPaper: null }))}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full">
                    <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md cursor-pointer text-center transition-colors">
                      Browse Files
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'questionPaper')}
                    />
                  </label>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <CheckCircle size={48} className="text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Answer Key</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">Upload your answer key in PDF or text format</p>

                {examDetails.answerKey ? (
                  <div className="w-full bg-yellow-50 p-3 rounded-md flex items-center justify-between">
                    <span className="text-yellow-700 truncate max-w-xs">{examDetails.answerKey.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setExamDetails(prev => ({ ...prev, answerKey: null }))}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full">
                    <div className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 px-4 rounded-md cursor-pointer text-center transition-colors">
                      Browse Files
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'answerKey')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Student Management */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Student Management</h2>

            {/* Add Students */}
            <div className="mb-8">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-medium mb-4">Add Students</h3>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newStudent.rollNo}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, rollNo: e.target.value }))}
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div className="self-end">
                    <button
                      onClick={addStudent}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Add Student
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">Or import students from CSV:</span>
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md transition-colors text-sm">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'studentBulk')}
                    />
                  </label>
                  <a href="/api/download-sample-csv/" className="text-blue-600 hover:text-blue-800 ml-4 text-sm">
                    Download Sample CSV
                  </a>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div>
              <h3 className="text-lg font-medium mb-4">Student List</h3>

              {students.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Users size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No students added yet. Add students manually or import from CSV.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Answer Sheet</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{student.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{student.rollNo}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {student.answerSheet ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" /> Uploaded
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not Uploaded
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {student.marks !== null ? (
                              <span className="font-medium">{student.marks}/100</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <label className="cursor-pointer inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                              <Upload size={14} className="mr-1" />
                              {student.answerSheet ? 'Replace' : 'Upload'}
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => handleFileUpload(e.target.files[0], `student-${student.id}`)}
                              />
                            </label>
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

            {/* Test Report */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Test Report</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Students</div>
                    <div className="text-2xl font-bold text-blue-700">{reports.testReport.totalStudents}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Highest Mark</div>
                    <div className="text-2xl font-bold text-green-600">{reports.testReport.highestMark}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Lowest Mark</div>
                    <div className="text-2xl font-bold text-red-600">{reports.testReport.lowestMark}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Average Mark</div>
                    <div className="text-2xl font-bold text-yellow-600">{reports.testReport.averageMark.toFixed(2)}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Pass Rate</div>
                    <div className="text-2xl font-bold text-blue-700">{reports.testReport.passRate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Download size={16} className="mr-2" />
                    Export Full Report
                  </button>
                </div>
              </div>
            </div>

            {/* Student Reports */}
            <div>
              <h3 className="text-lg font-medium mb-4">Student Reports</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.studentReports.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 whitespace-nowrap">{student.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{student.rollNo}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{student.marks}/100</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.grade === 'A' ? 'bg-green-100 text-green-800' :
                            student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            student.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3">{student.feedback}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                            <Download size={14} className="mr-1" />
                            Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {step === 3 ? 'Generate Reports' : 'Next'}
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md flex items-center ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="mr-2" />
          ) : notification.type === 'error' ? (
            <AlertCircle size={20} className="mr-2" />
          ) : (
            <AlertCircle size={20} className="mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-700">Processing... Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
}

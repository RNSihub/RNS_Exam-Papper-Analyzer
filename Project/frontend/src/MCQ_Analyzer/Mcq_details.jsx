import { useState, useEffect } from "react";
import {
  Download,
  Upload,
  Send,
  User,
  Book,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  BarChart,
  PieChart,
  HelpCircle,
  Settings,
  LogOut,
  Moon,
  Sun
} from "lucide-react";

export default function MCQUploadSystem() {
  const [activeTab, setActiveTab] = useState("teacherDetails");
  const [teacherDetails, setTeacherDetails] = useState({
    name: "",
    email: "",
    department: "",
    employeeId: ""
  });
  const [subjectDetails, setSubjectDetails] = useState({
    name: "",
    code: "",
    semester: "",
    branch: ""
  });
  const [mcqFile, setMcqFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [animateTab, setAnimateTab] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation effect when changing tabs
  useEffect(() => {
    setAnimateTab(activeTab);
    const timer = setTimeout(() => setAnimateTab(""), 700);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTeacherChange = (e) => {
    setTeacherDetails({
      ...teacherDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (e) => {
    setSubjectDetails({
      ...subjectDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMcqFile(file);

    if (file) {
      setProgress(0);
      const simulatedUpload = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(simulatedUpload);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        setCurrentPage(1); // Reset to first page on new file upload
        clearInterval(simulatedUpload);
        setProgress(100);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('teacherDetails', JSON.stringify(teacherDetails));
    formData.append('subjectDetails', JSON.stringify(subjectDetails));
    formData.append('mcqFile', mcqFile);

    // Simulate API call with a delay
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ text: "All details saved successfully!", type: "success" });
      setShowConfetti(true);

      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      // Reset form
      setTeacherDetails({ name: "", email: "", department: "", employeeId: "" });
      setSubjectDetails({ name: "", code: "", semester: "", branch: "" });
      setMcqFile(null);
      setFileContent("");
      setActiveTab("teacherDetails");
      document.getElementById("mcqFileInput").value = "";
    }, 2000);
  };

  const downloadSampleTemplate = () => {
    // Define the content of the sample CSV file
    const csvContent = `Question,Option1,Option2,Option3,Option4,CorrectOption\n` +
                       `"What is the capital of France?","London","Paris","Berlin","Madrid","Paris"\n` +
                       `"What is 2 + 2?","3","4","5","6","4"`;

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_template.csv");
    link.style.visibility = 'hidden';

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    setMessage({ text: "Sample template downloaded successfully!", type: "success" });
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
  };

  useEffect(() => {
    if (message.text) {
      clearMessage();
    }
  }, [message]);

  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMcqFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        setCurrentPage(1);
      };
      reader.readAsText(file);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderFilePreview = () => {
    if (!fileContent) return null;

    const lines = fileContent.split('\n');
    if (lines.length <= 1) return <p>No data to preview.</p>;

    // Skip the first row (header)
    const dataRows = lines.slice(1);
    const headers = lines[0].split(',').map(header => header.replace(/"/g, ''));
    const questionsPerPage = 10;
    const totalPages = Math.ceil(dataRows.length / questionsPerPage);
    const currentRows = dataRows.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    return (
      <div className="mt-6 transition-all duration-500 ease-in-out">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          File Preview
        </h3>
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'} p-4 rounded-md overflow-x-auto shadow-md transition-all duration-300`}>
          <table className={`min-w-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white'} rounded-md overflow-hidden transition-all duration-300`}>
            <thead>
              <tr className={isDarkMode ? 'bg-gray-600' : 'bg-blue-50'}>
                {headers.map((header, index) => (
                  <th key={index} className="py-2 px-4 border-b text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') : (isDarkMode ? 'bg-gray-800' : 'bg-white')} hover:${isDarkMode ? 'bg-gray-600' : 'bg-blue-50'} transition-colors duration-150`}>
                  {row.split(',').map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border-b">{cell.replace(/"/g, '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded disabled:bg-gray-300 transition-colors duration-200 transform hover:scale-105`}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded disabled:bg-gray-300 transition-colors duration-200 transform hover:scale-105`}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render confetti animation
  const renderConfetti = () => {
    if (!showConfetti) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, index) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const opacity = Math.random() * 0.5 + 0.5;
            const color = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'][Math.floor(Math.random() * 8)];

            return (
              <div
                key={index}
                className="confetti absolute w-2 h-2"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-5%',
                  backgroundColor: color,
                  opacity: opacity,
                  animation: `fall ${duration}s linear ${delay}s forwards`
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Help modal
  const renderHelpModal = () => {
    if (!showHelp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Instructions
            </h3>
            <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg">Teacher Details</h4>
              <p>Enter your personal information including full name, email, department and employee ID.</p>
            </div>

            <div>
              <h4 className="font-medium text-lg">Subject Details</h4>
              <p>Provide information about the subject including name, code, semester and branch.</p>
            </div>

            <div>
              <h4 className="font-medium text-lg">MCQ Upload</h4>
              <p>Upload your MCQ file in CSV format. You can download a sample template to see the expected format.</p>
              <p className="mt-2">The CSV file should have the following columns:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Question</li>
                <li>Option1</li>
                <li>Option2</li>
                <li>Option3</li>
                <li>Option4</li>
                <li>CorrectOption</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg">Review and Submit</h4>
              <p>Review all your information before final submission to the database.</p>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(false)}
            className={`mt-6 w-full py-2 px-4 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors duration-200`}
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }

        .tab-animation {
          animation: slideIn 0.5s ease forwards;
        }

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        .pulse {
          animation: pulse 2s infinite;
        }
      `}</style>

      {renderConfetti()}
      {renderHelpModal()}

      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <div className="flex justify-end mb-4 space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-transform duration-200`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'} hover:scale-110 transition-transform duration-200`}
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <h1 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} mb-8 relative overflow-hidden`}>
          <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:transform after:transition-transform after:duration-300 after:origin-left hover:after:scale-x-110">
            RNS Exam Analysis System
          </span>
        </h1>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md shadow-md fade-in flex items-start ${
            message.type === "success"
              ? `${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`
              : `${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`
          }`}>
            {message.type === "success" ?
              <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> :
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            }
            {message.text}
          </div>
        )}

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden transition-colors duration-300 transform hover:shadow-xl`}>
          {/* Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              className={`flex items-center px-6 py-4 relative overflow-hidden transition-colors duration-300 ${
                activeTab === "teacherDetails"
                  ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'border-b-2 border-blue-500 text-blue-600'}`
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveTab("teacherDetails")}
            >
              <User className={`mr-2 h-5 w-5 transition-transform duration-300 ${activeTab === "teacherDetails" ? 'transform scale-110' : ''}`} />
              <span>Teacher Details</span>
              {activeTab === "teacherDetails" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left animate-pulse"></span>}
            </button>
            <button
              className={`flex items-center px-6 py-4 relative overflow-hidden transition-colors duration-300 ${
                activeTab === "subjectDetails"
                  ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'border-b-2 border-blue-500 text-blue-600'}`
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveTab("subjectDetails")}
            >
              <Book className={`mr-2 h-5 w-5 transition-transform duration-300 ${activeTab === "subjectDetails" ? 'transform scale-110' : ''}`} />
              <span>Subject Details</span>
              {activeTab === "subjectDetails" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left animate-pulse"></span>}
            </button>
            <button
              className={`flex items-center px-6 py-4 relative overflow-hidden transition-colors duration-300 ${
                activeTab === "mcqUpload"
                  ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'border-b-2 border-blue-500 text-blue-600'}`
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveTab("mcqUpload")}
            >
              <FileText className={`mr-2 h-5 w-5 transition-transform duration-300 ${activeTab === "mcqUpload" ? 'transform scale-110' : ''}`} />
              <span>MCQ Upload</span>
              {activeTab === "mcqUpload" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left animate-pulse"></span>}
            </button>
            <button
              className={`flex items-center px-6 py-4 relative overflow-hidden transition-colors duration-300 ${
                activeTab === "review"
                  ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'border-b-2 border-blue-500 text-blue-600'}`
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              onClick={() => mcqFile && setActiveTab("review")}
              disabled={!mcqFile}
            >
              <BarChart className={`mr-2 h-5 w-5 transition-transform duration-300 ${activeTab === "review" ? 'transform scale-110' : ''}`} />
              <span>Review</span>
              {activeTab === "review" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left animate-pulse"></span>}
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Teacher Details Form */}
            {activeTab === "teacherDetails" && (
              <form
                onSubmit={(e) => { e.preventDefault(); setActiveTab("subjectDetails"); }}
                className={`${animateTab === "teacherDetails" ? 'tab-animation' : ''} space-y-6`}
              >
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} flex items-center`}>
                  <User className="mr-2 h-6 w-6" />
                  Teacher Information
                </h2>
                <div className="space-y-4">
                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={teacherDetails.name}
                      onChange={handleTeacherChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={teacherDetails.email}
                      onChange={handleTeacherChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="department" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={teacherDetails.department}
                      onChange={handleTeacherChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="employeeId" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Employee ID
                    </label>
                    <input
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      value={teacherDetails.employeeId}
                      onChange={handleTeacherChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="EMP1234"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105`}
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}

            {/* Subject Details Form */}
            {activeTab === "subjectDetails" && (
              <form
                onSubmit={(e) => { e.preventDefault(); setActiveTab("mcqUpload"); }}
                className={`${animateTab === "subjectDetails" ? 'tab-animation' : ''} space-y-6`}
              >
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} flex items-center`}>
                  <Book className="mr-2 h-6 w-6" />
                  Subject Information
                </h2>
                <div className="space-y-4">
                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="subjectName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject Name
                    </label>
                    <input
                      type="text"
                      id="subjectName"
                      name="name"
                      value={subjectDetails.name}
                      onChange={handleSubjectChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="Data Structures"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="code" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={subjectDetails.code}
                      onChange={handleSubjectChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="CS201"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="semester" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Semester
                    </label>
                    <input
                      type="text"
                      id="semester"
                      name="semester"
                      value={subjectDetails.semester}
                      onChange={handleSubjectChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="Fall 2023"
                    />
                  </div>

                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="branch" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Branch
                    </label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={subjectDetails.branch}
                      onChange={handleSubjectChange}
                      required
                      className={`mt-1 block w-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      placeholder="Computer Engineering"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105`}
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}

            {/* MCQ Upload Form */}
            {activeTab === "mcqUpload" && (
              <div className={`${animateTab === "mcqUpload" ? 'tab-animation' : ''} space-y-6`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} flex items-center`}>
                  <FileText className="mr-2 h-6 w-6" />
                  Upload MCQ File
                </h2>

                <div className="space-y-4">
                  <div className="transform transition duration-300 hover:scale-102">
                    <label htmlFor="mcqFileInput" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Upload your MCQ file in CSV format
                    </label>
                    <div
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragging ? 'border-blue-500' : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center">
                        <Upload className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="mcqFileInput"
                            className={`relative cursor-pointer ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-blue-600'} rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 hover:text-blue-500`}
                          >
                            <span>Upload a file</span>
                            <input
                              id="mcqFileInput"
                              name="mcqFileInput"
                              type="file"
                              accept=".csv"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV up to 10MB</p>
                        {progress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={downloadSampleTemplate}
                      className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Sample Template
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("subjectDetails")}
                    className={`flex-1 py-2 px-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 flex items-center justify-center`}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("review")}
                    disabled={!mcqFile}
                    className={`flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${!mcqFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Review and Submit
                  </button>
                </div>
              </div>
            )}

            {/* Review and Submit */}
            {activeTab === "review" && (
              <div className={`${animateTab === "review" ? 'tab-animation' : ''}`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} flex items-center`}>
                  <BarChart className="mr-2 h-6 w-6" />
                  Review and Submit
                </h2>
                <div className={`${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50'} p-4 rounded-md mb-6 transform transition duration-300 hover:shadow-md`}>
                  <h3 className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'} mb-2 flex items-center`}>
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Review your information
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} mb-3`}>
                    Please review all the information before submitting. Once submitted, the data will be stored in the database.
                  </p>
                </div>

                <div className="mt-4 space-y-6">
                  <div className="transform transition-all duration-300 hover:shadow-md rounded-md overflow-hidden">
                    <h3 className={`text-lg font-medium p-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} flex items-center`}>
                      <User className="mr-2 h-5 w-5" />
                      Teacher Details
                    </h3>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-b-md`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                          <p className="font-medium">{teacherDetails.name || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                          <p className="font-medium">{teacherDetails.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Department</p>
                          <p className="font-medium">{teacherDetails.department || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee ID</p>
                          <p className="font-medium">{teacherDetails.employeeId || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:shadow-md rounded-md overflow-hidden">
                    <h3 className={`text-lg font-medium p-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} flex items-center`}>
                      <Book className="mr-2 h-5 w-5" />
                      Subject Details
                    </h3>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-b-md`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject Name</p>
                          <p className="font-medium">{subjectDetails.name || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject Code</p>
                          <p className="font-medium">{subjectDetails.code || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Semester</p>
                          <p className="font-medium">{subjectDetails.semester || "Not provided"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Branch</p>
                          <p className="font-medium">{subjectDetails.branch || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:shadow-md rounded-md overflow-hidden">
                    <h3 className={`text-lg font-medium p-3 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} flex items-center`}>
                      <FileText className="mr-2 h-5 w-5" />
                      MCQ File Details
                    </h3>
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-b-md`}>
                      <div className="space-y-2">
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filename</p>
                          <p className="font-medium">{mcqFile?.name || "No file selected"}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>File Size</p>
                          <p className="font-medium">{mcqFile ? `${(mcqFile.size / 1024).toFixed(2)} KB` : "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {renderFilePreview()}
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("mcqUpload")}
                    className={`flex-1 py-2 px-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 flex items-center justify-center`}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${isLoading ? 'animate-pulse' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit to Database
                      </>
                    )}
                  </button>
                </div>

                {/* Analytics Preview Section */}
                <div className={`mt-8 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg shadow-md transition-transform duration-500 transform hover:scale-102`}>
                  <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'} flex items-center`}>
                    <PieChart className="mr-2 h-5 w-5" />
                    Analytics Preview
                    <span className={`ml-2 text-xs py-1 px-2 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>Coming Soon</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                      <h4 className="font-medium mb-2">Question Difficulty Analysis</h4>
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white">
                        Bar Chart Visualization
                      </div>
                    </div>

                    <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                      <h4 className="font-medium mb-2">Topic Distribution</h4>
                      <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-md flex items-center justify-center text-white">
                        Pie Chart Visualization
                      </div>
                    </div>
                  </div>

                  <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    After submission, you'll gain access to detailed analytics about question performance, difficulty levels, and topic distribution.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>© 2023 RNS Exam Analysis System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

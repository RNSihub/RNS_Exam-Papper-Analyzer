import { useState, useEffect } from "react";
import { Download, Upload, Send, User, Book, FileText, Eye, ChevronLeft, ChevronRight } from "lucide-react";

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
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        setCurrentPage(1); // Reset to first page on new file upload
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

    try {
      const response = await fetch('http://localhost:8000/api/submit/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage({ text: "All details saved successfully!", type: "success" });
        // Reset form
        setTeacherDetails({ name: "", email: "", department: "", employeeId: "" });
        setSubjectDetails({ name: "", code: "", semester: "", branch: "" });
        setMcqFile(null);
        setFileContent("");
        document.getElementById("mcqFileInput").value = "";
      } else {
        const error = await response.json();
        setMessage({ text: error.message || "Failed to save details", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving details", type: "error" });
    } finally {
      setIsLoading(false);
    }
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
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          File Preview
        </h3>
        <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="py-2 px-4 border-b">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
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
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          RNS Exam Analysis System
        </h1>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex items-center px-6 py-4 ${
                activeTab === "teacherDetails"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("teacherDetails")}
            >
              <User className="mr-2 h-5 w-5" />
              <span>Teacher Details</span>
            </button>
            <button
              className={`flex items-center px-6 py-4 ${
                activeTab === "subjectDetails"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("subjectDetails")}
            >
              <Book className="mr-2 h-5 w-5" />
              <span>Subject Details</span>
            </button>
            <button
              className={`flex items-center px-6 py-4 ${
                activeTab === "mcqUpload"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("mcqUpload")}
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>MCQ Upload</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Teacher Details Form */}
            {activeTab === "teacherDetails" && (
              <form onSubmit={(e) => { e.preventDefault(); setActiveTab("subjectDetails"); }}>
                <h2 className="text-xl font-semibold mb-6">Teacher Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={teacherDetails.name}
                      onChange={handleTeacherChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={teacherDetails.email}
                      onChange={handleTeacherChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={teacherDetails.department}
                      onChange={handleTeacherChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      value={teacherDetails.employeeId}
                      onChange={handleTeacherChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}

            {/* Subject Details Form */}
            {activeTab === "subjectDetails" && (
              <form onSubmit={(e) => { e.preventDefault(); setActiveTab("mcqUpload"); }}>
                <h2 className="text-xl font-semibold mb-6">Subject Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      id="subjectName"
                      name="name"
                      value={subjectDetails.name}
                      onChange={handleSubjectChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={subjectDetails.code}
                      onChange={handleSubjectChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <input
                      type="text"
                      id="semester"
                      name="semester"
                      value={subjectDetails.semester}
                      onChange={handleSubjectChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                      Branch
                    </label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={subjectDetails.branch}
                      onChange={handleSubjectChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("teacherDetails")}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}

            {/* MCQ Upload Form */}
            {activeTab === "mcqUpload" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">MCQ Question Upload</h2>

                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Please upload your MCQ questions in the correct format. You can download a sample template below to see the expected format.
                  </p>
                  <button
                    onClick={downloadSampleTemplate}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download Sample Format
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setActiveTab("review"); }} className="mt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      id="mcqFileInput"
                      type="file"
                      onChange={handleFileChange}
                      accept=".csv, .xlsx, .xls"
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor="mcqFileInput"
                          className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                          Click to upload
                        </label>
                        <span> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">CSV, XLS, or XLSX up to 10MB</p>
                    </div>

                    {mcqFile && (
                      <div className="mt-4 text-sm text-gray-800 bg-gray-100 p-2 rounded">
                        <span>Selected file: </span>
                        <span className="font-medium">{mcqFile.name}</span>
                      </div>
                    )}
                  </div>

                  {renderFilePreview()}

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("subjectDetails")}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!mcqFile}
                      className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Review and Submit
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Review and Submit */}
            {activeTab === "review" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Review and Submit</h2>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Review your information</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Please review all the information before submitting.
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Teacher Details</h3>
                  <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(teacherDetails, null, 2)}</pre>

                  <h3 className="text-lg font-medium mb-2 mt-6">Subject Details</h3>
                  <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(subjectDetails, null, 2)}</pre>

                  {renderFilePreview()}
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("mcqUpload")}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? "Submitting..." : "Submit to Database"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Download, Upload, Send, User, Book, FileText, Eye, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

export default function QuestionPaperUpload() {
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
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "", type: "", marks: "" }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('teacherDetails', JSON.stringify(teacherDetails));
    formData.append('subjectDetails', JSON.stringify(subjectDetails));
    formData.append('questions', JSON.stringify(questions));

    try {
      const response = await fetch('http://localhost:8000/api/qa-submit/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage({ text: "Question paper saved successfully!", type: "success" });
        // Reset form
        setTeacherDetails({ name: "", email: "", department: "", employeeId: "" });
        setSubjectDetails({ name: "", code: "", semester: "", branch: "" });
        setQuestions([]);
      } else {
        const error = await response.json();
        setMessage({ text: error.message || "Failed to save question paper", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving question paper", type: "error" });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Question Paper Upload System
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
                activeTab === "questionUpload"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("questionUpload")}
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Question Upload</span>
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
              <form onSubmit={(e) => { e.preventDefault(); setActiveTab("questionUpload"); }}>
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

            {/* Question Upload Form */}
            {activeTab === "questionUpload" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Question Upload</h2>

                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Please enter the questions, answers, types, and marks manually.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="border border-gray-300 rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">Question {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700">
                              Question
                            </label>
                            <input
                              type="text"
                              id={`question-${index}`}
                              value={question.question}
                              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-gray-700">
                              Answer
                            </label>
                            <input
                              type="text"
                              id={`answer-${index}`}
                              value={question.answer}
                              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`type-${index}`} className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <input
                              type="text"
                              id={`type-${index}`}
                              value={question.type}
                              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`marks-${index}`} className="block text-sm font-medium text-gray-700">
                              Marks
                            </label>
                            <input
                              type="number"
                              id={`marks-${index}`}
                              value={question.marks}
                              onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Question
                    </button>
                  </div>

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
                      disabled={isLoading || questions.length === 0}
                      className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? "Submitting..." : "Submit to Database"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

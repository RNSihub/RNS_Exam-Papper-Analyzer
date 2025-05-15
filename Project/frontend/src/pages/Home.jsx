import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/nav';
import Loading from '../components/loading';
import { Search, Clock, FileText, BarChart3, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock recent analysis data
  const recentAnalyses = [
    { id: 1, title: 'Physics Mid-Term', type: 'MCQ', date: 'May 12, 2025', status: 'completed' },
    { id: 2, title: 'Biology Final', type: 'QA', date: 'May 10, 2025', status: 'completed' },
    { id: 3, title: 'Chemistry Quiz 3', type: 'MCQ', date: 'May 5, 2025', status: 'completed' },
    { id: 4, title: 'Mathematics Test', type: 'QA', date: 'April 29, 2025', status: 'completed' },
  ];

  // Simulate a loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Function to render the status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Completed</span>;
      case 'processing':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">Processing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">{status}</span>;
    }
  };

  // Filter recent analyses based on search query
  const filteredAnalyses = recentAnalyses.filter(analysis =>
    analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Exam Paper Analyzer
          </h1>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">PREMIUM</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">AI-POWERED</span>
          </div>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search analysis by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Recent Analysis Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Recent Analysis</h2>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredAnalyses.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center cursor-pointer"
                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                  >
                    <div className="flex items-center">
                      {analysis.type === 'MCQ' ? (
                        <div className="p-2 rounded-md bg-pink-100 text-pink-600 mr-4">
                          <FileText className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-4">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">{analysis.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">{analysis.date}</span>
                          {renderStatusBadge(analysis.status)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No analyses match your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Tools</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MCQ Analysis Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border-t-4 border-pink-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">MCQ Exam Analyzer</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Upload your multiple-choice exam papers for comprehensive analysis. Get insights on question difficulty, discrimination index, and student performance patterns.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Accuracy Analysis</span>
                  <span className="text-pink-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Question Difficulty Index</span>
                  <span className="text-pink-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Performance Distribution</span>
                  <span className="text-pink-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">AI-Generated Insights</span>
                  <span className="text-pink-600 font-medium">New!</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full py-3 rounded-lg font-medium transition-colors duration-300 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={() => navigate("/mcq-analyzer")}
                >
                  <span>Start MCQ Analysis</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* QA Analysis Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">QA Exam Analyzer</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Upload written answer exams for AI-powered analysis. Identify common themes, evaluate answer completeness, and get grading suggestions.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Answer Completeness Score</span>
                  <span className="text-blue-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Key Concept Detection</span>
                  <span className="text-blue-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Suggested Grading Scale</span>
                  <span className="text-blue-600 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Automated Feedback Suggestions</span>
                  <span className="text-blue-600 font-medium">New!</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full py-3 rounded-lg font-medium transition-colors duration-300 bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={() => navigate("/qa-analyzer")}
                >
                  <span>Start QA Analysis</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

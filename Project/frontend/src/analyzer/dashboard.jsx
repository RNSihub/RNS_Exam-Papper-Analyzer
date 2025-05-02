import React, { useState, useEffect } from 'react';
import Sidebar from '../components/nav';
import Loading from '../components/loading';
import { FileText, Download, Upload, PlusCircle, Trash2, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    analyzedPapers: 0,
    pendingPapers: 0
  });
  const [recentExams, setRecentExams] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats(data.stats);
        setRecentExams(data.recentExams);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Exams" 
            value={stats.totalExams} 
            icon={<FileText className="text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<FileText className="text-green-500" />}
            color="bg-green-100"
          />
          <StatCard 
            title="Analyzed Papers" 
            value={stats.analyzedPapers} 
            icon={<FileText className="text-purple-500" />}
            color="bg-purple-100"
          />
          <StatCard 
            title="Pending Analysis" 
            value={stats.pendingPapers} 
            icon={<FileText className="text-orange-500" />}
            color="bg-orange-100"
          />
        </div>
        
        {/* Recent Exams */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Exams</h2>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => setActiveTab('exam')}
            >
              <PlusCircle size={18} />
              <span>New Exam</span>
            </button>
          </div>
          
          {recentExams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Exam Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Subject</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Class</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExams.map((exam) => (
                    <tr key={exam.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{exam.name}</td>
                      <td className="px-4 py-3">{exam.subject}</td>
                      <td className="px-4 py-3">{exam.class}</td>
                      <td className="px-4 py-3">{new Date(exam.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          exam.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          exam.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            className="p-1 text-gray-500 hover:text-blue-600"
                            onClick={() => window.location.href = `/results/${exam.id}`}
                          >
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No exams created yet. Create your first exam to get started.
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard 
            title="Analyze Document" 
            description="Upload and extract text from documents"
            icon={<FileText size={40} />}
            buttonText="Analyze Now"
            onClick={() => setActiveTab('analyze')}
          />
          <QuickActionCard 
            title="Create Exam" 
            description="Set up a new exam with question paper and answer key"
            icon={<PlusCircle size={40} />}
            buttonText="Create Exam"
            onClick={() => setActiveTab('exam')}
          />
          <QuickActionCard 
            title="View Results" 
            description="Check results and analysis for completed exams"
            icon={<FileText size={40} />}
            buttonText="View Results"
            onClick={() => setActiveTab('results')}
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-lg shadow p-6 flex items-center`}>
      <div className="p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon, buttonText, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="flex justify-center mb-4 text-blue-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <button 
        onClick={onClick}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}
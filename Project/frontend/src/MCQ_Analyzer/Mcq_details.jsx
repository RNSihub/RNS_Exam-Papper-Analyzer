import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestSetup() {
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState({
    testName: '',
    courseCode: '',
    examDate: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    negativeMarking: false,
    negativeMarkValue: '0',
    instructorName: '',
    department: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestDetails({
      ...testDetails,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/test-setup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testDetails),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Test created successfully:', data);
        navigate('/upload-questions');
      } else {
        console.error('Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Test Setup</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="testName">Test Name</label>
            <input
              type="text"
              id="testName"
              name="testName"
              value={testDetails.testName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="courseCode">Course Code</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={testDetails.courseCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="examDate">Exam Date</label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              value={testDetails.examDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={testDetails.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="totalMarks">Total Marks</label>
            <input
              type="number"
              id="totalMarks"
              name="totalMarks"
              value={testDetails.totalMarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="passingMarks">Passing Marks</label>
            <input
              type="number"
              id="passingMarks"
              name="passingMarks"
              value={testDetails.passingMarks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="negativeMarking"
              name="negativeMarking"
              checked={testDetails.negativeMarking}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-700" htmlFor="negativeMarking">Enable Negative Marking</label>
          </div>
          
          {testDetails.negativeMarking && (
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="negativeMarkValue">Negative Mark Value</label>
              <input
                type="number"
                id="negativeMarkValue"
                name="negativeMarkValue"
                value={testDetails.negativeMarkValue}
                onChange={handleChange}
                step="0.25"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="instructorName">Instructor Name</label>
            <input
              type="text"
              id="instructorName"
              name="instructorName"
              value={testDetails.instructorName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={testDetails.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
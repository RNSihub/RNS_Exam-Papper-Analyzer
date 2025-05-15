import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export default function QuestionUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Parse and preview the file
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors } = results;
        
        if (errors.length > 0) {
          setError('Error parsing CSV file');
          return;
        }
        
        // Validate the CSV structure
        if (!validateQuestionFormat(data)) {
          setError('CSV format is invalid. Please use the required format');
          return;
        }
        
        setQuestions(data);
        setPreviewData(data.slice(0, 5)); // Preview first 5 questions
      }
    });
  };

  const validateQuestionFormat = (data) => {
    if (data.length === 0) return false;
    
    const requiredHeaders = ['question_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'];
    const headers = Object.keys(data[0]);
    
    return requiredHeaders.every(header => headers.includes(header));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || questions.length === 0) {
      setError('Please upload a valid CSV file');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/upload-questions/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        navigate('/upload-answers');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload questions');
      }
    } catch (error) {
      setError('Error uploading questions');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = [
      {
        question_id: 1,
        question_text: 'What is the capital of France?',
        option_a: 'London',
        option_b: 'Paris',
        option_c: 'Berlin',
        option_d: 'Madrid',
        correct_answer: 'B'
      },
      {
        question_id: 2,
        question_text: 'Which planet is known as the Red Planet?',
        option_a: 'Venus',
        option_b: 'Jupiter',
        option_c: 'Mars',
        option_d: 'Saturn',
        correct_answer: 'C'
      }
    ];
    
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'question_sample_format.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Upload Questions</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">CSV Format Instructions</h2>
        <p className="text-gray-700 mb-3">
          Please ensure your CSV file has the following columns:
        </p>
        <ul className="list-disc pl-5 text-gray-700 mb-4">
          <li>question_id - Unique identifier for each question</li>
          <li>question_text - The actual question</li>
          <li>option_a - First answer choice</li>
          <li>option_b - Second answer choice</li>
          <li>option_c - Third answer choice</li>
          <li>option_d - Fourth answer choice</li>
          <li>correct_answer - The correct answer (A, B, C, or D)</li>
        </ul>
        <button 
          onClick={downloadSampleCsv} 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Download Sample CSV Format
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="questionFile"
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          <label htmlFor="questionFile" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-600 font-medium">
                {file ? file.name : 'Click to upload questions CSV file'}
              </span>
              <span className="text-sm text-gray-500">
                {file ? `${(file.size / 1024).toFixed(2)} KB` : 'CSV format only'}
              </span>
            </div>
          </label>
        </div>
        
        {previewData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 border-b text-left">ID</th>
                    <th className="py-2 px-3 border-b text-left">Question</th>
                    <th className="py-2 px-3 border-b text-left">Option A</th>
                    <th className="py-2 px-3 border-b text-left">Option B</th>
                    <th className="py-2 px-3 border-b text-left">Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border-b">{item.question_id}</td>
                      <td className="py-2 px-3 border-b">{item.question_text}</td>
                      <td className="py-2 px-3 border-b">{item.option_a}</td>
                      <td className="py-2 px-3 border-b">{item.option_b}</td>
                      <td className="py-2 px-3 border-b">{item.correct_answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">Showing {previewData.length} of {questions.length} questions</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!file || isUploading || questions.length === 0}
            className={`px-6 py-2 rounded transition ${
              !file || isUploading || questions.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
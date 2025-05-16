import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Add other fields as needed
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = async () => {
    try {
      await axios.post('http://localhost:5000/api/students', formData);
      setShowAddForm(false);
      setFormData({ name: '', email: '' }); // Reset form
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/students/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Add Student
        </button>

        <input
          type="file"
          accept=".csv"
          onChange={handleBulkUpload}
          className="border rounded p-2"
        />
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Add New Student</h2>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded p-2 mb-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border rounded p-2 mb-2 w-full"
          />
          {/* Add other fields as needed */}
          <button
            onClick={handleAddStudent}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}

      <ul>
        {filteredStudents.map(student => (
          <li
            key={student._id}
            onClick={() => setSelectedStudent(student)}
            className="cursor-pointer border-b p-2 hover:bg-gray-100"
          >
            {student.name}
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Student Details</h2>
          <p>Name: {selectedStudent.name}</p>
          <p>Email: {selectedStudent.email}</p>
          {/* Display other fields as needed */}
        </div>
      )}
    </div>
  );
};

export default StudentPage;

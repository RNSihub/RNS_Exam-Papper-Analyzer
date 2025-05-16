import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Home from "./pages/Home";
import LandingPage from "./pages/Landing";// Correct the import statement

import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot";
import ExamAnalyzer from "./analyzer/ExamUpload";
import MCQUploadSystem from "./MCQ_Analyzer/Mcq_details";
import QuestionPaperUpload from "./QA_Analyzer/qa_details";
import StudentPage from "./pages/Student";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import mcq_analyzer from "./MCQ_Analyzer/Mcq_details";
import { Toaster } from 'react-hot-toast';


// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Function to handle login
  
  // Function to handle logout
  
  return (
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />

          <Route path="/profile" element={<Profile />} />
          
          {/* Add other routes here */}
          {/* Example: */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/exam-upload" element={<ExamUpload />} /> */}
          
          <Route path="/exam-upload" element={<ExamAnalyzer />} />
          <Route path="/mcq-analyzer" element={<MCQUploadSystem />} />
          <Route path="/qa-analyzer" element={<QuestionPaperUpload />} />

          <Route path="/students" element={<StudentPage />} />


          {/* <Route path="/upload-questions" element={<QuestionUpload />} />
          <Route path="/upload-answers" element={<StudentAnswerUpload />} />
          <Route path="/results" element={<ResultAnalysis />} /> */}

          
        </Routes>
      </Router>
  );
}

export default App;

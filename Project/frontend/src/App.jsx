import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Home from "./pages/Home";
import LandingPage from "./pages/Landing";// Correct the import statement

import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot";
import ExamAnalyzer from "./analyzer/ExamUpload";
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
          
          <Route path="/exam-upload" element={<ExamAnalyzer />} />
        </Routes>
      </Router>
  );
}

export default App;

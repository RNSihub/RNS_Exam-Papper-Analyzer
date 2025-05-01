import React, { useEffect, useState } from 'react';

const Loading = ({ message = "Loading AssessEngine..." }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");
  const [dots, setDots] = useState("");

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const next = prevProgress + Math.random() * 10;
        return next > 100 ? 100 : next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Animate loading text
  useEffect(() => {
    const textOptions = [
      "Initializing",
      "Preparing assessment tools",
      "Loading user data",
      "Configuring modules",
      "Almost ready"
    ];

    const textInterval = setInterval(() => {
      const currentIndex = textOptions.indexOf(loadingText);
      const nextIndex = progress > 80 ? 4 : (currentIndex + 1) % (textOptions.length - 1);
      setLoadingText(textOptions[nextIndex]);
    }, 3000);

    return () => clearInterval(textInterval);
  }, [loadingText, progress]);

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return "";
        return prevDots + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Create animated particles
  const particles = Array.from({ length: 30 }, (_, i) => (
    <div 
      key={i}
      className="absolute rounded-full animate-float"
      style={{
        width: `${Math.random() * 40 + 10}px`,
        height: `${Math.random() * 40 + 10}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: i % 3 === 0 ? '#FFAC3E' : (i % 2 === 0 ? '#5D3FD3' : '#F0EBF8'),
        opacity: Math.random() * 0.5 + 0.1,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }}
    />
  ));

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white overflow-hidden relative">
      {/* Animated background particles */}
      {particles}
      
      {/* Pulsing circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-amber-200 opacity-10 animate-ping"></div>
        <div className="absolute w-48 h-48 rounded-full bg-indigo-300 opacity-20 animate-ping animation-delay-1000"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md text-center p-8">
        {/* Logo and animated pulse */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-10 animation-delay-500"></div>
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg">
            <div className="absolute w-full h-full rounded-full bg-amber-400 opacity-30 animate-pulse"></div>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 mb-2">
          RNS AssessEngine
        </h1>
        
        {/* Loading text with dots animation */}
        <p className="text-indigo-500 font-medium mb-6">
          {loadingText}<span className="inline-block w-12 text-left">{dots}</span>
        </p>
        
        {/* Custom progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-amber-400 to-indigo-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Moving highlights */}
            <div className="absolute top-0 h-full w-12 bg-white opacity-20 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Progress percentage */}
        <p className="text-indigo-600 font-semibold">
          {Math.round(progress)}%
        </p>
        
        {/* Custom message */}
        <p className="text-indigo-400 mt-6 max-w-sm">
          {message}
        </p>
        
        {/* Bouncing dots animation */}
        <div className="flex space-x-2 mt-8">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
      
      {/* Animated wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#5D3FD3" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#FFAC3E" fillOpacity="0.15" d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,149.3C672,149,768,171,864,176C960,181,1056,171,1152,165.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 8s infinite ease-in-out;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
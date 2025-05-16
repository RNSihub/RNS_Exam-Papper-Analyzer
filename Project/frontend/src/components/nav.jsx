import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navBarClass, setNavBarClass] = useState('translate-y-0');
  const [showCreateOptions, setShowCreateOptions] = useState(false);

  // Handle navigation state
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavBarClass('translate-y-full');
      } else {
        setNavBarClass('translate-y-0');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Check if we should show the nav at all (hide on login/register pages)
  useEffect(() => {
    const hideOnPaths = ['/login', '/register', '/forgot-password'];
    setIsVisible(!hideOnPaths.includes(location.pathname));
  }, [location.pathname]);

  if (!isVisible) return null;

  // Navigation items with icons and labels
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      )
    },
    {
      path: '/assessments',
      label: 'Assessments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      )
    },
    {
      path: '/exam-upload', // Updated path for the "Create" button
      label: 'Create',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      ),
      special: true
    },
    {
      path: '/results',
      label: 'Results',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    }
  ];

  const createOptions = [
    { path: '/students', label: 'Students' },
    { path: '/exam-upload', label: 'Create Page' }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBarClass}`}>
      {/* Enhanced gradient shadow above nav bar */}
      <div className="h-3 bg-gradient-to-t from-gray-200 to-transparent opacity-70"></div>

      {/* Main navigation bar with glass morphism effect */}
      <nav className="bg-white bg-opacity-90 backdrop-blur-lg border-t border-indigo-100 px-1 py-1 shadow-lg">
        <div className="max-w-lg mx-auto">
          <ul className="flex items-center justify-between">
            {navItems.map((item, index) => (
              <li key={index} className={`flex-1 relative ${item.special ? 'pb-2' : ''}`}>
                <div
                  className={`flex flex-col items-center justify-center py-1 px-1
                    ${item.special ? 'text-white' : activeTab === item.path ? 'text-indigo-600' : 'text-gray-400'}
                    transition-all duration-300 ease-in-out relative`}
                  onClick={() => {
                    if (item.special) {
                      setShowCreateOptions(!showCreateOptions);
                    } else {
                      setActiveTab(item.path);
                    }
                  }}
                  aria-label={item.label}
                >
                  {/* Special center button (Create) */}
                  {item.special ? (
                    <div className="absolute -top-5 transform -translate-y-1/3 flex items-center justify-center">
                      <div className="relative">
                        {/* Enhanced ripple effect with color */}
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-30 animate-ping"></span>
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-40 animate-pulse"></span>

                        {/* Button with gradient */}
                        <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-500 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-200">
                          {item.icon}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Regular navigation items with hover effects */}
                      <div className={`p-1 ${activeTab === item.path ? 'text-indigo-600 transform scale-110 transition-transform duration-200' : 'text-gray-500 hover:text-indigo-400 hover:scale-105 transition-all duration-200'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-xs mt-1 ${activeTab === item.path ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        {item.label}
                      </span>

                      {/* Active indicator dot */}
                      {activeTab === item.path && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                      )}
                    </>
                  )}
                </div>

                {/* Animated active indicator pill with gradient */}
                {activeTab === item.path && !item.special && (
                  <>
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gradient-to-r ${item.color} rounded-full animate-pulse`}></span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full opacity-0 animate-ping"></span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Dropdown for Create Options */}
      {showCreateOptions && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg p-2 flex space-x-4">
            {createOptions.map((option, index) => (
              <Link
                key={index}
                to={option.path}
                className="bg-gradient-to-tr from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200"
                onClick={() => setShowCreateOptions(false)}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Extra padding for iOS devices to account for home indicator */}
      <div className="h-safe-bottom bg-white bg-opacity-90 backdrop-blur-lg"></div>
    </div>
  );
};

// Optional: Add CSS for iOS safe area support
const iOSSafeAreaStyles = `
  .h-safe-bottom {
    height: env(safe-area-inset-bottom, 0px);
  }
`;

// Insert the styles into the document
const styleElement = document.createElement('style');
styleElement.textContent = iOSSafeAreaStyles;
document.head.appendChild(styleElement);

export default BottomNavBar;

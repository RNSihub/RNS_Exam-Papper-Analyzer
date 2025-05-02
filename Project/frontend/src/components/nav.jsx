import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navBarClass, setNavBarClass] = useState('translate-y-0');

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

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${navBarClass}`}>
      {/* Drop shadow above nav bar */}
      <div className="h-2 bg-gradient-to-t from-gray-200 to-transparent opacity-70"></div>

      {/* Main navigation bar */}
      <nav className="bg-white border-t border-indigo-100 px-2 py-1 shadow-lg">
        <div className="max-w-lg mx-auto">
          <ul className="flex items-center justify-between">
            {navItems.map((item, index) => (
              <li key={index} className="flex-1 relative">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center py-2 px-1
                    ${item.special ? 'text-white' : activeTab === item.path ? 'text-indigo-600' : 'text-gray-400'}
                    transition-colors duration-200 ease-in-out relative`}
                  onClick={() => setActiveTab(item.path)}
                  aria-label={item.label}
                >
                  {/* Special center button (Create) */}
                  {item.special ? (
                    <div className="absolute -top-5 transform -translate-y-1/3 flex items-center justify-center">
                      <div className="relative">
                        {/* Ripple effect */}
                        <span className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"></span>

                        {/* Button */}
                        <div className="relative bg-gradient-to-tr from-indigo-600 to-indigo-500 h-14 w-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                          {item.icon}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Regular navigation items */}
                      <div className={`p-1 ${activeTab === item.path ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-xs mt-1 ${activeTab === item.path ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        {item.label}
                      </span>

                      {/* Active indicator */}
                      {activeTab === item.path && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>
                      )}
                    </>
                  )}
                </Link>

                {/* Active indicator pill */}
                {activeTab === item.path && !item.special && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-8 bg-indigo-600 rounded-full"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Extra padding for iOS devices to account for home indicator */}
      <div className="h-safe-bottom bg-white"></div>
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

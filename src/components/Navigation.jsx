import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMoon, FaLeaf, FaBed, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useAppContext();
  
  // Navigation items
  const navItems = [
    { path: '/', icon: <FaHome className="text-lg sm:text-xl" />, label: 'Home' },
    { path: '/meditations', icon: <FaLeaf className="text-lg sm:text-xl" />, label: 'Meditate' },
    { path: '/sleep-stories', icon: <FaBed className="text-lg sm:text-xl" />, label: 'Sleep' },
    { path: '/breathing', icon: <motion.div 
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center justify-center"
    >
      <span className="relative flex h-4 sm:h-5 w-4 sm:w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 sm:h-5 w-4 sm:w-5 bg-purple-500"></span>
      </span>
    </motion.div>, label: 'Breathe' },
    { path: '/profile', icon: <FaUser className="text-lg sm:text-xl" />, label: 'Profile' },
  ];

  return (
    <motion.nav 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass rounded-full px-2 sm:px-4 py-2 z-50 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 sm:space-x-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="relative flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full ${
                  isActive 
                    ? 'bg-white/40 text-purple-700' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {item.icon}
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-white/40 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
              
              {/* Label */}
              <motion.span 
                className={`text-xs mt-1 ${isActive ? 'text-purple-700' : 'text-gray-600'}`}
                animate={{ opacity: isActive ? 1 : 0.7 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
        
        {/* Theme toggle button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full text-gray-600 hover:text-purple-600"
        >
          <FaMoon className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-600'}`} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navigation;

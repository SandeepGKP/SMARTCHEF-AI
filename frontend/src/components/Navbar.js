import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleHome = () => {
    if (token) {
      navigate('/home', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutUs = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-us-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/about');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <FaUtensils className="text-green-600 text-2xl" />
          <span onClick={handleHome} className="text-2xl font-bold text-green-700 dark:text-green-300 tracking-tight cursor-pointer">SmartChef AI</span>
        </div>
        <div className="flex items-center gap-6 text-base font-medium">
          <button onClick={handleHome} className="hover:text-green-600 dark:hover:text-green-300 transition-colors focus:outline-none text-green-600">Home</button>
          <button onClick={handleAboutUs} className="hover:text-green-600 dark:hover:text-green-300 transition-colors focus:outline-none text-green-600">About Us</button>
          {token ? (
            <button
              onClick={handleLogout}
              className="hover:text-green-600 dark:hover:text-green-300 transition-colors focus:outline-none text-green-600"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-green-600 dark:hover:text-green-300 transition-colors text-green-600">Login</Link>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 p-2 rounded-full bg-green-200 dark:bg-gray-700 hover:scale-105 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

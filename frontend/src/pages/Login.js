import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Footer from '../components/Footer';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🔍 Attempting login with:', form);
    try {
      const res = await axios.post('https://smartchef-ai-backend.onrender.com/api/auth/login', form);
      console.log('✅ Login response:', res.data);
      console.log('✅ Token received:', res.data.token ? 'Yes' : 'No');
      
      localStorage.setItem('token', res.data.token);
      console.log('✅ Token saved to localStorage');
      
      alert('Login successful!');
      setLoggedIn(true);
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/home');
    }
  }, [loggedIn, navigate]);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 flex flex-col items-center">
        <FaUserCircle className="text-green-500 dark:text-green-300 text-5xl mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-300">Login to SmartChef</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">Welcome back! Please enter your credentials to continue.</p>
        <form onSubmit={handleLogin} className="space-y-5 w-full">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 outline-none transition"
            required
          />
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg shadow transition">
            Login
          </button>
        </form>
      </div>
    </div>
    <Footer />
    <div id="about-us-section"></div>
    </> 
  );
};

export default Login;

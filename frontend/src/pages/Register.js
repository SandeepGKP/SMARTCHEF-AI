import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set dark mode as default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // reset error each time

    // ✅ validation check
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('⚠️ Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('https://smartchef-ai-backend.onrender.com/api/auth/register', form);
      alert('✅ ' + res.data.message + ' Please login.');
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <ToastContainer />
        <div className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 flex flex-col items-center">
          <FaUserPlus className="text-green-500 dark:text-green-300 text-5xl mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-300">Create an Account</h1>
          <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">
            Join SmartChef to get personalized recipes and meal plans.
          </p>
          <form onSubmit={handleRegister} className="space-y-5 w-full">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 outline-none transition"
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg shadow transition"
            >
              Create Account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Homep'; // your app's actual dashboard
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {token ? (
          <>
            <Route path="/home" element={<Home />} />
          </>
        ) : (
          // redirect to login if not authenticated
          <>
            <Route path="/home" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow p-4 flex justify-between">
    <div className="text-xl font-bold">
      <Link to="/">SmartChef AI</Link>
    </div>
    <div className="space-x-4">
      <Link to="/planner" className="hover:text-blue-600">Planner</Link>
      <Link to="/profile" className="hover:text-blue-600">Profile</Link>
      <Link to="/login" className="hover:text-blue-600">Login</Link>
    </div>
  </nav>
);

export default Navbar;

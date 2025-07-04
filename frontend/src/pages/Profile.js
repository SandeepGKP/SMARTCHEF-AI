import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch user info from backend using token
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const currentUser = res.data.user;
          setUser(currentUser);
          // Get all recipes from localStorage
          const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
          // Filter recipes by user email (assuming each recipe has a 'userEmail' field)
          const filtered = allRecipes.filter(r => r.userEmail === currentUser.email);
          setUserRecipes(filtered);
        } catch (err) {
          setUser({});
          setUserRecipes([]);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p>Name: {user && user.name ? user.name : 'Loading...'}</p>
      <p>Email: {user && user.email ? user.email : 'Loading...'}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Recipes</h2>
      {userRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found for your account.</p>
      ) : (
        <ul className="space-y-2">
          {userRecipes.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

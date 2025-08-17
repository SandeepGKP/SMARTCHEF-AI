import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaUtensils, FaHeart, FaCog, FaChartBar, FaTrophy, FaEdit, FaCamera, FaSave, FaTrash, FaStar, FaClock, FaBookmark, FaShare, FaDownload, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({});
  const [userRecipes, setUserRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState({
    dietaryPreferences: ['Vegetarian', 'Gluten-Free'],
    cookingSkill: 'Intermediate',
    cuisinePreferences: ['Italian', 'Mexican', 'Asian'],
    allergies: ['Nuts'],
    measurementUnits: 'Metric',
    servingSize: '2-4 people'
  });
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || null);

  // Mock data for demonstration
  const [stats] = useState({
    totalRecipes: 24,
    savedRecipes: 18,
    createdRecipes: 6,
    cookingStreak: 7,
    favoriteCuisine: 'Italian',
    completionRate: 85
  });

  const [recentActivity] = useState([
    { type: 'search', text: 'Searched for "pasta recipes"', time: '2 hours ago' },
    { type: 'save', text: 'Saved "Chicken Tikka Masala"', time: '1 day ago' },
    { type: 'cook', text: 'Cooked "Spaghetti Carbonara"', time: '2 days ago' },
    { type: 'plan', text: 'Created meal plan for week', time: '3 days ago' }
  ]);

  const [achievements] = useState([
    { name: 'First Recipe', description: 'Created your first recipe', earned: true, icon: '🥇' },
    { name: 'Cooking Streak', description: 'Cooked 7 days in a row', earned: true, icon: '🔥' },
    { name: 'Cuisine Explorer', description: 'Tried 5 different cuisines', earned: true, icon: '🌍' },
    { name: 'Recipe Master', description: 'Created 10 recipes', earned: false, icon: '👨‍🍳' },
    { name: 'Social Chef', description: 'Shared 5 recipes', earned: false, icon: '📤' }
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log('🔍 Profile component mounted');
      console.log('🔍 Token in localStorage:', token ? 'Token exists' : 'No token');

      if (token) {
        console.log('📦 Retrieved Token:', token);
        try {
          console.log('🌐 Making API request to /api/auth/me...');
          const res = await axios.get('https://smartchef-ai-backend.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('✅ User fetched successfully:', res.data);
          console.log('✅ Response status:', res.status);
          console.log('✅ Response headers:', res.headers);

          const currentUser = res.data.user;
          setUser(currentUser);
          setIsAuthenticated(true);

          const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
          const filtered = allRecipes.filter(r => r.userEmail === currentUser.email);
          setUserRecipes(filtered);
        } catch (err) {
          console.error('❌ Error fetching user:', err);
          console.error('❌ Error response:', err.response);
          console.error('❌ Error status:', err.response?.status);
          console.error('❌ Error data:', err.response?.data);
          console.error('❌ Error message:', err.message);

          // If token is invalid, remove it and show login message
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            alert('Session expired. Please login again.');
          }
          setUser({});
          setUserRecipes([]);
          setIsAuthenticated(false);
        }
      } else {
        console.warn('⚠️ No token found in localStorage');
        alert('Please login to view your profile.');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile data saved:', profileData);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target.result;
        setProfilePhoto(photoData);
        localStorage.setItem('profilePhoto', photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('profilePhoto');
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('recipes');
  //   window.location.href = '/';
  // };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FaUser /> },
    { id: 'recipes', name: 'My Recipes', icon: <FaUtensils /> },
    { id: 'activity', name: 'Activity', icon: <FaChartBar /> },
    { id: 'achievements', name: 'Achievements', icon: <FaTrophy /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to view your profile.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Dashboard</h1>
            {/* <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              {/* Profile Card */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profilePhoto ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative">
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-3 translate-x-1/3 translate-y-1/3 bg-red-500 text-white w-6 h-6 rounded-full text-base font-bold hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 z-20"
                        title="Remove photo"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <FaCamera className="text-gray-600 dark:text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name || 'Loading...'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                  <FaEnvelope className="text-sm" />
                  {user.email || 'Loading...'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recipes</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</p>
                      </div>
                      <FaUtensils className="text-green-600 text-2xl" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cooking Streak</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cookingStreak} days</p>
                      </div>
                      <FaHeart className="text-red-500 text-2xl" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
                      </div>
                      <FaChartBar className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorite Cuisine</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.favoriteCuisine}</p>
                      </div>
                      <FaStar className="text-yellow-500 text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <FaEdit />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dietary Preferences
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.dietaryPreferences.join(', ')}
                          onChange={(e) => setProfileData({ ...profileData, dietaryPreferences: e.target.value.split(', ') })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profileData.dietaryPreferences.map((pref, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                              {pref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cooking Skill Level
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.cookingSkill}
                          onChange={(e) => setProfileData({ ...profileData, cookingSkill: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {profileData.cookingSkill}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allergies
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.allergies.join(', ')}
                          onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value.split(', ') })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profileData.allergies.map((allergy, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Measurement Units
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.measurementUnits}
                          onChange={(e) => setProfileData({ ...profileData, measurementUnits: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                        >
                          <option value="Metric">Metric</option>
                          <option value="Imperial">Imperial</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                          {profileData.measurementUnits}
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaSave />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <FaClock className="text-green-600 dark:text-green-300 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recipes Tab */}
            {activeTab === 'recipes' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Recipes</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        <FaBookmark className="inline mr-1" />
                        Saved ({stats.savedRecipes})
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        <FaEdit className="inline mr-1" />
                        Created ({stats.createdRecipes})
                      </button>
                    </div>
                  </div>

      {userRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <FaUtensils className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No recipes found for your account.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start by searching for recipes or creating your own!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map((recipe) => (
                        <div key={recipe.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{recipe.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{recipe.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {recipe.calories} calories
                              </span>
                              <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                  <FaShare />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
                <div className="space-y-6">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">{activity.text}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className={`p-6 rounded-lg border-2 ${achievement.earned
                        ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                      }`}>
                      <div className="text-center">
                        <div className={`text-4xl mb-3 ${achievement.earned ? 'opacity-100' : 'opacity-30'}`}>
                          {achievement.icon}
                        </div>
                        <h4 className={`font-semibold mb-2 ${achievement.earned
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400'
                          }`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm ${achievement.earned
                            ? 'text-gray-600 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'
                          }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="mt-3">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                              Earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Email notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Push notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Weekly recipe suggestions</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Privacy</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Public profile</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Share cooking activity</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Data Management</h4>
                      <div className="space-y-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <FaDownload />
                          Export My Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <FaTrash />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

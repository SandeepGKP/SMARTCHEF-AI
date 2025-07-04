import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: '🧑‍🍳 AI Recipe Suggestions',
    description: 'Get creative recipe ideas using ingredients you have at home using OpenAI.',
  },
  {
    title: '📅 Weekly Meal Planner',
    description: 'Plan your meals for the week in a single click with a personalized AI meal plan.',
  },
  {
    title: '🔊 Voice Mode',
    description: 'Listen to the recipe instructions read aloud with voice assistant support.',
  },
  {
    title: '👤 Profile Dashboard',
    description: 'Track saved recipes and personalized recommendations in your profile.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-green-50 text-gray-800">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-green-700">👨‍🍳 SmartChef AI</h1>
        <p className="text-lg mt-2 text-gray-600">
          Your personal AI-powered cooking assistant
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-white border border-green-600 text-green-700 px-6 py-2 rounded hover:bg-green-100">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">🚀 App Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-4 border bg-white rounded shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-bold mb-2 text-green-700">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-8">
        © 2025 SmartChef AI — Crafted with ❤️ using MERN & OpenAI
      </footer>
    </div>
  );
};

export default LandingPage;

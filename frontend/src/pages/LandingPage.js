import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

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
  // const [theme, setTheme] = useState(localStorage.getItem('theme'));
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const syncTheme = () => {
      const theme = localStorage.getItem('theme');
      // setTheme(theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    syncTheme();
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-300">👨‍🍳 SmartChef AI</h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Your personal AI-powered cooking assistant
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-green-600 border border-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
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
            <div key={idx} className="p-4 border bg-white dark:bg-gray-800 rounded shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-bold mb-2 text-green-700 dark:text-green-300">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Footer */}
      <Footer />
      <div id="about-us-section"></div>
    </div>
  );
};

export default LandingPage;

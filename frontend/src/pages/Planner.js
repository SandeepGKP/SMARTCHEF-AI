import React, { useState } from 'react';
import axios from 'axios';

const Planner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const res = await axios.get('http://localhost:5000/api/recipes/plan');
      setPlan(res.data.plan);
    } catch (error) {
      console.error(error);
      setPlan({ error: '❌ Failed to generate meal plan. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🥗 AI Weekly Meal Plan</h2>
      <button
        onClick={handlePlan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Planning...' : 'Generate Weekly Plan'}
      </button>

      {plan?.error && (
        <p className="text-red-500 mt-4">{plan.error}</p>
      )}

      {plan?.week && (
        <div className="mt-6 space-y-4">
          {Object.entries(plan.week).map(([day, meals]) => (
            <div key={day} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold text-green-700 capitalize">{day}</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {meals.meals.map((meal) => (
                  <li key={meal.id}>
                    🍽️ {meal.title} – <a
                      href={meal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Recipe
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Planner;

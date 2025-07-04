import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams(); // Recipe ID (if navigated)
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  // Load stored recipes and fetch instructions if ID exists
  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    setRecipes(storedRecipes);

    if (id && storedRecipes.length > 0) {
      const found = storedRecipes.find((r) => String(r.id) === id);
      setRecipe(found || null);

      if (found) {
        axios
          .get(`https://smartchef-ai-backend.onrender.com/api/recipes/instructions/${id}`)
          .then((res) => {
            setInstructions(res.data.instructions || 'No instructions available for this recipe.');
          })
          .catch((err) => {
            console.error('❌ Error fetching instructions:', err);
            setInstructions('Failed to load instructions.');
          });
      }
    }
  }, [id]);

  const handleSearch = async () => {
    try {
      const res = await fetch('https://smartchef-ai-backend.onrender.com/api/recipes/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      setRecipes(data.recipes || []);
      localStorage.setItem('recipes', JSON.stringify(data.recipes));
    } catch (err) {
      console.error('❌ Error fetching recipes:', err);
    }
  };

  const handleSpeak = () => {
    if (synth.speaking) synth.cancel();

    if (instructions) {
      const utterance = new SpeechSynthesisUtterance(instructions);
      synth.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {!id && (
        <>
          <h2 className="text-2xl font-bold mb-4">Search Recipes by Ingredients</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. tomato,onion,cheese"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/recipe/${r.id}`)}
                className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <img src={r.image} alt={r.title} className="rounded mb-2 w-full h-48 object-cover" />
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {id && recipe && (
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          {recipe.image && (
            <img src={recipe.image} alt={recipe.title} className="my-4 rounded w-full max-h-96 object-cover" />
          )}
          <p>{recipe.description}</p>
          <p className="mt-2 text-sm text-gray-500">Estimated Calories: {recipe.calories}</p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
              {instructions || 'No instructions available for this recipe.'}
            </pre>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🔊 Speak Instructions
              </button>
              <button
                onClick={handleStop}
                disabled={!isSpeaking}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                ✋ Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {id && !recipe && (
        <p className="text-red-500 text-center">Recipe not found. Please go back and search again.</p>
      )}
    </div>
  );
};

export default RecipeDetail;

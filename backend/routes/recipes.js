// backend/routes/recipes.js

const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🍽️ Recipe suggestion from Spoonacular
router.post('/ai', async (req, res) => {
  const { ingredients } = req.body;

  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key not configured' });
    }

    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
      ingredients
    )}&number=3&ranking=1&ignorePantry=true&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Spoonacular API Error:', errorData);
      return res.status(500).json({ error: 'Spoonacular API request failed' });
    }

    const data = await response.json();

    const recipes = data.map((r) => ({
      title: r.title,
      description: `Used: ${r.usedIngredientCount} | Missed: ${r.missedIngredientCount}`,
      calories: '250',
      image: r.image,
      id: r.id,
    }));

    res.json({ recipes });
  } catch (error) {
    console.error('❌ Error from Spoonacular:', error.message);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

// 🍱 Weekly meal planner using Spoonacular
router.get('/plan', async (req, res) => {
  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key not configured' });
    }

    const url = `https://api.spoonacular.com/mealplanner/generate?timeFrame=week&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Meal Plan API Error:', errorData);
      return res.status(500).json({ error: 'Failed to generate meal plan' });
    }

    const data = await response.json();
    res.json({ plan: data });
  } catch (error) {
    console.error('❌ Error from Spoonacular:', error.message);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// 📖 Get step-by-step instructions for a specific recipe
router.get('/instructions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key not configured' });
    }

    const url = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.warn('⚠️ Spoonacular returned non-200:', text.slice(0, 200));
      return res.status(200).json({ instructions: 'No instructions available for this recipe.' });
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0 || !data[0].steps) {
      return res.status(200).json({ instructions: 'No instructions available for this recipe.' });
    }

    const steps = data[0].steps.map((step) => `${step.number}. ${step.step}`).join('\n');
    res.json({ instructions: steps });
  } catch (error) {
    console.error('❌ Error fetching instructions:', error.message);
    return res.status(200).json({ instructions: 'No instructions available for this recipe.' });
  }
});

module.exports = router;

import React, { useEffect, useState, useRef } from 'react';
import { FaUtensils, FaCalendarAlt, FaVolumeUp, FaUser } from 'react-icons/fa';
import Profile from './Profile';
import Planner from './Planner';
import Footer from '../components/Footer';


const RecipeDetail = ({ recipe, onBack }) => {
  const [instructions, setInstructions] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  // const [speakStepIndex, setSpeakStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const synth = window.speechSynthesis;
  const [currentUtterance, setCurrentUtterance] = useState(null);
  // const lastSpokenStepRef = useRef(0);
  const [lastSpokenStep, setLastSpokenStep] = useState(0);
  const [lastSpokenChar, setLastSpokenChar] = useState(0);

  useEffect(() => {
    if (recipe?.id) {
      fetch(`https://smartchef-ai-backend.onrender.com/api/recipes/instructions/${recipe.id}`)
        .then((res) => res.json())
        .then((data) => setInstructions(data.instructions))
        .catch((err) => {
          console.error('❌ Error fetching instructions:', err);
          setInstructions('Failed to load instructions.');
        });
    }
  }, [recipe]);

  useEffect(() => {
    if (instructions) {
      // Split instructions into steps by line breaks only
      const stepArr = instructions.split(/\r?\n/).filter(s => s.trim().length > 0).map((step) => `Step : ${step.trim()}`);
      setSteps(stepArr);
    }
  }, [instructions]);

  const handleSpeak = () => {
    if (synth.speaking && currentUtterance) synth.cancel();
    if (steps.length > 0) {
      let textToSpeak;
      if (lastSpokenChar > 0 && lastSpokenStep < steps.length) {
        // Resume from the exact char in the step
        const stepText = steps[lastSpokenStep];
        textToSpeak = [
          stepText.substring(lastSpokenChar),
          ...steps.slice(lastSpokenStep + 1)
        ].join('. ');
      } else {
        textToSpeak = steps.slice(lastSpokenStep).join('. ');
      }
      const utterance = new window.SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.5;
      setCurrentUtterance(utterance);
      synth.speak(utterance);
      setIsSpeaking(true);
      let localStep = lastSpokenStep;
      let localChar = lastSpokenChar;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onboundary = (event) => {
        if (event.name === 'word' && event.charIndex !== undefined) {
          // Find which step and charIndex we are at
          let total = 0;
          let found = false;
          for (let i = localStep; i < steps.length; i++) {
            const step = (i === localStep && localChar > 0) ? steps[i].substring(localChar) : steps[i];
            if (event.charIndex < total + step.length) {
              setLastSpokenStep(i);
              setLastSpokenChar(event.charIndex - total + (i === localStep ? localChar : 0));
              found = true;
              break;
            }
            total += step.length + 2; // +2 for '. '
          }
          if (!found) {
            setLastSpokenStep(steps.length - 1);
            setLastSpokenChar(0);
          }
        }
      };
    }
  };

  const handleStop = () => {
    if (synth.speaking && currentUtterance) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const handleRestart = () => {
    setLastSpokenStep(0);
    setLastSpokenChar(0);
    if (synth.speaking && currentUtterance) synth.cancel();
    if (steps.length > 0) {
      const textToSpeak = steps.join('. ');
      const utterance = new window.SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.5;
      setCurrentUtterance(utterance);
      synth.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  if (!recipe) return <p className="text-red-500">Recipe not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-4 text-green-600 hover:underline">← Back</button>
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="my-4 rounded w-full max-h-96 object-cover" />}
      <p>{recipe.description}</p>
      <p className="mt-2 text-sm text-gray-500">Estimated Calories: {recipe.calories}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-black">{instructions}</pre>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSpeak} disabled={isSpeaking} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">🔊 Speak</button>
          <button onClick={handleStop} disabled={!isSpeaking} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">✋ Stop</button>
          <button onClick={handleRestart} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">⏮️ Restart</button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice recognition setup
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIngredients(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

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

      // ✅ Add this line to switch to the recipes section
      setActiveSection('recipes');
    } catch (err) {
      console.error('❌ Error fetching recipes:', err);
    }
  };


  const cards = [
    {
      title: "AI Recipe Suggestions",
      description: "Get creative recipe ideas using ingredients you have at home with Spoonacular.",
      icon: <FaUtensils className="text-green-600 text-2xl" />,
      section: "recipes"
    },
    {
      title: "Weekly Meal Planner",
      description: "Plan your meals for the week with a personalized meal plan.",
      icon: <FaCalendarAlt className="text-green-600 text-2xl" />,
      section: "planner"
    },
    {
      title: "Voice Mode",
      description: "Listen to the recipe instructions read aloud.",
      icon: <FaVolumeUp className="text-green-600 text-2xl" />,
      section: "voice"
    },
    {
      title: "Profile Dashboard",
      description: "Track saved recipes and personalized recommendations.",
      icon: <FaUser className="text-green-600 text-2xl" />,
      section: "profile"
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-8">
      <div className="relative mb-6 flex items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-300 text-center">
          Welcome to SmartChef AI 🍽️
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setActiveSection(card.section)}
            className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-xl shadow hover:shadow-xl cursor-pointer transition border border-green-100 hover:border-green-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
              {card.icon}
              {card.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {activeSection === 'planner' && <Planner />}
        {activeSection === 'profile' && <Profile />}
        {activeSection === 'voice' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-green-600 text-lg">
              Speak the ingredients you have, and get recipe suggestions!
            </p>
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded text-white ${isListening ? 'bg-red-600' : 'bg-green-600'} hover:bg-green-700`}
            >
              {isListening ? 'Stop Listening' : 'Start Voice Input'}
            </button>
            <input
              type="text"
              placeholder="Recognized ingredients will appear here"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full max-w-md text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700"
            >
              Get Recipe Suggestions
            </button>
          </div>
        )}

        {activeSection === 'recipes' && !selectedRecipe && (
          <>
            <div className="mb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // prevent default form submission
            
                  handleSearch();
                }}
              >
                <input
                  type="text"
                  placeholder="e.g. tomato,onion,cheese"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded w-full text-black"
                  required
                />
      
                <button
                  type="submit"
                  className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700"
                >
                  Search
                </button>
              </form>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipe(r)}
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

        {activeSection === 'recipes' && selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />
        )}
      </div>
      <Footer />
      <div id="about-us-section"></div>
    </div>
  );
};

export default Home;

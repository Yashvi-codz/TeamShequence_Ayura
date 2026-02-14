'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import PantryItems from '@/components/pantry/PantryItems';
import RecipeResults from '@/components/pantry/RecipeResults';
import SuggestedIngredients from '@/components/pantry/SuggestedIngredients';
import PantryStats from '@/components/pantry/PantryStats';

export default function PantryPage() {
  const router = useRouter();
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedRecipes, setMatchedRecipes] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('manage'); // manage | results

  // Verify token on mount
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
    
    // Load saved pantry items from localStorage
    const saved = localStorage.getItem('pantryItems');
    if (saved) {
      setPantryItems(JSON.parse(saved));
    }
  }, [router]);

  // Save pantry items to localStorage
  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }, [pantryItems]);

  // Add item to pantry
  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === '') {
      setError('Please enter an item');
      return;
    }

    const itemLower = newItem.toLowerCase().trim();
    if (pantryItems.includes(itemLower)) {
      setError('Item already in pantry');
      setNewItem('');
      return;
    }

    setPantryItems([...pantryItems, itemLower]);
    setNewItem('');
    setError('');
  };

  // Remove item from pantry
  const handleRemoveItem = (itemToRemove) => {
    setPantryItems(pantryItems.filter(item => item !== itemToRemove));
  };

  // Add suggested ingredient
  const handleAddSuggested = (ingredient) => {
    if (!pantryItems.includes(ingredient)) {
      setPantryItems([...pantryItems, ingredient]);
    }
  };

  // Generate recipes based on pantry items
  const handleGenerateRecipes = async () => {
    if (pantryItems.length === 0) {
      setError('Please add items to your pantry first');
      return;
    }

    setSearching(true);
    setError('');
    setMatchedRecipes(null);
    setActiveTab('results');

    try {
      // Call backend API
      const response = await fetch('/api/recipes/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ pantryItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      if (!data.recipes || data.recipes.length === 0) {
        setError('No recipes found with your pantry items. Try adding more items!');
        setMatchedRecipes({
          recipes: [],
          matchedRecipes: [],
          totalRecipes: 0
        });
      } else {
        setMatchedRecipes(data);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(`Failed to fetch recipes: ${err.message}`);
      setMatchedRecipes(null);
      setActiveTab('manage');
    } finally {
      setSearching(false);
    }
  };

  // Clear all pantry items
  const handleClearPantry = () => {
    if (confirm('Are you sure you want to clear all items?')) {
      setPantryItems([]);
      setMatchedRecipes(null);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 py-6 px-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-dark-text">🥘 My Pantry</h1>
              <p className="text-gray-text">Manage your ingredients and discover recipes</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{pantryItems.length}</div>
              <p className="text-sm text-gray-text">Items Added</p>
            </div>
          </div>

          {/* Tab Navigation (Mobile) */}
          <div className="lg:hidden flex gap-2">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-dark-text'
              }`}
            >
              Manage Items
            </button>
            {matchedRecipes && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'results'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-dark-text'
                }`}
              >
                Recipes ({matchedRecipes.recipes?.length || 0})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Show Stats when recipes are matched */}
        {matchedRecipes && <PantryStats pantryItems={pantryItems} matchedRecipes={matchedRecipes.recipes} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Items (Desktop) or Tab Content */}
          <div className={`lg:col-span-1 ${activeTab === 'manage' ? '' : 'hidden lg:block'}`}>
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold text-dark-text mb-6">Add Items</h2>

              {/* Add Item Form */}
              <form onSubmit={handleAddItem} className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g., tomato, rice, chicken"
                    className="input-field flex-1 lowercase"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn-primary px-4 whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </form>

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Pantry Items Display */}
              <PantryItems items={pantryItems} onRemove={handleRemoveItem} />

              {/* Suggested Ingredients */}
              <SuggestedIngredients
                onSelectIngredient={handleAddSuggested}
                pantryItems={pantryItems}
              />

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleGenerateRecipes}
// Continue from: onClick={handleGenerateRecipes}

                  disabled={pantryItems.length === 0 || searching}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    pantryItems.length === 0 || searching
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {searching ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Finding Recipes...
                    </span>
                  ) : (
                    '🔍 Generate Recipes'
                  )}
                </button>

                {pantryItems.length > 0 && (
                  <button
                    onClick={handleClearPantry}
                    className="w-full btn-secondary"
                  >
                    Clear Pantry
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <p className="text-sm text-gray-text mb-2">
                  <span className="font-semibold text-primary">
                    {pantryItems.length}
                  </span>{' '}
                  items in pantry
                </p>
                {matchedRecipes && (
                  <>
                    <p className="text-sm text-gray-text mb-1">
                      <span className="font-semibold text-green-600">
                        {matchedRecipes.recipes?.length || 0}
                      </span>{' '}
                      recipes found
                    </p>
                    <p className="text-xs text-gray-text">
                      From <span className="font-semibold">{matchedRecipes.totalRecipes}</span> total recipes
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recipe Results (Desktop) or Tab Content */}
          <div className={`lg:col-span-2 ${activeTab === 'results' ? '' : 'hidden lg:block'}`}>
            {matchedRecipes ? (
              <>
                {error && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
                    <p className="font-semibold">⚠️ {error}</p>
                  </div>
                )}
                <RecipeResults
                  matchedRecipes={matchedRecipes.recipes}
                  pantryItems={pantryItems}
                />
              </>
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🍳</div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">
                  No Recipes Yet
                </h3>
                <p className="text-gray-text mb-6">
                  Add items to your pantry and click "Generate Recipes" to discover
                  what you can cook!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-900 font-semibold mb-2">💡 Tips:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Add at least 3-5 items for better results</li>
                    <li>• Include common ingredients like rice, oil, salt</li>
                    <li>• Add proteins like chicken, fish, or paneer</li>
                    <li>• Include vegetables for nutritious recipes</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-3 lg:hidden">
        <div className="max-w-6xl mx-auto px-4 flex justify-around">
          <a href="/app/dashboard" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">Home</span>
          </a>
          <a href="/app/meals" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🍽️</span>
            <span className="text-xs font-semibold">Meals</span>
          </a>
          <a href="/app/pantry" className="flex flex-col items-center text-primary">
            <span className="text-2xl">🥘</span>
            <span className="text-xs font-semibold">Pantry</span>
          </a>
          <a href="/app/food-checker" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">🔍</span>
            <span className="text-xs font-semibold">Checker</span>
          </a>
          <a href="/app/profile" className="flex flex-col items-center text-gray-text hover:text-primary">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}

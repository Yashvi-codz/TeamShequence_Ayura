'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MealsPage() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({ mealType: 'all', difficulty: 'all', search: '' });

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/recipes?${params}`);
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text mb-2">🍽️ Your Personalized Meals</h1>
        <p className="text-gray-text mb-6">Recipes tailored to your dosha and health goals</p>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Meal Type</label>
              <select
                className="input-field"
                value={filters.mealType}
                onChange={(e) => setFilters({...filters, mealType: e.target.value})}
              >
                <option value="all">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Difficulty</label>
              <select
                className="input-field"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                className="input-field"
                placeholder="Search meals..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe._id} className="card hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-primary-light to-primary/30 rounded-lg mb-4 flex items-center justify-center text-6xl">
                🍲
              </div>
              <div className="text-xs font-semibold text-primary mb-2 uppercase">
                {recipe.mealType}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {recipe.name}
              </h3>
              <p className="text-gray-text mb-4 text-sm">{recipe.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>⏱️ {recipe.prepTime} min</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">{recipe.difficulty}</span>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-sm mb-4">
                {recipe.doshaExplanation}
              </div>
              <Link href={`/app/meals/${recipe._id}`} className="btn-primary w-full text-center">
                View Recipe
              </Link>
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-20 text-gray-text">
            <p className="text-xl">No recipes found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

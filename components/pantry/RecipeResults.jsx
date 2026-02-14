'use client';

import { useState } from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeResults({ matchedRecipes, pantryItems }) {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  if (!matchedRecipes || matchedRecipes.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">
          No Matching Recipes Found
        </h3>
        <p className="text-gray-text mb-6">
          Try adding more items to your pantry to find recipes
        </p>
        <button className="btn-primary inline-block">
          ← Back to Pantry
        </button>
      </div>
    );
  }

  // Calculate aggregate stats
  const topMatch = matchedRecipes[0]?.matchPercentage || 0;
  const avgMatch = Math.round(
    matchedRecipes.reduce((sum, r) => sum + r.matchPercentage, 0) / matchedRecipes.length
  );

  return (
    <div>
      {/* Results Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dark-text mb-2">
          🍽️ Recommended Recipes
        </h2>
        <p className="text-gray-text mb-4">
          Ranked by ingredient match ({matchedRecipes.length} recipes found)
        </p>

        {/* Result Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              {matchedRecipes.length}
            </div>
            <p className="text-xs text-gray-text">Total Found</p>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {topMatch}%
            </div>
            <p className="text-xs text-gray-text">Top Match</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {avgMatch}%
            </div>
            <p className="text-xs text-gray-text">Avg Match</p>
          </div>
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pantryItems.length}
            </div>
            <p className="text-xs text-gray-text">Your Items</p>
          </div>
        </div>
      </div>

      {/* Recipe Cards */}
      <div className="space-y-4">
        {matchedRecipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            rank={index + 1}
            isExpanded={expandedRecipe === index}
            onToggle={() =>
              setExpandedRecipe(expandedRecipe === index ? null : index)
            }
          />
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <p className="font-semibold mb-2">💡 Recipe Suggestions:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Start with recipes that have 60%+ ingredient match</li>
          <li>You can substitute missing ingredients with similar items</li>
          <li>Add missing items to your pantry for more recipe options</li>
          <li>Expand each recipe to see detailed ingredient breakdown</li>
        </ul>
      </div>
    </div>
  );
}

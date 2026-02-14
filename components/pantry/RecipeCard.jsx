'use client';

import { useState } from 'react';
import { calculateDifficulty } from '@/lib/recipeService';

export default function RecipeCard({ recipe, rank, isExpanded, onToggle }) {
  const matchPercentage = recipe.matchPercentage || 0;
  const difficulty = calculateDifficulty(matchPercentage);

  const matchColor =
    matchPercentage >= 80
      ? 'bg-green-100 border-green-500 text-green-700'
      : matchPercentage >= 60
      ? 'bg-blue-100 border-blue-500 text-blue-700'
      : matchPercentage >= 40
      ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
      : 'bg-orange-100 border-orange-500 text-orange-700';

  const badgeColor =
    matchPercentage >= 80
      ? 'bg-green-500'
      : matchPercentage >= 60
      ? 'bg-blue-500'
      : matchPercentage >= 40
      ? 'bg-yellow-500'
      : 'bg-orange-500';

  return (
    <div
      className={`card border-l-4 transition-all cursor-pointer hover:shadow-xl ${matchColor}`}
      onClick={onToggle}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* Recipe Title and Rank */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {rank}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-dark-text capitalize">
                {recipe.title}
              </h3>
              <p className="text-xs text-gray-text">
                Difficulty: {difficulty}
              </p>
            </div>
          </div>

          {/* Match Stats */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white border border-current">
              {recipe.matchedCount}/{recipe.totalIngredients} ingredients
            </span>
            <div className="w-40 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${badgeColor}`}
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
            <span className="font-bold">{matchPercentage}%</span>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-xs text-gray-text">
            <span>✓ Have: {recipe.matchedCount}</span>
            <span>✗ Need: {recipe.missingIngredients.length}</span>
          </div>
        </div>

        {/* Expand Toggle */}
        <div className={`text-2xl transform transition-transform ml-4 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t-2 border-gray-300 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Ingredients */}
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-lg">✓</span> Have in Pantry ({recipe.matchedCount})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recipe.matchedIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="capitalize text-dark-text bg-green-50 px-2 py-1 rounded flex-1">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Ingredients */}
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <span className="text-lg">✗</span> Need to Buy ({recipe.missingIngredients.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recipe.missingIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-red-600 font-bold">✗</span>
                    <span className="capitalize text-gray-text bg-red-50 px-2 py-1 rounded flex-1">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex gap-2">
            <button className="flex-1 btn-primary py-2">
              👨‍🍳 View Recipe
            </button>
            <button className="flex-1 btn-secondary py-2">
              ➕ Add Missing Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

const COMMON_INGREDIENTS = [
  'rice', 'wheat', 'salt', 'oil', 'butter', 'milk', 'yogurt',
  'chicken', 'fish', 'mutton', 'paneer', 'tofu',
  'tomato', 'onion', 'garlic', 'ginger', 'potato', 'carrot',
  'green peas', 'spinach', 'cabbage', 'cucumber', 'bell pepper',
  'turmeric', 'cumin', 'coriander', 'chili powder', 'garam masala',
  'lemon', 'coconut', 'cashew', 'peanut', 'sesame',
];

export default function SuggestedIngredients({ onSelectIngredient, pantryItems }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableSuggestions = COMMON_INGREDIENTS.filter(
    ing => !pantryItems.includes(ing)
  );

  if (availableSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="text-sm text-primary font-semibold hover:underline"
      >
        {showSuggestions ? '▼' : '▶'} Suggested Ingredients
      </button>

      {showSuggestions && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableSuggestions.slice(0, 12).map((ing, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIngredient(ing)}
              className="text-xs px-2 py-1 bg-primary/10 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-all"
            >
              + {ing}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// app/meals/page.jsx
'use client';

import { useState } from 'react';

function MealCard({ meal }) {
  const doshaLabel =
    meal.doshaTag === 'highly_balancing'
      ? '🌿 Highly Balancing'
      : meal.doshaTag === 'neutral'
      ? '⚖️ Neutral'
      : '🔥 Aggravating';

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-1">{meal.name}</h2>
        <p className="text-sm text-emerald-700 mb-2">
          Dosha Tag: {doshaLabel}
        </p>
        <p className="text-sm text-gray-700 mb-1">
          Pantry Match:{' '}
          <span className="font-medium">{meal.pantryMatchPercent}%</span>
        </p>
        <p className="text-sm text-gray-700 mb-1">
          Missing Ingredients: {meal.missingIngredients.length}{' '}
          {meal.missingIngredients.length > 0 &&
            `(${meal.missingIngredients.join(', ')})`}
        </p>
        {meal.cookTimeMinutes && (
          <p className="text-sm text-gray-700 mb-1">
            Cooking Time: {meal.cookTimeMinutes} min
          </p>
        )}
        {meal.macros && (
          <p className="text-xs text-gray-500 mt-1">
            {meal.macros.calories && `${meal.macros.calories} kcal · `}
            {meal.macros.protein && `${meal.macros.protein}g protein · `}
            {meal.macros.carbs && `${meal.macros.carbs}g carbs`}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-3">
        Why this works for you: This meal supports your constitution by using
        warm, grounding ingredients and minimizing aggravating foods for your dosha.
      </p>
    </div>
  );
}

export default function MealsPage() {
  const [pantryInput, setPantryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const pantryItems = pantryInput
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // if JWT is in cookie, no need to send Authorization
        },
        body: JSON.stringify({ pantryItems }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setMeals([]);
      } else {
        setMeals(data.meals || []);
      }
    } catch (err) {
      setError('Network error');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-4">Meal Generator</h1>
      <p className="text-gray-600 mb-6">
        Add what you have in your kitchen, and Ayura will generate dosha-friendly meals.
      </p>

      <form onSubmit={handleGenerate} className="mb-8 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Pantry items (one per line)
        </label>
        <textarea
          className="w-full border rounded-md p-3 h-40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder={'Rice\nMoong dal\nGhee\nCarrot\nJeera\nTurmeric'}
          value={pantryInput}
          onChange={e => setPantryInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Meals'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {meals.map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {!loading && meals.length === 0 && !error && (
        <p className="text-gray-500">
          No meals yet. Add your pantry items above and click Generate.
        </p>
      )}
    </div>
  );
}

'use client';

export default function PantryStats({ pantryItems, matchedRecipes }) {
  const totalRecipes = matchedRecipes?.length || 0;
  const averageMatch = matchedRecipes?.length > 0
    ? Math.round(
        matchedRecipes.reduce((sum, recipe) => sum + recipe.matchPercentage, 0) /
          matchedRecipes.length
      )
    : 0;

  const topMatch = matchedRecipes?.[0]?.matchPercentage || 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="card text-center">
        <div className="text-3xl font-bold text-primary">
          {pantryItems.length}
        </div>
        <p className="text-sm text-gray-text">Items in Pantry</p>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-green-600">{totalRecipes}</div>
        <p className="text-sm text-gray-text">Recipes Found</p>
      </div>

      <div className="card text-center">
        <div className="text-3xl font-bold text-blue-600">{topMatch}%</div>
        <p className="text-sm text-gray-text">Best Match</p>
      </div>
    </div>
  );
}

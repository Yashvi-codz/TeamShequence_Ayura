// lib/recipeService.js

const FOODOSCOPE_API_BASE = process.env.NEXT_PUBLIC_FOODOSCOPE_API_BASE || 
  'http://cosylab.iiitd.edu.in:6969/recipe2-api/recipe/recipe-day/with-ingredients-categories?excludeIngredients=water,flour&excludeCategories=Dairy';

const FOODOSCOPE_API_KEY = process.env.NEXT_PUBLIC_FOODOSCOPE_API_KEY || 
  '0C_pgezIaAEnPd3dP5zXcHLQL4vgqoQUt78lzCYgq0d4088B';

/**
 * Normalize ingredient name for comparison
 */
function normalizeIngredient(ingredient) {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ''); // Remove special characters
}

/**
 * Check if two ingredients match (with fuzzy matching)
 */
function ingredientsMatch(pantryItem, recipeIngredient) {
  const normalized1 = normalizeIngredient(pantryItem);
  const normalized2 = normalizeIngredient(recipeIngredient);

  // Exact match
  if (normalized1 === normalized2) return true;

  // Substring match
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }

  // Word-level fuzzy matching
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');

  // Check if any word from pantry matches any word from recipe
  for (let word1 of words1) {
    for (let word2 of words2) {
      if (word1 === word2 && word1.length > 2) {
        // Only match words longer than 2 characters
        return true;
      }
    }
  }

  return false;
}

/**
 * Match pantry items with recipe ingredients
 */
function matchPantryWithRecipe(pantryItems, recipe) {
  const ingredients = recipe.ingredients || [];
  const matchedIngredients = [];
  const missingIngredients = [];

  // Iterate through recipe ingredients
  ingredients.forEach(recipeIngredient => {
    const matched = pantryItems.some(pantryItem =>
      ingredientsMatch(pantryItem, recipeIngredient)
    );

    if (matched) {
      matchedIngredients.push(recipeIngredient);
    } else {
      missingIngredients.push(recipeIngredient);
    }
  });

  return {
    title: recipe.title,
    matchedCount: matchedIngredients.length,
    totalIngredients: ingredients.length,
    matchedIngredients,
    missingIngredients,
    matchPercentage: ingredients.length > 0 
      ? Math.round((matchedIngredients.length / ingredients.length) * 100)
      : 0,
    recipe // Keep original recipe data
  };
}

/**
 * Fetch recipes from RecipeDB API and match with pantry items
 */
export async function fetchRecipesAndMatch(pantryItems) {
  try {
    console.log('Fetching recipes from API...');
    
    // Fetch recipes from the API
    const response = await fetch(FOODOSCOPE_API_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FOODOSCOPE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Extract recipes array
    const recipesArray = Array.isArray(data) ? data : (data.recipes || data.data || []);

    if (!Array.isArray(recipesArray) || recipesArray.length === 0) {
      console.warn('No recipes found in API response');
      return {
        recipes: [],
        matchedRecipes: [],
        totalRecipes: 0
      };
    }

    // Match each recipe with pantry items
    const matchedRecipes = recipesArray
      .map(recipe => matchPantryWithRecipe(pantryItems, recipe))
      .filter(recipe => recipe.matchedCount > 0) // Only recipes with at least 1 match
      .sort((a, b) => {
        // Sort by: match count (desc), then match percentage (desc)
        if (b.matchedCount !== a.matchedCount) {
          return b.matchedCount - a.matchedCount;
        }
        return b.matchPercentage - a.matchPercentage;
      });

    console.log('Matched Recipes:', matchedRecipes);

    return {
      recipes: matchedRecipes,
      matchedRecipes: matchedRecipes,
      totalRecipes: recipesArray.length,
      pantryCount: pantryItems.length,
      matchedCount: matchedRecipes.length
    };
  } catch (error) {
    console.error('Error fetching/matching recipes:', error);
    throw new Error(`Recipe matching failed: ${error.message}`);
  }
}

/**
 * Get recipe suggestions based on available ingredients
 */
export function getRecipeSuggestions(matchedRecipes) {
  if (!matchedRecipes || matchedRecipes.length === 0) {
    return [];
  }

  return matchedRecipes.slice(0, 10); // Return top 10 matches
}

/**
 * Calculate cooking difficulty based on matched ingredients
 */
export function calculateDifficulty(matchPercentage) {
  if (matchPercentage >= 90) return 'Very Easy';
  if (matchPercentage >= 75) return 'Easy';
  if (matchPercentage >= 60) return 'Medium';
  if (matchPercentage >= 40) return 'Challenging';
  return 'Very Challenging';
}

// lib/recipeAPI.js
// This is a utility for making API calls to RecipeDB

const API_BASE = process.env.NEXT_PUBLIC_FOODOSCOPE_API_BASE;
const API_KEY = process.env.NEXT_PUBLIC_FOODOSCOPE_API_KEY;

export async function getRecipesWithoutIngredients(excludeIngredients = [], excludeCategories = []) {
  try {
    let url = API_BASE;

    // Add query parameters if needed
    const params = new URLSearchParams();
    
    if (excludeIngredients.length > 0) {
      params.append('excludeIngredients', excludeIngredients.join(','));
    }
    
    if (excludeCategories.length > 0) {
      params.append('excludeCategories', excludeCategories.join(','));
    }

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Recipe API Error:', error);
    throw error;
  }
}

export async function getRecipesByIngredients(ingredients = []) {
  try {
    const url = `${API_BASE}?ingredients=${ingredients.join(',')}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Recipe API Error:', error);
    throw error;
  }
}

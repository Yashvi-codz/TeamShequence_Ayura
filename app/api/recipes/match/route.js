// app/api/recipes/match/route.js

import { NextResponse } from 'next/server';
import { fetchRecipesAndMatch } from '@/lib/recipeService';

export async function POST(request) {
  try {
    const { pantryItems } = await request.json();

    if (!pantryItems || !Array.isArray(pantryItems) || pantryItems.length === 0) {
      return NextResponse.json(
        { error: 'Please provide pantry items' },
        { status: 400 }
      );
    }

    // Fetch and match recipes
    const results = await fetchRecipesAndMatch(pantryItems);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Recipe matching API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to match recipes' },
      { status: 500 }
    );
  }
}

// lib/ingredientNormalizer.js

// Common ingredient synonyms for better matching
const INGREDIENT_SYNONYMS = {
  'rice': ['basmati', 'white rice', 'brown rice', 'jasmine rice'],
  'oil': ['vegetable oil', 'cooking oil', 'olive oil', 'sunflower oil', 'ghee'],
  'salt': ['sea salt', 'table salt'],
  'butter': ['ghee', 'clarified butter'],
  'milk': ['whole milk', 'full fat milk'],
  'yogurt': ['curd', 'dahi'],
  'chicken': ['poultry', 'bird meat'],
  'fish': ['seafood', 'salmon', 'tuna', 'cod'],
  'tomato': ['tom', 'tamatar'],
  'onion': ['pyaj'],
  'garlic': ['lahsun'],
  'ginger': ['adrak'],
  'potato': ['aloo'],
  'carrot': ['gajjar'],
  'spinach': ['palak', 'spinash'],
  'paneer': ['cottage cheese', 'panir'],
  'turmeric': ['haldi'],
  'cumin': ['jeera'],
  'coriander': ['dhania'],
  'chili': ['mirchi', 'red chili', 'green chili'],
  'garam masala': ['spice mix'],
  'cashew': ['kaju'],
  'peanut': ['groundnut', 'moongphali'],
};

export function normalizeIngredient(ingredient) {
  if (!ingredient) return '';
  
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

export function getIngredientVariations(ingredient) {
  const normalized = normalizeIngredient(ingredient);
  const variations = new Set([normalized]);

  // Add direct synonyms
  if (INGREDIENT_SYNONYMS[normalized]) {
    INGREDIENT_SYNONYMS[normalized].forEach(syn =>
      variations.add(normalizeIngredient(syn))
    );
  }

  // Check if this ingredient is a synonym of something else
  Object.values(INGREDIENT_SYNONYMS).forEach(syns => {
    if (syns.some(syn => normalizeIngredient(syn) === normalized)) {
      syns.forEach(syn => variations.add(normalizeIngredient(syn)));
    }
  });

  return Array.from(variations);
}

export function findBestMatch(pantryItem, recipeIngredient) {
  const pantryVariations = getIngredientVariations(pantryItem);
  const recipeVariations = getIngredientVariations(recipeIngredient);

  // Check for any matching variations
  return pantryVariations.some(pVar =>
    recipeVariations.some(rVar => pVar === rVar)
  );
}

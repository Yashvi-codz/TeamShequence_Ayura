'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function RecipeGeneratorPage() {
  const [pantryItems, setPantryItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    category: 'vegetables'
  });
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [doshaResult, setDoshaResult] = useState(null);

  useEffect(() => {
    loadUserData();
    loadPantryItems();
  }, []);

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const doshaData = JSON.parse(localStorage.getItem('doshaResult') || '{}');
    setUser(userData);
    setDoshaResult(doshaData);
  };

  const loadPantryItems = async () => {
    const token = Cookies.get('token');
    try {
      const res = await fetch('/api/pantry/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPantryItems(data.items || []);
    } catch (err) {
      // Load from localStorage as fallback
      const saved = JSON.parse(localStorage.getItem('pantryItems') || '[]');
      setPantryItems(saved);
    }
  };

  const savePantryToLocalStorage = (items) => {
    localStorage.setItem('pantryItems', JSON.stringify(items));
  };

  const addItem = async () => {
    if (!formData.itemName || !formData.quantity) {
      alert('Please fill in item name and quantity');
      return;
    }

    const newItem = {
      _id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toISOString()
    };

    const token = Cookies.get('token');
    try {
      await fetch('/api/pantry/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
    } catch (err) {
      console.log('API failed, using localStorage');
    }

    const updatedItems = [...pantryItems, newItem];
    setPantryItems(updatedItems);
    savePantryToLocalStorage(updatedItems);
    
    setShowAddModal(false);
    resetForm();
  };

  const updateItem = () => {
    const updatedItems = pantryItems.map(item =>
      item._id === editingItem._id ? { ...editingItem, ...formData } : item
    );
    setPantryItems(updatedItems);
    savePantryToLocalStorage(updatedItems);
    setEditingItem(null);
    setShowAddModal(false);
    resetForm();
  };

  const deleteItem = (itemId) => {
    if (!confirm('Remove this item from pantry?')) return;
    
    const updatedItems = pantryItems.filter(item => item._id !== itemId);
    setPantryItems(updatedItems);
    savePantryToLocalStorage(updatedItems);
  };

  const clearExpiredItems = () => {
    const today = new Date().toISOString().split('T')[0];
    const nonExpired = pantryItems.filter(item => {
      if (!item.expiryDate) return true;
      return item.expiryDate >= today;
    });
    
    if (pantryItems.length === nonExpired.length) {
      alert('No expired items found!');
      return;
    }
    
    if (confirm(`Remove ${pantryItems.length - nonExpired.length} expired item(s)?`)) {
      setPantryItems(nonExpired);
      savePantryToLocalStorage(nonExpired);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate || '',
      category: item.category
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      quantity: '',
      unit: 'kg',
      expiryDate: '',
      category: 'vegetables'
    });
    setEditingItem(null);
  };

  const generateRecipe = async () => {
    if (pantryItems.length === 0) {
      alert('Add items to your pantry first!');
      return;
    }

    setLoading(true);
    const token = Cookies.get('token');
    
    try {
      const res = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      setGeneratedRecipe(data.recipe);
    } catch (err) {
      console.error(err);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = () => {
    if (!generatedRecipe) return;
    
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    savedRecipes.push({
      ...generatedRecipe,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    alert('Recipe saved successfully! ✅');
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring-soon';
    return 'good';
  };

  const categories = {
    vegetables: '🥬 Vegetables',
    grains: '🌾 Grains',
    spices: '🌶️ Spices',
    oils: '🫒 Oils',
    herbs: '🌿 Herbs',
    dairy: '🥛 Dairy',
    proteins: '🍖 Proteins',
    fruits: '🍎 Fruits'
  };

  const units = ['kg', 'grams', 'liters', 'ml', 'pieces', 'cups', 'tbsp', 'tsp'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/app/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            🍳 Recipe Generator - Cook with What You Have
          </h1>
          <p className="text-xl text-gray-text">
            Generate dosha-aligned recipes from your pantry ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section A: Pantry Management */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-text">📦 Manage Your Pantry</h2>
              <div className="flex gap-2">
                {pantryItems.some(item => getExpiryStatus(item.expiryDate) === 'expired') && (
                  <button
                    onClick={clearExpiredItems}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear Expired
                  </button>
                )}
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  className="btn-primary"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {pantryItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-lg text-gray-text mb-4">Your pantry is empty</p>
                <p className="text-sm text-gray-text mb-6">
                  Add ingredients to generate personalized recipes
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                >
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {pantryItems.map(item => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  return (
                    <div
                      key={item._id}
                      className={`p-4 rounded-lg border-2 ${
                        expiryStatus === 'expired'
                          ? 'bg-red-50 border-red-300'
                          : expiryStatus === 'expiring-soon'
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{categories[item.category]?.split(' ')[0]}</span>
                            <h3 className="font-bold text-lg text-dark-text">{item.itemName}</h3>
                            {expiryStatus === 'expired' && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                                Expired
                              </span>
                            )}
                            {expiryStatus === 'expiring-soon' && (
                              <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                                Expiring Soon
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-text space-y-1">
                            <p>
                              <span className="font-semibold">Quantity:</span> {item.quantity} {item.unit}
                            </p>
                            <p>
                              <span className="font-semibold">Category:</span> {categories[item.category]}
                            </p>
                            {item.expiryDate && (
                              <p>
                                <span className="font-semibold">Expires:</span>{' '}
                                {new Date(item.expiryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {pantryItems.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-900">
                  💡 <span className="font-semibold">Total items:</span> {pantryItems.length} |{' '}
                  <span className="font-semibold">Expiring soon:</span>{' '}
                  {pantryItems.filter(i => getExpiryStatus(i.expiryDate) === 'expiring-soon').length}
                </p>
              </div>
            )}
          </div>

          {/* Section B: Recipe Generator */}
          <div className="card">
            <h2 className="text-2xl font-bold text-dark-text mb-6">✨ Generate Recipe</h2>

            {!generatedRecipe ? (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-primary-light/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-dark-text">
                    Let AI Create Your Perfect Meal
                  </h3>
                  <ul className="space-y-3 text-sm text-dark-text">
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <span>Uses ingredients from your pantry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <span>Aligned with your {doshaResult?.dominant || ''} dosha</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <span>Considers your health goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <span>Respects dietary restrictions</span>
                    </li>
                  </ul>
                </div>

                {pantryItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-dark-text">Will use these ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pantryItems.slice(0, 8).map(item => (
                        <span
                          key={item._id}
                          className="px-3 py-1 bg-white border-2 border-primary/30 rounded-full text-sm"
                        >
                          {item.itemName}
                        </span>
                      ))}
                      {pantryItems.length > 8 && (
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                          +{pantryItems.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={generateRecipe}
                  disabled={loading || pantryItems.length === 0}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your recipe...
                    </span>
                  ) : (
                    '✨ Generate My Recipe'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-2xl font-bold text-dark-text mb-2">
                    {generatedRecipe.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="px-3 py-1 bg-white rounded-full">
                      ⏱️ {generatedRecipe.prepTime} min
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full capitalize">
                      👨‍🍳 {generatedRecipe.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full">
                      🍽️ {generatedRecipe.servings} servings
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-bold mb-2 text-dark-text">
                    Perfect for {generatedRecipe.doshaAlignment}
                  </h4>
                  <p className="text-sm text-dark-text">{generatedRecipe.doshaExplanation}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-dark-text text-lg">Ingredients:</h4>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <input type="checkbox" className="w-5 h-5" />
                        <span>
                          <span className="font-semibold">{ing.name}</span>: {ing.quantity} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-dark-text text-lg">Instructions:</h4>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <p className="pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={saveRecipe} className="btn-primary">
                    💾 Save Recipe
                  </button>
                  <button
                    onClick={() => setGeneratedRecipe(null)}
                    className="btn-secondary"
                  >
                    ✨ Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-dark-text">
              {editingItem ? 'Edit Item' : 'Add Item to Pantry'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-dark-text">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g., Rice, Tomatoes, Turmeric"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-dark-text">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    className="input-field"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark-text">Unit *</label>
                  <select
                    className="input-field"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark-text">
                  Category *
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {Object.entries(categories).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark-text">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingItem ? updateItem : addItem}
                  className="btn-primary flex-1"
                >
                  {editingItem ? 'Update Item' : 'Add to Pantry'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
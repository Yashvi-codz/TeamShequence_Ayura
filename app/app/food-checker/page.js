'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FoodCheckerPage() {
  const [food1, setFood1] = useState('');
  const [food2, setFood2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentChecks, setRecentChecks] = useState([]);

  const foodOptions = [
    'Milk', 'Fish', 'Banana', 'Honey', 'Ghee', 'Rice', 'Mung Dal', 
    'Yogurt', 'Fruit', 'Lemon', 'Meat', 'Eggs', 'Cheese', 'Hot Water',
    'Cold Water', 'Cucumber', 'Watermelon', 'Mango', 'Tea', 'Coffee',
    'Tomato', 'Potato', 'Spinach', 'Onion', 'Garlic', 'Ginger'
  ];

  const checkCompatibility = async () => {
    if (!food1 || !food2) {
      alert('Please select both foods');
      return;
    }

    if (food1 === food2) {
      alert('Please select different foods');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/app/food-checker/food-combo?food1=${food1.toLowerCase()}&food2=${food2.toLowerCase()}`);
      const data = await res.json();
      setResult(data);
      
      // Add to recent checks
      const newCheck = { food1, food2, compatibility: data.compatibility };
      setRecentChecks(prev => [newCheck, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error(err);
      alert('Failed to check compatibility');
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (comp) => {
    if (comp === 'excellent') return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', icon: '✅' };
    if (comp === 'good') return { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800', icon: '⚠️' };
    return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: '❌' };
  };

  const getDoshaColor = (impact) => {
    if (impact.includes('balance')) return 'text-green-600';
    if (impact.includes('increase') || impact.includes('severe')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/app/learn" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Learn
          </Link>
          <h1 className="text-4xl font-bold text-dark-text mb-2">🍽️ Food Compatibility Checker</h1>
          <p className="text-xl text-gray-text">
            Discover which food combinations are beneficial or harmful according to Ayurveda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checker */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 text-dark-text">Check Food Combination</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold mb-2 text-dark-text">First Food</label>
                  <select
                    value={food1}
                    onChange={(e) => setFood1(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select first food...</option>
                    {foodOptions.map(food => (
                      <option key={food} value={food}>{food}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-dark-text">Second Food</label>
                  <select
                    value={food2}
                    onChange={(e) => setFood2(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select second food...</option>
                    {foodOptions.map(food => (
                      <option key={food} value={food}>{food}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={checkCompatibility}
                disabled={!food1 || !food2 || loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </span>
                ) : (
                  '✨ Check Compatibility'
                )}
              </button>

              {/* Result */}
              {result && (
                <div className={`mt-8 p-6 rounded-xl border-l-4 ${getCompatibilityColor(result.compatibility).bg} ${getCompatibilityColor(result.compatibility).border}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{getCompatibilityColor(result.compatibility).icon}</span>
                    <div>
                      <h3 className={`text-2xl font-bold capitalize ${getCompatibilityColor(result.compatibility).text}`}>
                        {result.compatibility}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {food1} + {food2}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-2 text-dark-text">Why?</h4>
                      <p className="text-dark-text leading-relaxed">{result.explanation}</p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3 text-dark-text">Dosha Impact:</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(result.doshaImpact).map(([dosha, impact]) => (
                          <div key={dosha} className="bg-white p-3 rounded-lg text-center">
                            <div className="font-semibold capitalize text-sm mb-1">{dosha}</div>
                            <div className={`text-xs font-medium capitalize ${getDoshaColor(impact)}`}>
                              {impact}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.alternatives && result.alternatives.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-2 text-dark-text">Better Alternatives:</h4>
                        <ul className="space-y-2">
                          {result.alternatives.map((alt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">→</span>
                              <span className="text-dark-text">{alt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card bg-gradient-to-br from-primary/10 to-primary-light/20">
              <h3 className="text-xl font-bold mb-4 text-dark-text">💡 Did You Know?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-dark-text">Incompatible foods can create toxins (ama) in the body</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-dark-text">Food combining affects digestion and nutrient absorption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-dark-text">Proper combinations enhance agni (digestive fire)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-dark-text">Wait 1-2 hours between incompatible foods</span>
                </li>
              </ul>
            </div>

            {/* Recent Checks */}
            {recentChecks.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-bold mb-4 text-dark-text">Recent Checks</h3>
                <div className="space-y-2">
                  {recentChecks.map((check, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFood1(check.food1);
                        setFood2(check.food2);
                        checkCompatibility();
                      }}
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark-text">
                          {check.food1} + {check.food2}
                        </span>
                        <span className="text-xs">
                          {getCompatibilityColor(check.compatibility).icon}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Common Incompatibilities */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4 text-dark-text">❌ Common Incompatibilities</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Milk + Fish',
                  'Milk + Meat',
                  'Honey + Ghee (equal)',
                  'Yogurt + Fruit',
                  'Hot + Cold (same meal)',
                  'Lemon + Milk'
                ].map((combo, idx) => (
                  <div key={idx} className="p-2 bg-red-50 rounded text-red-800">
                    {combo}
                  </div>
                ))}
              </div>
            </div>

            {/* Good Combinations */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4 text-dark-text">✅ Excellent Combinations</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Rice + Mung Dal',
                  'Milk + Banana',
                  'Ghee + Rice',
                  'Ginger + Honey',
                  'Turmeric + Milk'
                ].map((combo, idx) => (
                  <div key={idx} className="p-2 bg-green-50 rounded text-green-800">
                    {combo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
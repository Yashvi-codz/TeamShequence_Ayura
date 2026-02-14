'use client';
import { useState, useEffect } from 'react';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('doshas');
  const [expandedSection, setExpandedSection] = useState(null);
  const [foodCheck, setFoodCheck] = useState({ food1: '', food2: '', result: null });
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [userDosha, setUserDosha] = useState('pitta');

  useEffect(() => {
    const stored = localStorage.getItem('doshaResult');
    if (stored) {
      const result = JSON.parse(stored);
      setUserDosha(result.dominant);
      setExpandedSection(result.dominant);
    }
  }, []);

  const checkFoodCombo = async () => {
    if (!foodCheck.food1 || !foodCheck.food2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/learn/food-combos?food1=${foodCheck.food1}&food2=${foodCheck.food2}`);
      const data = await res.json();
      setFoodCheck({ ...foodCheck, result: data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutine = async (dosha) => {
    try {
      const res = await fetch(`/api/learn/routine?dosha=${dosha}`);
      const data = await res.json();
      setRoutine(data.routine);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'routine') {
      fetchRoutine(userDosha);
    }
  }, [activeTab, userDosha]);

  const foodOptions = ['milk', 'fish', 'ghee', 'honey', 'rice', 'mung dal', 'yogurt', 'fruit', 'lemon', 'meat', 'banana'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text mb-2">📚 Learn About Ayurveda</h1>
        <p className="text-gray-text mb-6">Enhance your knowledge about wellness and healthy living</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'doshas', label: 'Dosha Learning' },
            { id: 'food', label: 'Food Compatibility' },
            { id: 'routine', label: 'Daily Routine' },
            { id: 'seasonal', label: 'Seasonal Tips' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark-text hover:bg-primary-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dosha Learning Tab */}
        {activeTab === 'doshas' && (
          <div className="space-y-4">
            {Object.entries(doshaInfo).map(([key, info]) => (
              <div key={key} className="card">
                <button
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{info.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: info.color }}>{info.name} Dosha</h3>
                      <p className="text-gray-text">{info.tagline}</p>
                    </div>
                  </div>
                  <span className="text-3xl">{expandedSection === key ? '−' : '+'}</span>
                </button>
                
                {expandedSection === key && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                    <p className="text-lg">{info.description}</p>
                    <div>
                      <h4 className="font-bold text-lg mb-3">Balancing Recommendations:</h4>
                      <ul className="space-y-2">
                        {info.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-xl">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Food Compatibility Tab */}
        {activeTab === 'food' && (
          <div className="card">
            <h3 className="text-2xl font-bold mb-6">Food Compatibility Checker</h3>
            <p className="text-gray-text mb-6">Check if food combinations are compatible in Ayurveda</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">First Food</label>
                <select
                  value={foodCheck.food1}
                  onChange={(e) => setFoodCheck({ ...foodCheck, food1: e.target.value, result: null })}
                  className="input-field"
                >
                  <option value="">Select...</option>
                  {foodOptions.map(food => (
                    <option key={food} value={food}>{food.charAt(0).toUpperCase() + food.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Second Food</label>
                <select
                  value={foodCheck.food2}
                  onChange={(e) => setFoodCheck({ ...foodCheck, food2: e.target.value, result: null })}
                  className="input-field"
                >
                  <option value="">Select...</option>
                  {foodOptions.map(food => (
                    <option key={food} value={food}>{food.charAt(0).toUpperCase() + food.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={checkFoodCombo}
              disabled={!foodCheck.food1 || !foodCheck.food2 || loading}
              className="btn-primary w-full mb-6"
            >
              {loading ? 'Checking...' : 'Check Compatibility'}
            </button>

            {foodCheck.result && (
              <div className={`p-6 rounded-lg border-l-4 ${
                foodCheck.result.compatibility === 'excellent' ? 'bg-green-50 border-green-500' :
                foodCheck.result.compatibility === 'good' ? 'bg-yellow-50 border-yellow-500' :
                'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">
                    {foodCheck.result.compatibility === 'excellent' ? '✅' :
                     foodCheck.result.compatibility === 'good' ? '⚠️' : '❌'}
                  </span>
                  <h4 className="text-2xl font-bold capitalize">{foodCheck.result.compatibility}</h4>
                </div>
                <p className="mb-4">{foodCheck.result.explanation}</p>
                
                <div className="mb-4">
                  <h5 className="font-bold mb-2">Dosha Impact:</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(foodCheck.result.doshaImpact).map(([dosha, impact]) => (
                      <div key={dosha} className="text-center p-2 bg-white rounded">
                        <div className="font-semibold capitalize">{dosha}</div>
                        <div className="text-sm capitalize">{impact}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {foodCheck.result.alternatives && foodCheck.result.alternatives.length > 0 && (
                  <div>
                    <h5 className="font-bold mb-2">Alternatives:</h5>
                    <ul className="list-disc list-inside">
                      {foodCheck.result.alternatives.map((alt, idx) => (
                        <li key={idx}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Daily Routine Tab */}
        {activeTab === 'routine' && routine && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Your Ideal Daily Routine</h3>
              <p className="text-gray-text">Personalized for {userDosha.charAt(0).toUpperCase() + userDosha.slice(1)} dosha</p>
            </div>

            {Object.entries(routine).map(([period, data]) => (
              <div key={period} className="card">
                <h4 className="text-xl font-bold mb-2 capitalize">{period.replace('bed', 'Bed')} ({data.time})</h4>
                <ul className="space-y-2">
                  {data.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary text-xl">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Seasonal Tips Tab */}
        {activeTab === 'seasonal' && (
          <div className="card">
            <h3 className="text-2xl font-bold mb-6">Seasonal Wellness Guide</h3>
            <p className="text-gray-text mb-6">Adjust your routine and diet according to the season</p>
            
            <div className="space-y-6">
              {['summer', 'winter', 'spring', 'autumn'].map(season => (
                <div key={season} className="p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 capitalize">{season}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">Foods to Eat:</h5>
                      <p className="text-sm text-gray-text">
                        {season === 'summer' ? 'Cooling fruits (watermelon, coconut), cucumbers, mint' :
                         season === 'winter' ? 'Warming spices (ginger, cinnamon), root vegetables, ghee' :
                         season === 'spring' ? 'Light foods, bitter greens, pungent spices' :
                         'Grounding foods, sweet vegetables, warming grains'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Activities:</h5>
                      <p className="text-sm text-gray-text">
                        {season === 'summer' ? 'Swimming, evening walks, cooling pranayama' :
                         season === 'winter' ? 'Indoor exercise, hot yoga, warming practices' :
                         season === 'spring' ? 'Vigorous exercise, cleansing, active movement' :
                         'Moderate activity, grounding practices, regular routines'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
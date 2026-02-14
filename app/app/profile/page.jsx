'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [doshaResult, setDoshaResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    healthGoals: [],
    dietaryRestrictions: '',
    currentHealthIssues: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const doshaData = JSON.parse(localStorage.getItem('doshaResult') || '{}');
      
      setUser(userData);
      setDoshaResult(doshaData);
      
      setFormData({
        name: userData.name || '',
        age: userData.age || '',
        gender: userData.gender || '',
        location: userData.location || '',
        healthGoals: userData.healthGoals || [],
        dietaryRestrictions: userData.dietaryRestrictions || '',
        currentHealthIssues: userData.currentHealthIssues || ''
      });
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Update localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        alert('Profile updated successfully! ✅');
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      // Still update localStorage even if API fails
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      alert('Profile updated locally! ✅');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    router.push('/');
  };

  const toggleHealthGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const healthGoalOptions = [
    'Weight Management',
    'Better Digestion', 
    'Improve Sleep',
    'Increase Energy',
    'Stress Management',
    'Immunity Boost'
  ];

  if (!user || !doshaResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🕉️</div>
          <p className="text-gray-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  const info = doshaInfo[doshaResult.dominant] || doshaInfo.pitta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-6" style={{ borderTop: `4px solid ${info.color}` }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: info.color }}
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark-text">{user.name}</h1>
                <p className="text-gray-text">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="font-semibold" style={{ color: info.color }}>
                    {info.name} ({doshaResult.percentages[doshaResult.dominant]}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <button onClick={() => setEditing(true)} className="btn-primary">
                    ✏️ Edit Profile
                  </button>
                  <button onClick={handleLogout} className="btn-secondary">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="btn-primary">
                    💾 Save Changes
                  </button>
                  <button onClick={() => { setEditing(false); loadUserData(); }} className="btn-secondary">
                    ✕ Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dosha Information */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-text">Your Constitution</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {['vata', 'pitta', 'kapha'].map(dosha => {
              const d = doshaInfo[dosha];
              const percentage = doshaResult.percentages[dosha];
              return (
                <div 
                  key={dosha}
                  className={`p-4 rounded-lg text-center ${dosha === doshaResult.dominant ? 'ring-4' : ''}`}
                  style={{ 
                    backgroundColor: `${d.color}20`,
                    ringColor: dosha === doshaResult.dominant ? d.color : 'transparent'
                  }}
                >
                  <div className="text-3xl mb-2">{d.emoji}</div>
                  <div className="font-bold" style={{ color: d.color }}>{d.name}</div>
                  <div className="text-2xl font-bold" style={{ color: d.color }}>{percentage}%</div>
                </div>
              );
            })}
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-text italic mb-2">{info.tagline}</p>
            <p className="text-dark-text">{info.description}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-6 text-dark-text">Personal Information</h2>
          
          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Age</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Gender</label>
                  <select
                    className="input-field"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Health Goals</label>
                <div className="grid grid-cols-2 gap-3">
                  {healthGoalOptions.map(goal => (
                    <label 
                      key={goal} 
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.healthGoals.includes(goal) 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.healthGoals.includes(goal)}
                        onChange={() => toggleHealthGoal(goal)}
                        className="mr-3 w-5 h-5"
                      />
                      <span className="text-sm font-medium">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Dietary Restrictions</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="e.g., Vegetarian, no gluten, lactose intolerant..."
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Current Health Issues</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="e.g., Sensitive digestion, anxiety, joint pain..."
                  value={formData.currentHealthIssues}
                  onChange={(e) => setFormData({ ...formData, currentHealthIssues: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-text">Age</label>
                  <p className="text-lg text-dark-text">{user.age || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-text">Gender</label>
                  <p className="text-lg text-dark-text capitalize">{user.gender || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-text">Location</label>
                  <p className="text-lg text-dark-text">{user.location || 'Not set'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-text block mb-2">Health Goals</label>
                {user.healthGoals && user.healthGoals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.healthGoals.map(goal => (
                      <span key={goal} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-text">No health goals set</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-text block mb-2">Dietary Restrictions</label>
                <p className="text-dark-text">{user.dietaryRestrictions || 'None specified'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-text block mb-2">Current Health Issues</label>
                <p className="text-dark-text">{user.currentHealthIssues || 'None specified'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-dark-text">Account Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/app/quiz')}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-dark-text">Retake Prakriti Quiz</div>
                  <div className="text-sm text-gray-text">Update your dosha assessment</div>
                </div>
                <span className="text-2xl">🧘</span>
              </div>
            </button>

            <button 
              onClick={() => router.push('/app/food-checker')}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-dark-text">Check Food Compatibility</div>
                  <div className="text-sm text-gray-text">Learn about Ayurvedic food combinations</div>
                </div>
                <span className="text-2xl">🍽️</span>
              </div>
            </button>

            <button 
              onClick={handleLogout}
              className="w-full p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-red-800">Logout</div>
                  <div className="text-sm text-red-600">Sign out of your account</div>
                </div>
                <span className="text-2xl">🚪</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
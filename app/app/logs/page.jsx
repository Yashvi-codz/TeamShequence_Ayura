'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function DailyLogsPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    sleepHours: 7,
    sleepQuality: 7,
    stress: 5,
    digestion: 7,
    energy: 7,
    mood: [],
    foodConsumed: '',
    notes: ''
  });
  const [pastLogs, setPastLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchLogForDate(selectedDate);
  }, [selectedDate]);

  const fetchLogs = async () => {
    const token = Cookies.get('token');
    try {
      const res = await fetch('/api/logs/create', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPastLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogForDate = async (date) => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`/api/logs/create?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.log) {
        setFormData({
          sleepHours: data.log.sleep?.hours || 7,
          sleepQuality: data.log.sleep?.quality || 7,
          stress: data.log.stress || 5,
          digestion: data.log.digestion || 7,
          energy: data.log.energy || 7,
          mood: data.log.mood || [],
          foodConsumed: data.log.foodConsumed || '',
          notes: data.log.notes || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get('token');
    
    try {
      const res = await fetch('/api/logs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          sleep: { hours: formData.sleepHours, quality: formData.sleepQuality },
          stress: formData.stress,
          digestion: formData.digestion,
          energy: formData.energy,
          mood: formData.mood,
          foodConsumed: formData.foodConsumed,
          notes: formData.notes
        })
      });
      
      if (res.ok) {
        setMessage(`Log saved for ${selectedDate}! ✅`);
        fetchLogs();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to save log');
    } finally {
      setLoading(false);
    }
  };

  const moods = ['😊 Happy', '😐 Neutral', '😟 Stressed', '😴 Tired', '🤢 Unwell'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Daily Wellness Tracker</h1>
            <p className="text-gray-text">Log your daily metrics to track wellness patterns</p>
          </div>
          <Link href="/app/logs/graphs" className="btn-primary">View Graphs 📊</Link>
        </div>

        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">{message}</div>
        )}

        <div className="card mb-6">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="btn-secondary mt-6"
            >
              Today
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                😴 Sleep Hours: {formData.sleepHours} hours
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={formData.sleepHours}
                onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Sleep Quality: {formData.sleepQuality}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sleepQuality}
                onChange={(e) => setFormData({...formData, sleepQuality: parseInt(e.target.value)})}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-text mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Stress Level: {formData.stress}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})}
                className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-text mt-1">
                <span>😊 Calm</span>
                <span>😰 Very Stressed</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Digestion Quality: {formData.digestion}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.digestion}
                onChange={(e) => setFormData({...formData, digestion: parseInt(e.target.value)})}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-text mt-1">
                <span>Poor</span>
                <span>Perfect</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Energy Level: {formData.energy}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
                className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-text mt-1">
                <span>Exhausted</span>
                <span>Very Energetic</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mood (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      const moodVal = mood.split(' ')[1];
                      setFormData({
                        ...formData,
                        mood: formData.mood.includes(moodVal)
                          ? formData.mood.filter(m => m !== moodVal)
                          : [...formData.mood, moodVal]
                      });
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.mood.includes(mood.split(' ')[1])
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Food Consumed Today</label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="e.g., Roti with dal, salad, milk, fruits"
                value={formData.foodConsumed}
                onChange={(e) => setFormData({...formData, foodConsumed: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Additional Notes (optional)</label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Any other observations..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Save Log'}
            </button>
          </form>
        </div>

        {pastLogs.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Recent Logs</h3>
            <div className="space-y-3">
              {pastLogs.slice(0, 10).map((log) => (
                <div key={log._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{log.date}</div>
                    <div className="text-sm text-gray-text">
                      Sleep: {log.sleep?.hours}h | Stress: {log.stress}/10 | Digestion: {log.digestion}/10 | Energy: {log.energy}/10
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDate(log.date);
                      window.scrollTo(0, 0);
                    }}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
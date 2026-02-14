'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GraphsPage() {
  const router = useRouter();
  const [range, setRange] = useState('7days');
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    try {
      const res = await fetch(`/api/logs/stats?range=${range}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result.logs || []);
      setInsights(result.insights || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    return data.map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sleep: log.sleep?.hours || 0,
      stress: log.stress || 0,
      digestion: log.digestion || 0,
      energy: log.energy || 0
    }));
  };

  const chartData = formatChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Your Wellness Trends</h1>
            <p className="text-gray-text">See how your wellness metrics change over time</p>
          </div>
          <Link href="/app/logs" className="btn-secondary">Back to Logs</Link>
        </div>

        <div className="flex gap-2 mb-6">
          {['7days', '30days', '90days'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                range === r
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark-text hover:bg-primary-light'
              }`}
            >
              {r === '7days' ? '7 Days' : r === '30days' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">Loading charts...</div>
        ) : chartData.length === 0 ? (
          <div className="card text-center py-20">
            <p className="text-xl text-gray-text mb-4">No data available for this time range</p>
            <Link href="/app/logs" className="btn-primary">Start Logging</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Sleep Chart */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-dark-text">😴 Sleep Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" domain={[0, 12]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sleep" stroke="#3498db" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">💡 {insights.sleep}</p>
              </div>
            </div>

            {/* Stress Chart */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-dark-text">😰 Stress Level Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="stress" stroke="#e74c3c" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-900">💡 {insights.stress}</p>
              </div>
            </div>

            {/* Digestion Chart */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-dark-text">🌿 Digestion Quality Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="digestion" stroke="#27ae60" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">💡 {insights.digestion}</p>
              </div>
            </div>

            {/* Energy Chart */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-dark-text">⚡ Energy Level Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                  <XAxis dataKey="date" stroke="#7F8C8D" />
                  <YAxis stroke="#7F8C8D" domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="energy" stroke="#f39c12" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-900">💡 {insights.energy}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
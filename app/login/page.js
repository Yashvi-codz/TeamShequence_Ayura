'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({email:'',password:'',remember:false});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      Cookies.set('token', data.token, {expires: formData.remember ? 30 : 7});
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on role and quiz status
      if(data.user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        if(!data.user.quizCompleted) {
          router.push('/app/quiz');
        } else if(!data.user.profileCompleted) {
          router.push('/app/profile/create');
        } else {
          router.push('/app/dashboard');
        }
      }
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-4xl">🕉️</span>
            <span className="text-2xl font-bold text-primary">Ayura</span>
          </Link>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-text mb-6">Login to continue your wellness journey</p>
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" className="input-field" required value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} placeholder="your@email.com"/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input type="password" className="input-field" required value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} placeholder="Enter password"/>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 w-5 h-5" checked={formData.remember} onChange={(e)=>setFormData({...formData,remember:e.target.checked})}/>
                <span className="text-sm text-gray-text">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Logging in...':'Login'}</button>
          </form>
          <p className="mt-6 text-center text-gray-text">Don't have an account? <Link href="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}
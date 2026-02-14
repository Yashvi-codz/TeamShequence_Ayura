'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DoctorSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({name:'',email:'',password:'',confirmPassword:'',licenseNumber:'',specialization:'',experience:'',phone:'',clinic:'',location:'',terms:false});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...formData,role:'doctor'})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error);
      Cookies.set('token', data.token, {expires:7});
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/doctor/dashboard');
    } catch(err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6"><Link href="/" className="inline-flex items-center space-x-2"><span className="text-4xl">🕉️</span><span className="text-2xl font-bold text-primary">Ayura</span></Link></div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Doctor Registration</h2>
          <p className="text-gray-text mb-6">Join our network of wellness experts</p>
          {apiError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{apiError}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold mb-2">Full Name</label><input type="text" className="input-field" required value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" className="input-field" required value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Password</label><input type="password" className="input-field" required value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Confirm Password</label><input type="password" className="input-field" required value={formData.confirmPassword} onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">License Number</label><input type="text" className="input-field" required value={formData.licenseNumber} onChange={(e)=>setFormData({...formData,licenseNumber:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Specialization</label><select className="input-field" required value={formData.specialization} onChange={(e)=>setFormData({...formData,specialization:e.target.value})}><option value="">Select</option><option value="ayurvedic">Ayurvedic Doctor</option><option value="general">General Practitioner</option><option value="nutritionist">Nutritionist</option></select></div>
              <div><label className="block text-sm font-semibold mb-2">Years of Experience</label><input type="number" className="input-field" required value={formData.experience} onChange={(e)=>setFormData({...formData,experience:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Phone Number</label><input type="tel" className="input-field" required value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Clinic/Hospital</label><input type="text" className="input-field" value={formData.clinic} onChange={(e)=>setFormData({...formData,clinic:e.target.value})}/></div>
              <div><label className="block text-sm font-semibold mb-2">Location/City</label><input type="text" className="input-field" value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/></div>
            </div>
            <div className="flex items-start"><input type="checkbox" id="terms" className="mt-1 mr-3 w-5 h-5" checked={formData.terms} onChange={(e)=>setFormData({...formData,terms:e.target.checked})} required/><label htmlFor="terms" className="text-sm text-gray-text">I agree to the Terms & Conditions</label></div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Creating...':'Create Doctor Account'}</button>
          </form>
          <p className="mt-6 text-center text-gray-text">Already have account? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

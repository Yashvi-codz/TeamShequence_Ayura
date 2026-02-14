'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CreateProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({age:'',gender:'',location:'',healthGoals:[],dietaryRestrictions:'',currentHealthIssues:''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if(!token) router.push('/login');
  }, [router]);

  const healthGoalOptions = ['Weight Management','Better Digestion','Improve Sleep','Increase Energy','Stress Management','Immunity Boost'];

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal) 
        ? prev.healthGoals.filter(g=>g!==goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/profile/create', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body:JSON.stringify(formData)
      });
      if(res.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/app/dashboard');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-2 text-dark-text">Let's Personalize Your Wellness</h2>
          <p className="text-gray-text mb-8">Help us tailor recommendations to your needs</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input type="number" min="1" max="120" className="input-field" required value={formData.age} onChange={(e)=>setFormData({...formData,age:e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Gender</label>
                <select className="input-field" required value={formData.gender} onChange={(e)=>setFormData({...formData,gender:e.target.value})}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Location/City</label>
              <input type="text" className="input-field" value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Health Goals (select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {healthGoalOptions.map(goal=>(
                  <label key={goal} className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors" style={{borderColor:formData.healthGoals.includes(goal)?'#27AE60':'#ddd'}}>
                    <input type="checkbox" checked={formData.healthGoals.includes(goal)} onChange={()=>toggleGoal(goal)} className="mr-3 w-5 h-5"/>
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Dietary Restrictions</label>
              <textarea className="input-field" rows="3" placeholder="e.g., Vegetarian, no gluten..." value={formData.dietaryRestrictions} onChange={(e)=>setFormData({...formData,dietaryRestrictions:e.target.value})}></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Current Health Issues (optional)</label>
              <textarea className="input-field" rows="3" placeholder="e.g., Sensitive digestion, anxiety..." value={formData.currentHealthIssues} onChange={(e)=>setFormData({...formData,currentHealthIssues:e.target.value})}></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Saving...':'Save & Continue to Dashboard'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
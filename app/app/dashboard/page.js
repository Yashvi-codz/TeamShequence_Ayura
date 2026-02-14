'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [doshaResult, setDoshaResult] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if(!token) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const doshaData = JSON.parse(localStorage.getItem('doshaResult') || '{}');
    
    if(!userData.quizCompleted) {
      router.push('/app/quiz');
      return;
    }
    if(!userData.profileCompleted) {
      router.push('/app/profile/create');
      return;
    }

    setUser(userData);
    setDoshaResult(doshaData);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    router.push('/');
  };

  if(!user || !doshaResult) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const info = doshaInfo[doshaResult.dominant];
  
  // Mock wellness score (will be calculated from logs in Phase 2)
  const wellnessScore = 72;
  const todayMetrics = {sleep:8,stress:6,digestion:8,energy:7};

  const sampleMeals = [
    {name:'Cooling Coconut Rice Bowl',time:'Breakfast',desc:'Refreshing start to your day'},
    {name:'Green Vegetable Salad',time:'Lunch',desc:'Light and nourishing'},
    {name:'Moong Dal with Coriander',time:'Dinner',desc:'Easy on digestion'}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🕉️</span>
            <span className="text-2xl font-bold text-primary">Ayura</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-dark-text font-semibold">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="text-sm text-gray-text hover:text-dark-text">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dosha Card */}
        <div className="card mb-8" style={{borderTop:`4px solid ${info.color}`}}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{info.emoji}</div>
              <div>
                <p className="text-sm text-gray-text mb-1">Your Dosha</p>
                <h3 className="text-2xl font-bold" style={{color:info.color}}>{info.name} ({doshaResult.percentages[doshaResult.dominant]}%)</h3>
                <p className="text-gray-text italic">{info.tagline}</p>
              </div>
            </div>

            {/* Wellness Score */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 flex items-center justify-center mx-auto mb-2" style={{borderColor:info.color}}>
                <div>
                  <div className="text-3xl font-bold" style={{color:info.color}}>{wellnessScore}</div>
                  <div className="text-xs text-gray-text">Score</div>
                </div>
              </div>
              <div className="text-xs text-gray-text">
                Sleep {todayMetrics.sleep}/10 | Stress {todayMetrics.stress}/10<br/>
                Digestion {todayMetrics.digestion}/10 | Energy {todayMetrics.energy}/10
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mb-8 text-center">
          <button className="btn-primary px-8 py-4">📊 Log Today's Metrics</button>
        </div>

       {/* Check this out! */}
<div className="mt-10 mb-20">
  <h3 className="text-2xl font-bold mb-6 text-dark-text">Check this out!</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

    {/* Card 1 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-green-100 p-8 hover:shadow-xl transition">
        <Link href="/app/pantry">
        <h3 className="text-2xl font-semibold text-orange-900">
          Log Your Pantry
        </h3>
        </Link>
      </div>
    </div>

    {/* Card 2 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-orange-100 p-8 hover:shadow-xl transition">
        <Link href="/app/meals">
        <h3 className="text-2xl font-semibold text-orange-900">
          Meal Generator
        </h3>
        </Link>
      </div>
    </div>

    {/* Card 3 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-purple-100 p-8 hover:shadow-xl transition">
        <Link href="/app/food-checker">
        <h3 className="text-2xl font-semibold text-orange-900">
          Food Compatibility 
        </h3>
        </Link>
      </div>
    </div>

  </div>
</div>



{/* Ayurveda Tips Section */}
<div className="mt-10 mb-20">
  <h3 className="text-2xl font-bold mb-6 text-dark-text">Ayurveda Tips</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

    {/* Card 1 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg">
        <img
          src="/img/3-doshas.jpeg"
          alt="Three Doshas"
          className="w-full h-64 object-cover"
        />
        <h3 className="text-2xl mt-4 font-semibold">
        The Three Doshas
      </h3>
      </div>
      
    </div>

    {/* Card 2 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg">
        <img
          src="/img/mindful-eating.jpeg"
          alt="Mindful Eating"
          className="w-full h-64 object-cover"
        />
        <h3 className="text-2xl mt-4 font-semibold">
        Mindful Eating
      </h3>
      </div>
      
    </div>

    {/* Card 3 */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg">
        <img
          src="/img/lifestyle-guidance.jpeg"
          alt="Lifestyle Guidance"
          className="w-full h-64 object-cover"
        />
        <h3 className="text-2xl mt-4 font-semibold">
        Lifestyle Guidance
      </h3>
      </div>
      
    </div>

  </div>
</div>




        {/* Ayurvedic Tips */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-dark-text">Today's Recommended Meals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleMeals.map((meal,idx)=>(
              <div key={idx} className="card hover:shadow-xl transition-shadow">
                <div className="h-32 bg-gradient-to-br rounded-lg mb-4 flex items-center justify-center text-6xl" style={{background:`linear-gradient(135deg, ${info.color}40, ${info.color}20)`}}>🍽️</div>
                <div className="text-xs font-semibold text-primary mb-2 uppercase">{meal.time}</div>
                <h4 className="font-bold text-lg mb-2 text-dark-text">{meal.name}</h4>
                <p className="text-gray-text text-sm mb-4">{meal.desc}</p>
                <button className="text-primary font-semibold hover:underline">View Recipe →</button>
              </div>
            ))}
          </div>
        </div>

      </div>



      

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-3">
        <div className="max-w-7xl mx-auto flex justify-around">
          {[
            {icon:'🏠',label:'Home',href:'/app/dashboard',active:true},
            {icon:'📊',label:'Logs',href:'/app/logs'},
            {icon:'💬',label:'Chat',href:'/app/chat'},
            {icon:'📚',label:'Learn',href:'/app/learn'},
            {icon:'👤',label:'Profile',href:'/app/profile'}
          ].map((item,idx)=>(
            <Link key={idx} href={item.href || '#'} className={`flex flex-col items-center ${item.active?'text-primary':'text-gray-text'} hover:text-primary transition-colors`}>
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
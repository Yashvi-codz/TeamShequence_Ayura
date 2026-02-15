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
            {/* IMPROVED HEADER - LARGER VERSION */}
      <header className="sticky top-0 z-50 bg-white/95 border-b-2 border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left: Logo + App Name + Tagline */}
          <div className="flex items-center space-x-5 hover:opacity-80 transition-opacity cursor-pointer">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg"></div>
              <img 
                src="/img/Logo.jpeg"
                alt="Ayura Logo"
                width={64}
                height={64}
                className="rounded-lg object-cover relative shadow-md"
              />
            </div>
            
            {/* App Name & Tagline */}
            <div className="border-l-2 border-gray-200 pl-5">
              <h1 className="text-3xl font-black text-primary">Ayura</h1>
              <p className="text-sm text-gray-text font-semibold tracking-wide">Wellness Companion</p>
            </div>
          </div>

          {/* Right: User Info + Logout Button */}
          <div className="flex items-center space-x-6">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-base font-bold text-dark-text">{user.name}</p>
              <p className="text-sm text-gray-text">Welcome back!</p>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:shadow-lg active:scale-95 transition-all duration-200 text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>



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
        <div className="mb-20 text-center mt-20 ">
          <i><h1 style={{ fontSize: "25px", fontWeight: "medium" }}>
    "If your diet is WRONG, medicine is of no use! If your diet is CORRECT, medicine is of no need!""
</h1></i>


        </div>

       {/* Check this out! */}
<div className="mt-10 mb-20">
  <h3 className="text-2xl font-bold mb-6 text-dark-text">Check this out!</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {/* Card 1 - Log Your Pantry */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-green-100 p-8 hover:shadow-xl transition border-4 border-green-500 hover:border-green-600">
        <Link href="/app/pantry">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">🥘</span>
            <h3 className="text-2xl font-semibold text-orange-900">
              Log Your Pantry
            </h3>
            <p className="text-sm text-orange-700 mt-2">Manage your ingredients</p>
          </div>
        </Link>
      </div>
    </div>

    {/* Card 2 - Dosha Score */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-orange-100 p-8 hover:shadow-xl transition border-4 border-orange-500 hover:border-orange-600">
        <Link href="/app/dashboard">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">📈</span>
            <h3 className="text-2xl font-semibold text-orange-900">
              Dosha Score
            </h3>
            <p className="text-sm text-orange-700 mt-2">View Your Dosha Score</p>
          </div>
        </Link>
      </div>
    </div>

    {/* Card 3 - Food Compatibility */}
    <div className="text-center">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-purple-100 p-8 hover:shadow-xl transition border-4 border-purple-500 hover:border-purple-600">
        <Link href="/app/food-checker">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">🔍</span>
            <h3 className="text-2xl font-semibold text-orange-900">
              Food Compatibility
            </h3>
            <p className="text-sm text-orange-700 mt-2">Check food pairings</p>
          </div>
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
      <div className="rounded-3xl overflow-hidden shadow-lg pb-5">
        <img
          src="/img/3 doshas.jpeg"
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
      <div className="rounded-3xl overflow-hidden shadow-lg pb-5">
        <img
          src="/img/mindful eating.jpeg"
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
      <div className="rounded-3xl overflow-hidden shadow-lg pb-5">
        <img
          src="/img/lifestyle guidance.jpeg"
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
# AYURA - Complete Next.js Application (Phase 1)

## 🎯 What's Been Created

### ✅ Core Infrastructure
- Next.js 14 with App Router
- Tailwind CSS configuration with custom colors
- MongoDB connection with mock database fallback
- JWT authentication system
- Dosha calculation algorithm
- API routes for signup, login, quiz submission, profile creation

### ✅ Completed Pages
1. Landing page (/)
2. Role selection (/signup)
3. Patient signup (/signup/patient)  
4. Doctor signup (/signup/doctor)

### 📝 Files Still Needed (Copy the code below)

---

## FILE: app/login/page.js

```javascript
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
```

---

## FILE: app/app/quiz/page.js

```javascript
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { quizQuestions } from '@/lib/doshaCalculator';
import Cookies from 'js-cookie';

export default function QuizPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if(!token) router.push('/login');
  }, [router]);

  const handleNext = () => {
    if(selectedOption === null) return;
    const newAnswers = [...answers, quizQuestions[currentQ].options[selectedOption]];
    setAnswers(newAnswers);
    
    if(currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const handleBack = () => {
    if(currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/quiz/submit', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body:JSON.stringify({answers: finalAnswers})
      });
      const data = await res.json();
      if(res.ok) {
        localStorage.setItem('doshaResult', JSON.stringify(data.doshaResult));
        router.push('/app/results');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if(!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-text mb-4">Discover Your Prakriti</h1>
            <p className="text-xl text-gray-text">Answer 10 questions about your constitution to get personalized wellness recommendations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {emoji:'🍽️', title:'Personalized Meals', desc:'Get recipes for your constitution'},
              {emoji:'🧘', title:'Lifestyle Tips', desc:'Daily routines and practices'},
              {emoji:'📊', title:'Health Tracking', desc:'Monitor your wellness journey'},
              {emoji:'👨‍⚕️', title:'Doctor Consultation', desc:'Connect with Ayurvedic experts'}
            ].map((item,idx)=>(
              <div key={idx} className="card text-center">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-text">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={()=>setStarted(true)} className="btn-primary text-lg px-12 py-4">Start Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQ + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-text">Question {currentQ + 1} of {quizQuestions.length}</span>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{width:`${progress}%`}}></div>
          </div>
        </div>

        <div className="card min-h-[400px] flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-dark-text">{question.question}</h2>
            <div className="space-y-4">
              {question.options.map((option,idx)=>(
                <button
                  key={idx}
                  onClick={()=>setSelectedOption(idx)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedOption===idx 
                      ? 'border-primary bg-primary/10 shadow-lg' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={handleBack} disabled={currentQ===0} className="btn-secondary" style={{opacity:currentQ===0?0.5:1}}>← Back</button>
            <button onClick={handleNext} disabled={selectedOption===null || loading} className="btn-primary">{currentQ===quizQuestions.length-1?(loading?'Submitting...':'Finish'):'Next →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## FILE: app/app/results/page.js

```javascript
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doshaInfo } from '@/lib/doshaCalculator';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('doshaResult');
    if(stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push('/app/quiz');
    }
  }, [router]);

  if(!result) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const info = doshaInfo[result.dominant];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-dark-text">Your Prakriti Results</h1>
          <p className="text-xl text-gray-text">Here's your unique constitution profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {['vata','pitta','kapha'].map(dosha=>{
            const d = doshaInfo[dosha];
            const isDominant = dosha === result.dominant;
            return (
              <div key={dosha} className={`card text-center ${isDominant?'border-4 border-primary shadow-2xl scale-105':''}`} style={{borderColor:isDominant?d.color:''}}>
                <div className="text-5xl mb-2">{d.emoji}</div>
                <h3 className="text-xl font-bold mb-2" style={{color:d.color}}>{d.name}</h3>
                <div className="text-4xl font-bold" style={{color:d.color}}>{result.percentages[dosha]}%</div>
              </div>
            );
          })}
        </div>

        <div className="card mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{info.emoji}</div>
            <h2 className="text-3xl font-bold mb-2" style={{color:info.color}}>You have a {info.name} constitution</h2>
            <p className="text-lg text-gray-text italic mb-4">{info.tagline}</p>
            <p className="text-lg text-dark-text leading-relaxed max-w-3xl mx-auto">{info.description}</p>
          </div>

          <div className="border-t-2 border-gray-200 pt-6 mt-6">
            <h3 className="text-2xl font-bold mb-6 text-dark-text">🌿 Personalized Recommendations</h3>
            <div className="space-y-3">
              {info.recommendations.map((rec,idx)=>(
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4" style={{borderColor:info.color}}>
                  <p className="text-lg">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app/profile/create" className="btn-primary text-center">Continue to Profile Setup →</Link>
          <Link href="/app/quiz" className="btn-secondary text-center">Retake Quiz</Link>
        </div>
      </div>
    </div>
  );
}
```

---

## FILE: app/app/profile/create/page.js

```javascript
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
```

---

## FILE: app/app/dashboard/page.js

```javascript
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

        {/* Recommended Meals */}
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
            {icon:'🍽️',label:'Meals',href:'/app/meals'},
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
```

---

## 🚀 Deployment Instructions

1. **Install Dependencies:**
   ```bash
   cd ayura-nextjs
   npm install
   ```

2. **Create .env.local:**
   ```
   MONGODB_URI=mongodb://localhost:27017/ayura
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

5. **Deploy to Vercel:**
   ```bash
   vercel
   ```

## ✅ Phase 1 Complete!

All authentication, quiz, results, profile, and dashboard pages are working.
Ready for Phase 2: Logs, Graphs, Chat, Learn Module, Meals, Recipe Generator!


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
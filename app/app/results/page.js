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
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary-light/20 to-cream">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="text-5xl">🕉️</div>
            <h1 className="text-3xl font-bold text-primary">Ayura</h1>
          </div>
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-dark-text mb-6 leading-tight">
              Your Personalized<br />
              <span className="text-primary">Ayurvedic Wellness Journey</span>
            </h2>
            
            <p className="text-xl text-gray-text mb-12 max-w-2xl mx-auto">
              Discover your Prakriti (constitution) and get wellness recommendations tailored to your unique body type
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/signup" className="btn-primary text-lg px-10 py-4 inline-block">
                Get Started Free
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-10 py-4 inline-block">
                I Have an Account
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {[
              { emoji: '🧬', title: 'Discover Your Dosha', desc: 'Take our scientific Prakriti quiz' },
              { emoji: '🍽️', title: 'Personalized Meals', desc: 'Get recipes for your constitution' },
              { emoji: '📊', title: 'Track Wellness', desc: 'Monitor sleep, stress & energy' },
              { emoji: '👨‍⚕️', title: 'Expert Guidance', desc: 'Consult with Ayurvedic doctors' }
            ].map((feature, idx) => (
              <div key={idx} className="card text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="font-semibold text-lg mb-2 text-dark-text">{feature.title}</h3>
                <p className="text-gray-text text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-24">
            <h3 className="text-3xl font-bold text-dark-text mb-12">How Ayura Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Take the Quiz', desc: 'Answer 10 questions about your body and habits' },
                { step: '2', title: 'Get Your Dosha', desc: 'Discover your unique Vata, Pitta, or Kapha constitution' },
                { step: '3', title: 'Start Your Journey', desc: 'Receive personalized recommendations and track progress' }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-dark-text">{step.title}</h4>
                  <p className="text-gray-text">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-32 py-8 border-t border-gray-300">
        <div className="container mx-auto px-4 text-center text-gray-text">
          <p>© 2026 Ayura. Personalized Ayurvedic Wellness Platform.</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 flex items-center justify-center px-4 py-12">
      <div className="card max-w-2xl mx-auto bg-green-300">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-5xl">
              <img 
                src="/img/Logo.jpeg"
                alt="Ayura Logo"
                width={64}
                height={64}
                className="rounded-lg object-cover relative shadow-md"
              />
            </span>
            <span className="text-3xl font-bold text-primary">Ayura</span>
          </Link>
        </div>

        <div className="card max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-dark-text">Join Ayura</h2>
          <p className="text-center text-gray-text mb-8">Choose your role to get started</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Card */}
            <button
              onClick={() => router.push('/signup/patient')}
              className="p-8 border-4 border-primary-light rounded-2xl hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧘</div>
              <h3 className="text-2xl font-bold mb-2 text-dark-text">I'm a Patient</h3>
              <p className="text-gray-text mb-4">
                Discover your Prakriti and get personalized wellness recommendations
              </p>
              <div className="text-primary font-semibold group-hover:underline">
                Start Your Journey →
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => router.push('/signup/doctor')}
              className="p-8 border-4 border-primary-light rounded-2xl hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-2 text-dark-text">I'm a Doctor</h3>
              <p className="text-gray-text mb-4">
                Join our network to consult patients and provide expert guidance
              </p>
              <div className="text-primary font-semibold group-hover:underline">
                Join Network →
              </div>
            </button>
          </div>

          <div className="mt-8 text-center text-gray-text">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

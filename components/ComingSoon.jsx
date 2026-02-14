'use client'

import Link from 'next/link'

export default function ComingSoonPage({ feature = "This Feature" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary-light/10 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="text-7xl mb-6">🚧</div>
          <h1 className="text-3xl font-bold text-dark-text mb-4">
            {feature} Coming Soon
          </h1>
          <p className="text-gray-text mb-8 text-lg">
            This feature is currently under development and will be available in Phase 2.
          </p>
          <div className="space-y-4">
            <Link href="/app/dashboard" className="btn-primary inline-block w-full">
              Back to Dashboard
            </Link>
            <p className="text-sm text-gray-text">
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

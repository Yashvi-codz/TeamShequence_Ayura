import './globals.css'

export const metadata = {
  title: 'Ayura - Personalized Ayurvedic Wellness',
  description: 'Discover your Prakriti and unlock your unique wellness blueprint',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

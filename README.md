# 🕉️ Ayura - Personalized Ayurvedic Wellness Platform

A modern Next.js web application that helps users discover their Ayurvedic constitution (Prakriti) and receive personalized wellness recommendations.

## 🌟 Features (Phase 1 - COMPLETE!)

### ✅ Fully Implemented
- **Role-Based Authentication** - Separate signup flows for Patients and Doctors
- **10-Question Prakriti Quiz** - Scientific dosha assessment with progress tracking
- **Dosha Results Display** - Beautiful visual breakdown with personalized recommendations
- **Profile Creation** - Collect health goals, dietary restrictions, and preferences
- **Patient Dashboard** - Wellness score, dosha card, and meal recommendations
- **Responsive UI** - Mobile-first design with Tailwind CSS
- **Mock Database** - Works without MongoDB for easy local testing

### 🔜 Coming in Phase 2
- Daily wellness logs with interactive graphs
- AI-powered wellness chat companion
- Learning module (dosha education, food compatibility checker)
- Recipe generator from pantry items
- Comprehensive meal recommendations
- Doctor dashboard and patient management system

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables  
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

**Colors:**
- Primary Green: `#27AE60`
- Vata (Air): `#E8B4B8` (Red tones)
- Pitta (Fire): `#F9D76C` (Yellow tones)
- Kapha (Earth): `#B8D8C8` (Blue-green tones)

**Typography:** Poppins (Google Fonts)

## 📁 Project Structure

```
app/
├── api/auth/              # Signup & login endpoints
├── api/quiz/submit/       # Quiz submission
├── api/profile/create/    # Profile creation
├── signup/                # Role selection & forms
├── login/                 # Login page
└── app/                   # Protected routes
    ├── quiz/              # 10-question quiz
    ├── results/           # Dosha results
    ├── profile/create/    # Profile setup
    └── dashboard/         # Main patient hub

lib/
├── mongodb.js             # Database (mock + real MongoDB)
├── auth.js                # JWT & password utilities
└── doshaCalculator.js     # Quiz logic & dosha data
```

## 🔐 User Flow

**Patient Journey:**
1. Landing page → Sign up as Patient
2. Complete registration form
3. Take 10-question Prakriti quiz
4. View dosha results with recommendations
5. Create wellness profile
6. Access personalized dashboard

**Doctor Journey:**
1. Landing page → Sign up as Doctor
2. Complete registration with credentials
3. Access doctor dashboard (Phase 2)

## 🧪 Testing Without MongoDB

The app includes an in-memory mock database. No setup required!

To use real MongoDB:
1. Install MongoDB or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env.local`
3. Restart server

## 🌐 Deployment to Vercel

```bash
vercel
```

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- bcryptjs password hashing
- JWT authentication (7-day expiry)
- Server-side validation
- Protected API routes

## 🎯 Next Steps

**Ready for Phase 2?** Add:
- Daily logs & graphs (recharts)
- AI chat (OpenAI API integration)
- Learning modules
- Recipe generator
- Doctor features

## 📄 License

Copyright © 2026 Ayura

---

**Start your wellness journey today!** 🕉️✨

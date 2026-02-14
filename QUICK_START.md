# 🚀 Ayura - Quick Start Guide

## Installation (3 steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

## 🎉 You're Ready!

Open **http://localhost:3000** in your browser.

## Test the App

### Create a Patient Account
1. Click "Get Started Free"
2. Choose "I'm a Patient"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Accept terms → "Create Patient Account"

### Take the Quiz
- You'll be automatically redirected
- Answer all 10 questions
- See your dosha results

### View Dashboard
- Complete your profile
- See personalized recommendations

### Create a Doctor Account
1. Go to /signup
2. Choose "I'm a Doctor"  
3. Fill in credentials
4. Access doctor dashboard

## 📂 Key Files

- **Landing**: `app/page.js`
- **Signup**: `app/signup/*/page.js`
- **Login**: `app/login/page.js`
- **Quiz**: `app/app/quiz/page.js`
- **Dashboard**: `app/app/dashboard/page.js`

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**MongoDB errors?**
The app uses mock database by default. No MongoDB needed!

## 🎨 Customization

Edit colors in `tailwind.config.js`:
```javascript
colors: {
  primary: '#27AE60',    // Change this!
  vata: '#E8B4B8',
  pitta: '#F9D76C',
  kapha: '#B8D8C8',
}
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Done! 🎊

For full documentation, see **README.md**

# 🚀 Quick Start Guide - Ayura Wellness App

## Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
cd ayura-nextjs
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:3000
```

## 🧪 Test the Complete Flow

### Patient Journey (5 minutes):

1. **Landing Page** → Click "Sign Up"

2. **Role Selection** → Click "I'm a Patient"

3. **Patient Signup**:
   - Name: John Doe
   - Email: john@test.com
   - Password: test123
   - Confirm Password: test123
   - ✓ Accept terms
   - Click "Create Patient Account"

4. **Prakriti Quiz** (Auto-redirected):
   - Click "Start Quiz"
   - Answer all 10 questions
   - Example answers for Pitta dominant:
     * Q1: Medium & Proportionate
     * Q2: Oily & Sensitive
     * Q3: Medium, Fair & Thin
     * Q4: Strong, Sometimes Acidic
     * Q5: Active & Focused
     * Q6: Prefer Cool & Fresh
     * Q7: Moderate, 6-7 Hours
     * Q8: Strong & Consistent
     * Q9: Regular, 2-3 Times Daily
     * Q10: Irritated, Anger & Frustration
   - Click "Finish" on Q10

5. **Dosha Results**:
   - View your constitution breakdown
   - See personalized recommendations
   - Click "Continue to Profile Setup"

6. **Profile Creation**:
   - Age: 30
   - Gender: Male
   - Location: Mumbai
   - Health Goals: Select a few (e.g., Better Digestion, Stress Management)
   - Dietary Restrictions: "Vegetarian"
   - Click "Save & Continue to Dashboard"

7. **Patient Dashboard**:
   - See your dosha card
   - View wellness score
   - Browse recommended meals
   - Explore bottom navigation

### Doctor Journey (2 minutes):

1. **Landing Page** → Click "Sign Up"

2. **Role Selection** → Click "I'm a Doctor"

3. **Doctor Registration**:
   - Name: Dr. Sarah Smith
   - Email: sarah@test.com
   - Password: test123
   - License: LIC12345
   - Specialization: Ayurvedic Doctor
   - Experience: 10 years
   - Phone: +1234567890
   - Click "Create Doctor Account"

4. **Doctor Dashboard**:
   - View statistics
   - See upcoming appointments
   - Check verification status

## 📱 What Works Now (Phase 1)

✅ Complete authentication system
✅ Role-based signup (Patient & Doctor)
✅ 10-question Prakriti quiz
✅ Dosha calculation & results
✅ Profile creation
✅ Patient dashboard
✅ Doctor dashboard
✅ Responsive design
✅ Form validation
✅ Session management

## 🚧 Coming in Phase 2

⏳ Daily wellness logs with graphs
⏳ AI chat for wellness advice
⏳ Learning module
⏳ Recipe generator
⏳ Meal recommendations
⏳ Doctor-patient consultation

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Use a different port
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Styles not loading?**
```bash
# Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

## 📊 Database Note

The app works perfectly with **mock data** (no MongoDB required). User data is stored in memory for testing. For production:

1. Install MongoDB
2. Update MONGODB_URI in .env.local
3. Restart server

## 🎨 Key Features to Try

1. **Password Strength Indicator** - Watch it change as you type
2. **Quiz Progress Bar** - See your completion percentage
3. **Dosha Visualization** - Beautiful circular charts
4. **Responsive Design** - Try on mobile, tablet, desktop
5. **Role-Based Routing** - Patient vs Doctor experiences

## 📝 Test Credentials

Use these for quick testing:

**Patient 1:**
- Email: test.patient@ayura.com
- Password: test123

**Doctor 1:**
- Email: test.doctor@ayura.com  
- Password: test123

*Note: Create these accounts first by signing up*

## 🎯 Next Steps

After testing Phase 1:
1. Review the code structure
2. Check out `/lib/quizData.js` for dosha logic
3. Explore `/app/api` for backend endpoints
4. Look at Tailwind config for custom colors
5. Wait for Phase 2 features!

## 💡 Pro Tips

- **Retake Quiz**: Click "Retake Quiz" on results page
- **Logout**: Click settings icon → Logout
- **Clear Data**: Clear localStorage in browser DevTools
- **Mock Data**: Check `/lib/db.js` for mock database

## 🎉 You're All Set!

The app is production-ready for Phase 1 features. Enjoy exploring!

---

Questions? Check README.md for detailed documentation.

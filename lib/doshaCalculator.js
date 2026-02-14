// lib/doshaCalculator.js

export const quizQuestions = [
  {
    id: 1,
    question: "What is your body frame?",
    options: [
      { text: "Thin & Light", dosha: "vata", points: 3 },
      { text: "Medium & Proportionate", dosha: "pitta", points: 3 },
      { text: "Heavy & Sturdy", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 2,
    question: "What is your skin type?",
    options: [
      { text: "Dry & Rough", dosha: "vata", points: 3 },
      { text: "Oily & Sensitive", dosha: "pitta", points: 3 },
      { text: "Thick & Cool", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 3,
    question: "What is your hair type?",
    options: [
      { text: "Thin, Dry & Curly", dosha: "vata", points: 3 },
      { text: "Medium, Fair & Thin", dosha: "pitta", points: 3 },
      { text: "Thick, Dark & Wavy", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 4,
    question: "How would you describe your digestion?",
    options: [
      { text: "Irregular, Gas & Bloating", dosha: "vata", points: 3 },
      { text: "Strong, Sometimes Acidic", dosha: "pitta", points: 3 },
      { text: "Slow & Heavy", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 5,
    question: "What are your typical energy levels?",
    options: [
      { text: "Variable & Restless", dosha: "vata", points: 3 },
      { text: "Active & Focused", dosha: "pitta", points: 3 },
      { text: "Steady & Enduring", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 6,
    question: "What is your temperature preference?",
    options: [
      { text: "Prefer Warm & Cozy", dosha: "vata", points: 3 },
      { text: "Prefer Cool & Fresh", dosha: "pitta", points: 3 },
      { text: "Can Tolerate Both", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 7,
    question: "How would you describe your sleep?",
    options: [
      { text: "Light, Interrupted, Few Hours", dosha: "vata", points: 3 },
      { text: "Moderate, 6-7 Hours", dosha: "pitta", points: 3 },
      { text: "Deep, Heavy, 8+ Hours", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 8,
    question: "What is your appetite like?",
    options: [
      { text: "Variable & Unpredictable", dosha: "vata", points: 3 },
      { text: "Strong & Consistent", dosha: "pitta", points: 3 },
      { text: "Steady & Moderate", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 9,
    question: "How are your bowel movements typically?",
    options: [
      { text: "Irregular, Constipation", dosha: "vata", points: 3 },
      { text: "Regular, 2-3 Times Daily", dosha: "pitta", points: 3 },
      { text: "Slow, Once Daily, Heavy", dosha: "kapha", points: 3 }
    ]
  },
  {
    id: 10,
    question: "How do you respond to stress?",
    options: [
      { text: "Anxious, Worry & Fear", dosha: "vata", points: 3 },
      { text: "Irritated, Anger & Frustration", dosha: "pitta", points: 3 },
      { text: "Calm, Withdrawn, Sluggish", dosha: "kapha", points: 3 }
    ]
  }
];

export function calculateDosha(answers) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  
  answers.forEach(answer => {
    if (answer && answer.dosha) {
      scores[answer.dosha] += answer.points || 3;
    }
  });
  
  const total = scores.vata + scores.pitta + scores.kapha;
  
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100)
  };
  
  const dominant = Object.keys(percentages).reduce((a, b) => 
    percentages[a] > percentages[b] ? a : b
  );
  
  return { percentages, dominant };
}

export const doshaInfo = {
  vata: {
    name: "Vata",
    emoji: "🌬️",
    color: "#E8B4B8",
    tagline: "Creative, Energetic, Flexible",
    description: "Vata dosha governs movement and is associated with air and space elements. People with dominant Vata are creative, energetic, and flexible, but may experience anxiety, dry skin, and irregular digestion when imbalanced.",
    recommendations: [
      "🍲 Favor warm, cooked, grounding foods",
      "💧 Stay well-hydrated with warm liquids",
      "🧘 Practice calming yoga and meditation",
      "⏰ Maintain regular routines and schedules",
      "🌡️ Keep warm and avoid cold exposure"
    ]
  },
  pitta: {
    name: "Pitta",
    emoji: "🔥",
    color: "#F9D76C",
    tagline: "Driven, Intelligent, Passionate",
    description: "Pitta dosha is transformation and metabolism. You are a natural leader, ambitious, and intelligent. Pitta types have strong digestion and sharp minds, but may experience inflammation, irritability, and digestive heat when imbalanced.",
    recommendations: [
      "🍽️ Favor cool, raw foods like salads and fruits",
      "💧 Stay hydrated with coconut water and cooling drinks",
      "🏊 Try cooling activities like swimming",
      "😌 Practice stress management and relaxation",
      "⏱️ Avoid overworking and competitive stress"
    ]
  },
  kapha: {
    name: "Kapha",
    emoji: "💧",
    color: "#B8D8C8",
    tagline: "Stable, Nurturing, Calm",
    description: "Kapha dosha governs structure and is associated with earth and water elements. People with dominant Kapha are stable, nurturing, and calm with strong endurance, but may experience sluggishness, weight gain, and congestion when imbalanced.",
    recommendations: [
      "🌶️ Eat light, spicy, warming foods",
      "🏃 Engage in vigorous daily exercise",
      "☕ Avoid heavy, oily, or dairy-rich foods",
      "⏰ Wake up early and stay active throughout the day",
      "🔥 Use warming spices like ginger and black pepper"
    ]
  }
};

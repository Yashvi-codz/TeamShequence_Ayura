// app/api/quiz/submit/route.js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { calculateDosha } from '@/lib/doshaCalculator';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { answers } = await request.json();
    
    if (!answers || answers.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid quiz answers' },
        { status: 400 }
      );
    }
    
    const doshaResult = calculateDosha(answers);
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const quizCollection = db.collection('quizResponses');
    
    // Save quiz response
    await quizCollection.insertOne({
      userId: decoded.userId,
      answers,
      doshaResult,
      completedAt: new Date()
    });
    
    // Update user with dosha results
    await usersCollection.updateOne(
      { _id: decoded.userId },
      { 
        $set: { 
          dosha: doshaResult.dominant,
          doshaPercentages: doshaResult.percentages,
          quizCompleted: true
        } 
      }
    );
    
    return NextResponse.json({
      success: true,
      doshaResult
    });
    
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

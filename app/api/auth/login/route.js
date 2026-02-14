// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const isPasswordValid = comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const token = generateToken(user._id.toString(), user.role);
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        quizCompleted: user.quizCompleted,
        profileCompleted: user.profileCompleted,
        dosha: user.dosha,
        doshaPercentages: user.doshaPercentages,
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

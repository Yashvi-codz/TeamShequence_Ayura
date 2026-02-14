// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, generateToken, validateEmail, validatePassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, ...additionalData } = body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Create user
    const hashedPassword = hashPassword(password);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };
    
    // Add additional data based on role
    if (role === 'patient') {
      newUser.quizCompleted = false;
      newUser.profileCompleted = false;
    } else if (role === 'doctor') {
      newUser.licenseNumber = additionalData.licenseNumber;
      newUser.specialization = additionalData.specialization;
      newUser.experience = additionalData.experience;
      newUser.phone = additionalData.phone;
      newUser.clinic = additionalData.clinic;
      newUser.location = additionalData.location;
      newUser.verificationStatus = 'pending';
    }
    
    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId.toString();
    
    // Generate token
    const token = generateToken(userId, role);
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        quizCompleted: newUser.quizCompleted,
        profileCompleted: newUser.profileCompleted,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

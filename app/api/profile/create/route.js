// app/api/profile/create/route.js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
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
    
    const profileData = await request.json();
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    await usersCollection.updateOne(
      { _id: decoded.userId },
      { 
        $set: { 
          age: profileData.age,
          gender: profileData.gender,
          location: profileData.location,
          healthGoals: profileData.healthGoals,
          dietaryRestrictions: profileData.dietaryRestrictions,
          currentHealthIssues: profileData.currentHealthIssues,
          profilePicture: profileData.profilePicture,
          profileCompleted: true,
          updatedAt: new Date()
        } 
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully'
    });
    
  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

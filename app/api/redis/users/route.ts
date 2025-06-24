import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from environment variables
let redis: Redis | null = null;

try {
  redis = Redis.fromEnv();
} catch (error) {
  console.warn('Failed to initialize Redis from environment variables:', error);
}

const USERS_KEY = 'aingen_users';

export async function GET() {
  try {
    if (!redis) {
      return NextResponse.json({ 
        success: false, 
        error: "Redis not configured",
        data: []
      }, { status: 500 });
    }

    const users = await redis.get(USERS_KEY);
    
    // Handle different data types that might be returned
    let userData = [];
    
    if (users) {
      if (typeof users === 'string') {
        try {
          userData = JSON.parse(users);
        } catch (parseError) {
          console.error('Failed to parse users JSON:', parseError);
          console.log('Raw users data:', users);
          userData = [];
        }
      } else if (Array.isArray(users)) {
        userData = users;
      } else if (typeof users === 'object') {
        // If it's an object, try to convert to array
        userData = Object.values(users);
      }
    }
    
    // Ensure we always return an array
    if (!Array.isArray(userData)) {
      userData = [];
    }
    
    return NextResponse.json({ 
      success: true, 
      data: userData
    });
  } catch (error) {
    console.error('Error getting users from Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get users from Redis",
      data: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json({ 
        success: false, 
        error: "Redis not configured"
      }, { status: 500 });
    }

    const body = await request.json();
    const { users } = body;

    if (!Array.isArray(users)) {
      return NextResponse.json({ 
        success: false, 
        error: "Users must be an array" 
      }, { status: 400 });
    }

    // Ensure we're storing valid JSON
    const usersJson = JSON.stringify(users);
    await redis.set(USERS_KEY, usersJson);
    
    return NextResponse.json({ 
      success: true, 
      message: "Users stored successfully"
    });
  } catch (error) {
    console.error('Error setting users in Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to store users in Redis"
    }, { status: 500 });
  }
} 
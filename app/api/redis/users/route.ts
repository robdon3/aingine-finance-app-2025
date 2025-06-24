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
    const userData = users ? JSON.parse(users as string) : [];
    
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

    await redis.set(USERS_KEY, JSON.stringify(users));
    
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
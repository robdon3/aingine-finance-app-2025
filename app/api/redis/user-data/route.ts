import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from environment variables
let redis: Redis | null = null;

try {
  redis = Redis.fromEnv();
} catch (error) {
  console.warn('Failed to initialize Redis from environment variables:', error);
}

const USER_DATA_PREFIX = 'aingen_user_data:';

export async function GET(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json({ 
        success: false, 
        error: "Redis not configured",
        data: null
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "userId parameter is required" 
      }, { status: 400 });
    }

    const data = await redis.get(`${USER_DATA_PREFIX}${userId}`);
    const userData = data ? JSON.parse(data as string) : null;
    
    return NextResponse.json({ 
      success: true, 
      data: userData
    });
  } catch (error) {
    console.error('Error getting user data from Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get user data from Redis",
      data: null
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
    const { userId, data } = body;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "userId is required" 
      }, { status: 400 });
    }

    await redis.set(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
    
    return NextResponse.json({ 
      success: true, 
      message: "User data stored successfully"
    });
  } catch (error) {
    console.error('Error setting user data in Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to store user data in Redis"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!redis) {
      return NextResponse.json({ 
        success: false, 
        error: "Redis not configured"
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "userId parameter is required" 
      }, { status: 400 });
    }

    await redis.del(`${USER_DATA_PREFIX}${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "User data removed successfully"
    });
  } catch (error) {
    console.error('Error removing user data from Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to remove user data from Redis"
    }, { status: 500 });
  }
} 
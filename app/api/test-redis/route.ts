import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

export async function GET() {
  try {
    // Test reading from Redis
    const testValue = await redis.get("test_key");
    
    return NextResponse.json({ 
      success: true, 
      message: "Redis connection successful",
      testValue: testValue || "No test value found"
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to connect to Redis",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: "Key and value are required" 
      }, { status: 400 });
    }

    // Write data to Redis
    await redis.set(key, value);
    
    // Read it back to verify
    const retrievedValue = await redis.get(key);
    
    return NextResponse.json({ 
      success: true, 
      message: "Data written and retrieved successfully",
      key,
      value: retrievedValue
    });
  } catch (error) {
    console.error('Redis write error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to write to Redis",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 
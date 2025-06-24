import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

export const POST = async () => {
  try {
    // Fetch data from Redis
    const result = await redis.get("item");
    return new NextResponse(JSON.stringify({ result }), { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}; 
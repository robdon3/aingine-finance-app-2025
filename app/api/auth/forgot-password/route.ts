import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';
import { storageManager } from '../../../../lib/storageManager';
import { UserAccount } from '../../../../components/AuthManager';

// Initialize Redis
let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch (error) {
  console.warn('Failed to initialize Redis:', error);
}

const RESET_TOKEN_PREFIX = 'aingen_reset_token:';
const RESET_TOKEN_EXPIRY = 3600; // 1 hour in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Find user by email
    const users = await storageManager.getUsers();
    const user = users.find((u: UserAccount) => u.email === email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const tokenExpiry = Date.now() + (RESET_TOKEN_EXPIRY * 1000);

    // Store reset token in Redis with expiry
    if (redis) {
      await redis.setex(
        `${RESET_TOKEN_PREFIX}${resetToken}`, 
        RESET_TOKEN_EXPIRY, 
        JSON.stringify({
          userId: user.id,
          email: user.email,
          username: user.username,
          expiresAt: tokenExpiry
        })
      );
    } else {
      // Fallback to local storage if Redis is not available
      const resetTokens = JSON.parse(localStorage.getItem('aingen_reset_tokens') || '{}');
      resetTokens[resetToken] = {
        userId: user.id,
        email: user.email,
        username: user.username,
        expiresAt: tokenExpiry
      };
      localStorage.setItem('aingen_reset_tokens', JSON.stringify(resetTokens));
    }

    // For development, return the reset token directly
    // In production, you would send an email instead
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password reset link generated successfully.',
      resetUrl: resetUrl,
      resetToken: resetToken, // Only for development
      note: 'In production, this token would be sent via email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred while processing your request' 
    }, { status: 500 });
  }
} 
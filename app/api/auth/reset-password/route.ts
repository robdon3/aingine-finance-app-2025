import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { storageManager } from '../../../../lib/storageManager';
import { UserAccount } from '../../../../components/AuthManager';
import { sha256 } from 'js-sha256';

// Initialize Redis
let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch (error) {
  console.warn('Failed to initialize Redis:', error);
}

const RESET_TOKEN_PREFIX = 'aingen_reset_token:';

// Password validation
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Please choose a stronger password');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Hash password
const hashPassword = (password: string): string => {
  return sha256(password);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token and password are required' 
      }, { status: 400 });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ 
        success: false, 
        error: passwordValidation.errors.join(', ') 
      }, { status: 400 });
    }

    // Get reset token data
    let tokenData: any = null;
    
    if (redis) {
      const tokenKey = `${RESET_TOKEN_PREFIX}${token}`;
      const storedData = await redis.get(tokenKey);
      if (storedData) {
        tokenData = JSON.parse(storedData as string);
        // Delete the token after use
        await redis.del(tokenKey);
      }
    } else {
      // Fallback to local storage
      const resetTokens = JSON.parse(localStorage.getItem('aingen_reset_tokens') || '{}');
      if (resetTokens[token]) {
        tokenData = resetTokens[token];
        delete resetTokens[token];
        localStorage.setItem('aingen_reset_tokens', JSON.stringify(resetTokens));
      }
    }

    if (!tokenData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired reset token' 
      }, { status: 400 });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reset token has expired' 
      }, { status: 400 });
    }

    // Update user password
    const users = await storageManager.getUsers();
    const userIndex = users.findIndex((u: UserAccount) => u.id === tokenData.userId);
    
    if (userIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Update the user's password
    users[userIndex].passwordHash = hashPassword(password);
    
    // Save updated users
    await storageManager.setUsers(users);

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred while resetting your password' 
    }, { status: 500 });
  }
} 
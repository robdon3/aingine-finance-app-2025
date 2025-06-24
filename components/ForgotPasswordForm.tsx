'use client';

import React, { useState } from 'react';
import { Shield, ArrowLeft, Copy, ExternalLink } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        setResetUrl(data.resetUrl || '');
        setResetToken(data.resetToken || '');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setIsSuccess(false);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openResetUrl = () => {
    if (resetUrl) {
      window.open(resetUrl, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-aegis-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Aingen</h2>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Forgot Password
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we&apos;ll generate a password reset link for you.
          </p>
        </div>
        
        {!isSuccess ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg ${
                isSuccess 
                  ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
                  : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
              }`}>
                <p className={`text-sm ${
                  isSuccess 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {message}
                </p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-aegis-600 hover:bg-aegis-700 disabled:bg-aegis-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Reset Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                {message}
              </p>
              
              {resetUrl && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      Reset URL:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={resetUrl} 
                        readOnly
                        className="flex-1 text-xs px-2 py-1 border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-800 text-green-700 dark:text-green-300"
                      />
                      <button
                        onClick={() => copyToClipboard(resetUrl)}
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        title="Copy URL"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={openResetUrl}
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        title="Open URL"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  {resetToken && (
                    <div>
                      <label className="block text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                        Reset Token (for reference):
                      </label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          value={resetToken} 
                          readOnly
                          className="flex-1 text-xs px-2 py-1 border border-green-200 dark:border-green-600 rounded bg-white dark:bg-green-800 text-green-700 dark:text-green-300 font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(resetToken)}
                          className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          title="Copy token"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                    💡 <strong>Development Mode:</strong> In production, this link would be sent via email.
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={onBackToLogin}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        )}
        
        <div className="text-center">
          <button 
            onClick={onBackToLogin}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 text-sm text-aegis-600 dark:text-aegis-400 hover:text-aegis-700 dark:hover:text-aegis-300 hover:underline disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
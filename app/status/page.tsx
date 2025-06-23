'use client';

import { useState, useEffect } from 'react';

interface SystemStatus {
  redis: {
    status: 'loading' | 'success' | 'error';
    message: string;
    details?: any;
  };
  health: {
    status: 'loading' | 'success' | 'error';
    data?: any;
  };
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus>({
    redis: { status: 'loading', message: 'Testing Redis connection...' },
    health: { status: 'loading' }
  });
  const [redisUrlConfigured, setRedisUrlConfigured] = useState<string | null>(null);
  const [redisTokenConfigured, setRedisTokenConfigured] = useState<string | null>(null);
  const [buildTime, setBuildTime] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      // Test Redis connection
      try {
        const redisResponse = await fetch('/api/test-redis');
        const redisData = await redisResponse.json();
        
        setStatus(prev => ({
          ...prev,
          redis: {
            status: redisData.success ? 'success' : 'error',
            message: redisData.success ? 'Redis connection successful' : redisData.error,
            details: redisData
          }
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          redis: {
            status: 'error',
            message: 'Failed to connect to Redis API',
            details: error
          }
        }));
      }

      // Test health endpoint
      try {
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        
        setStatus(prev => ({
          ...prev,
          health: {
            status: 'success',
            data: healthData
          }
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          health: {
            status: 'error'
          }
        }));
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    setRedisUrlConfigured(process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL ? 'Yes' : 'No');
    setRedisTokenConfigured(process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN ? 'Yes' : 'No');
    setBuildTime(new Date().toLocaleString());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'loading': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'loading': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">System Status</h1>
          
          <div className="space-y-6">
            {/* Redis Status */}
            <div className={`p-6 rounded-lg border ${getStatusColor(status.redis.status)}`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getStatusIcon(status.redis.status)}</span>
                <h2 className="text-xl font-semibold">Redis Connection</h2>
              </div>
              <p className="text-sm mb-3">{status.redis.message}</p>
              {status.redis.details && (
                <details className="text-sm">
                  <summary className="cursor-pointer hover:text-gray-700">View Details</summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(status.redis.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {/* Health Status */}
            <div className={`p-6 rounded-lg border ${getStatusColor(status.health.status)}`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getStatusIcon(status.health.status)}</span>
                <h2 className="text-xl font-semibold">System Health</h2>
              </div>
              {status.health.data && (
                <details className="text-sm">
                  <summary className="cursor-pointer hover:text-gray-700">View Health Data</summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(status.health.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {/* Environment Info */}
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Node Environment:</strong> {process.env.NODE_ENV || 'development'}
                </div>
                <div>
                  <strong>Redis URL Configured:</strong> {redisUrlConfigured ?? 'Checking...'}
                </div>
                <div>
                  <strong>Redis Token Configured:</strong> {redisTokenConfigured ?? 'Checking...'}
                </div>
                <div>
                  <strong>Build Time:</strong> {buildTime ?? 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What this page shows:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Redis connection status and configuration</li>
              <li>• System health endpoint status</li>
              <li>• Environment variable configuration</li>
              <li>• Real-time system status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
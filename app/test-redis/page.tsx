'use client';

import { useState } from 'react';

export default function TestRedisPage() {
  const [testKey, setTestKey] = useState('test_key');
  const [testValue, setTestValue] = useState('Hello from Aegis!');
  const [result, setResult] = useState<string | object | null>(null);
  const [loading, setLoading] = useState(false);

  const testGet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-redis');
      const data = await response.json();
      setResult(data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const testPost = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-redis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: testKey,
          value: testValue,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Redis Connection Test</h1>
          
          <div className="space-y-6">
            {/* Test GET */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Test GET (Read from Redis)</h2>
              <button
                onClick={testGet}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test GET Endpoint'}
              </button>
            </div>

            {/* Test POST */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Test POST (Write to Redis)</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key:
                  </label>
                  <input
                    type="text"
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value:
                  </label>
                  <input
                    type="text"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={testPost}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test POST Endpoint'}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Test Results</h2>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {result !== null ? JSON.stringify(result, null, 2) : ''}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What this tests:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• GET: Tests reading data from your Upstash Redis database</li>
              <li>• POST: Tests writing data to your Upstash Redis database</li>
              <li>• Connection: Verifies your environment variables are working</li>
              <li>• Integration: Confirms the Upstash SDK is properly configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
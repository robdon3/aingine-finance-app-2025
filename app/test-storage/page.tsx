'use client';

import { useState, useEffect } from 'react';
import { storageManager } from '../../lib/storageManager';
import { UserAccount } from '../../components/AuthManager';

export default function TestStoragePage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [testUserId, setTestUserId] = useState('test-user-123');
  const [testData, setTestData] = useState('{"test": "data", "timestamp": "' + new Date().toISOString() + '"}');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testGetUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await storageManager.getUsers();
      setUsers(result);
      setMessage(`Retrieved ${result.length} users successfully`);
    } catch (error) {
      setMessage(`Error getting users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSetUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const testUsers: UserAccount[] = [
        {
          id: 'test1',
          username: 'testuser1',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          preferences: {
            theme: 'auto',
            currency: 'USD',
            timezone: 'UTC',
            notifications: true,
            privacyLevel: 'cloud',
            storagePreference: 'cloud'
          },
          dataVersion: '1.0',
          passwordHash: 'hash1'
        },
        {
          id: 'test2',
          username: 'testuser2',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          preferences: {
            theme: 'auto',
            currency: 'USD',
            timezone: 'UTC',
            notifications: true,
            privacyLevel: 'cloud',
            storagePreference: 'cloud'
          },
          dataVersion: '1.0',
          passwordHash: 'hash2'
        }
      ];
      await storageManager.setUsers(testUsers);
      setMessage('Users stored successfully');
    } catch (error) {
      setMessage(`Error setting users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetUserData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await storageManager.getUserData(testUserId, 'cloud');
      setUserData(result);
      setMessage(`Retrieved user data for ${testUserId}: ${result ? 'Found' : 'Not found'}`);
    } catch (error) {
      setMessage(`Error getting user data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSetUserData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = JSON.parse(testData);
      await storageManager.setUserData(testUserId, data, 'cloud');
      setMessage(`User data stored successfully for ${testUserId}`);
    } catch (error) {
      setMessage(`Error setting user data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Storage Manager Test</h1>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Users Management */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Users Management</h2>
              <div className="space-y-3">
                <button
                  onClick={testGetUsers}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mr-3"
                >
                  {loading ? 'Loading...' : 'Get Users'}
                </button>
                <button
                  onClick={testSetUsers}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Set Test Users'}
                </button>
              </div>
              {users.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-medium mb-2">Current Users:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(users, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* User Data Management */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">User Data Management</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">User ID:</label>
                  <input
                    type="text"
                    value={testUserId}
                    onChange={(e) => setTestUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Test Data (JSON):</label>
                  <textarea
                    value={testData}
                    onChange={(e) => setTestData(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-x-3">
                  <button
                    onClick={testGetUserData}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Get User Data'}
                  </button>
                  <button
                    onClick={testSetUserData}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Set User Data'}
                  </button>
                </div>
              </div>
              {userData && (
                <div className="mt-3">
                  <h3 className="font-medium mb-2">User Data:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">What this tests:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Client-side storage manager integration with Redis API</li>
                <li>• User management operations (get/set users)</li>
                <li>• User data operations (get/set user data)</li>
                <li>• Error handling and fallback to local storage</li>
                <li>• API endpoint connectivity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
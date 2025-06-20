'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, UserAccount } from './AuthManager';
import { User, Users, LogOut, Download, Upload, Database, Shield, Cloud, HardDrive } from 'lucide-react';

export function UserManager() {
  const { currentUser, logout, switchUser, exportUserData, importUserData, deleteUser, clearUserData, getUserData, updateUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [showDataStats, setShowDataStats] = useState<string | null>(null);
  const [updatingStorage, setUpdatingStorage] = useState(false);

  // This is a temporary solution to get the user list.
  // In a real app, this should come from a shared state or a dedicated user management hook.
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('aegis_users') || '[]');
    setUsers(allUsers);
  }, [currentUser]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const success = await importUserData(data);
          if (success) {
            const allUsers = JSON.parse(localStorage.getItem('aegis_users') || '[]');
            setUsers(allUsers);
            setShowImport(false);
            alert('Data imported successfully!');
          } else {
            alert('Error importing data. Please check file format.');
          }
        } catch (error) {
          alert('Error importing data. Please check file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to clear all data for ${username}? This action cannot be undone.`)) {
      clearUserData(userId);
      alert('Data cleared successfully!');
    }
  };

  const handleStoragePreferenceChange = async (preference: 'local' | 'cloud') => {
    if (!currentUser) return;
    
    setUpdatingStorage(true);
    try {
      // Update user preferences
      updateUser({
        preferences: {
          ...currentUser.preferences,
          storagePreference: preference,
          privacyLevel: preference === 'local' ? 'local' : 'cloud'
        }
      });
      
      alert(`Storage preference updated to ${preference === 'local' ? 'local storage' : 'cloud storage'}`);
    } catch (error) {
      alert('Error updating storage preference');
    } finally {
      setUpdatingStorage(false);
    }
  };

  const getDataStats = async (userId: string) => {
    const userData = await getUserData(userId);
    const stats = {
      totalSections: Object.keys(userData).length,
      dataSize: JSON.stringify(userData).length,
      sections: Object.keys(userData).map((section: string) => ({
        name: section,
        hasData: Object.keys(userData[section]).length > 1,
        lastUpdated: userData[section].lastUpdated,
      })),
    };
    return stats;
  };

  const getStorageIcon = (preference: 'local' | 'cloud') => {
    return preference === 'cloud' ? <Cloud className="h-4 w-4" /> : <HardDrive className="h-4 w-4" />;
  };

  const getStorageLabel = (preference: 'local' | 'cloud') => {
    return preference === 'cloud' ? 'Cloud Storage' : 'Local Storage';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h2>
          <p className="text-gray-600">Manage your user accounts and data</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            Signed in as: <strong>{currentUser?.username}</strong>
          </span>
          <button onClick={logout} className="aegis-button-secondary flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Storage Preference Control */}
      {currentUser && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Database className="h-5 w-5 text-aegis-600" />
            <span>Storage Preferences</span>
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStorageIcon(currentUser.preferences.storagePreference)}
              <div>
                <div className="font-medium text-gray-900">
                  Current: {getStorageLabel(currentUser.preferences.storagePreference)}
                </div>
                <div className="text-sm text-gray-600">
                  {currentUser.preferences.storagePreference === 'local' 
                    ? 'Data stored locally on your device' 
                    : 'Data synced to secure cloud storage'}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleStoragePreferenceChange('local')}
                disabled={updatingStorage || currentUser.preferences.storagePreference === 'local'}
                className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                  currentUser.preferences.storagePreference === 'local'
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <HardDrive className="h-3 w-3" />
                <span>Local</span>
              </button>
              
              <button
                onClick={() => handleStoragePreferenceChange('cloud')}
                disabled={updatingStorage || currentUser.preferences.storagePreference === 'cloud'}
                className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 ${
                  currentUser.preferences.storagePreference === 'cloud'
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Cloud className="h-3 w-3" />
                <span>Cloud</span>
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Storage Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <div className="font-medium flex items-center space-x-1 mb-1">
                  <HardDrive className="h-3 w-3" />
                  <span>Local Storage</span>
                </div>
                <ul className="space-y-1">
                  <li>• Data stays on your device</li>
                  <li>• Works offline</li>
                  <li>• Maximum privacy</li>
                  <li>• No internet required</li>
                </ul>
              </div>
              <div>
                <div className="font-medium flex items-center space-x-1 mb-1">
                  <Cloud className="h-3 w-3" />
                  <span>Cloud Storage</span>
                </div>
                <ul className="space-y-1">
                  <li>• Sync across devices</li>
                  <li>• Automatic backups</li>
                  <li>• Access from anywhere</li>
                  <li>• Requires internet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5 text-aegis-600" />
          <span>User Accounts</span>
        </h3>
        <div className="space-y-3">
          {users.map((user) => {
            const [stats, setStats] = useState<any>(null);
            const isCurrentUser = currentUser?.id === user.id;

            useEffect(() => {
              getDataStats(user.id).then(setStats);
            }, [user.id]);

            if (!stats) {
              return <div key={user.id} className="p-4 rounded-lg border border-gray-200 bg-white">Loading user stats...</div>;
            }

            return (
              <div key={user.id} className={`p-4 rounded-lg border ${isCurrentUser ? 'border-aegis-300 bg-aegis-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center space-x-2">
                        <span>{user.username}</span>
                        {isCurrentUser && (
                          <span className="text-xs bg-aegis-100 text-aegis-700 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center space-x-1">
                          {getStorageIcon(user.preferences.storagePreference)}
                          <span>{user.preferences.storagePreference}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        Data: {stats.totalSections} sections, {(stats.dataSize / 1024).toFixed(1)}KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowDataStats(showDataStats === user.id ? null : user.id)}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      {showDataStats === user.id ? 'Hide' : 'Stats'}
                    </button>
                    
                    {!isCurrentUser && (
                      <button
                        onClick={() => switchUser(user.id)}
                        className="aegis-button-secondary text-sm"
                      >
                        Switch
                      </button>
                    )}
                    
                    <button
                      onClick={() => exportUserData(user.id)}
                      className="aegis-button-secondary text-sm"
                    >
                      Export
                    </button>
                    
                    <button
                      onClick={() => handleClearData(user.id, user.username)}
                      className="text-orange-600 hover:text-orange-700 text-sm"
                    >
                      Clear Data
                    </button>
                    
                    {users.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete user ${user.username}? This will permanently remove the account and all data.`)) {
                            deleteUser(user.id);
                            setUsers(users.filter(u => u.id !== user.id));
                          }
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Data Statistics */}
                {showDataStats === user.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Data Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-gray-500">Total Size</div>
                        <div className="font-medium">{(stats.dataSize / 1024).toFixed(1)}KB</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Sections</div>
                        <div className="font-medium">{stats.totalSections}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">With Data</div>
                        <div className="font-medium">{stats.sections.filter((s: any) => s.hasData).length}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Updated</div>
                        <div className="font-medium">
                          {new Date(Math.max(...stats.sections.map((s: any) => new Date(s.lastUpdated).getTime()))).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Data Sections:</div>
                      <div className="flex flex-wrap gap-1">
                        {stats.sections.map((section: any) => (
                          <span
                            key={section.name}
                            className={`text-xs px-2 py-1 rounded ${
                              section.hasData 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {section.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5 text-aegis-600" />
          <span>Data Management</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <button
              onClick={() => exportUserData(currentUser?.id || '')}
              className="aegis-button-secondary flex items-center justify-center space-x-2 w-full"
            >
              <Download className="h-4 w-4" />
              <span>Export Current User Data</span>
            </button>
            <p className="text-xs text-gray-500 text-center">
              Download all data for current user
            </p>
          </div>

          <div className="space-y-2">
            <label className="aegis-button-secondary flex items-center justify-center space-x-2 cursor-pointer w-full">
              <Upload className="h-4 w-4" />
              <span>Import User Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 text-center">
              Restore user data from backup
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Data Management Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• New users start with fresh, empty data structures</li>
            <li>• Legacy data is automatically migrated on first login</li>
            <li>• Export your data regularly for backup</li>
            <li>• Clear data to reset specific user information</li>
            <li>• Delete account to permanently remove user and all data</li>
            <li>• Switch between local and cloud storage anytime</li>
          </ul>
        </div>
      </div>

      {/* Privacy Status */}
      <div className="aegis-card">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Privacy Status: Secure</h3>
            <p className="text-sm text-gray-600">
              {currentUser?.preferences.storagePreference === 'local' 
                ? 'All data is stored locally on your device. No data is transmitted to external servers.'
                : 'Data is securely synced to cloud storage with encryption. You maintain full control over your information.'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">
              {currentUser?.preferences.storagePreference === 'local' ? '100% Private' : 'Cloud Synced'}
            </div>
            <div className="text-xs text-gray-500">
              {currentUser?.preferences.storagePreference === 'local' ? 'Local storage only' : 'Secure cloud storage'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
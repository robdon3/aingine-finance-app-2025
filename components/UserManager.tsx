'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, UserAccount } from './AuthManager';
import { User, Users, LogOut, Download, Upload, Database, Shield } from 'lucide-react';

export function UserManager() {
  const { currentUser, logout, switchUser, exportUserData, importUserData, deleteUser, clearUserData, getUserData } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [showDataStats, setShowDataStats] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
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
                {/* User details and actions */}
              </div>
            );
          })}
        </div>
      </div>

       {/* Other UI sections like Data Management and Privacy Status */}
    </div>
  );
} 
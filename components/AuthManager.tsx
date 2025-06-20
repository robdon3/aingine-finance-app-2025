'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { User, Users, Lock, Shield, Database, Smartphone, Globe, Key, LogOut, Plus, Settings, Download, Upload, Trash2, Eye, EyeOff } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { storageManager } from '../lib/storageManager'

// Types
export interface UserAccount {
  id: string
  username: string
  email?: string
  createdAt: string
  lastLogin: string
  isActive: boolean
  preferences: UserPreferences
  dataVersion: string
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  currency: string
  timezone: string
  notifications: boolean
  privacyLevel: 'local' | 'cloud'
  storagePreference: 'local' | 'cloud'
}

interface AuthContextType {
  currentUser: UserAccount | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string, storagePreference?: 'local' | 'cloud') => Promise<boolean>
  logout: () => void
  switchUser: (userId: string) => Promise<void>
  updateUser: (updates: Partial<UserAccount>) => Promise<void>
  exportUserData: (userId: string) => Promise<any>
  importUserData: (data: any) => Promise<boolean>
  deleteUser: (userId: string) => Promise<void>
  clearUserData: (userId: string) => Promise<void>
  getUserData: (userId: string) => Promise<any>
  updateUserDataSection: (userId: string, section: string, data: any) => Promise<any>
  migrateLegacyData: (userId: string) => boolean
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aegis_users',
  CURRENT_USER_ID: 'aegis_current_user_id',
}

// Default data templates for new users
const DEFAULT_USER_DATA = {
  financialHealth: { income: 0, expenses: 0, savings: 0, debt: 0, lastUpdated: new Date().toISOString() },
  netWorth: { assets: [], liabilities: [], lastUpdated: new Date().toISOString() },
  trueCost: { calculations: [], lastUpdated: new Date().toISOString() },
  timeValue: { calculations: [], lastUpdated: new Date().toISOString() },
  fuelCost: { trips: [], gasPrices: {}, lastUpdated: new Date().toISOString() },
  lifeContext: { goals: [], priorities: [], lastUpdated: new Date().toISOString() },
  location: { currentLocation: null, savedLocations: [], lastUpdated: new Date().toISOString() },
  aiInsights: { insights: [], preferences: {}, lastUpdated: new Date().toISOString() },
  dataSources: { fredApiKey: '', censusApiKey: '', lastUpdated: new Date().toISOString() },
  taxData: { policies: {}, calculations: [], lastUpdated: new Date().toISOString() }
}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const dataManager = {
    get: (userId: string) => storageManager.getUserData(userId, currentUser?.preferences.storagePreference || 'local'),
    set: (userId: string, data: any) => storageManager.setUserData(userId, data, currentUser?.preferences.storagePreference || 'local'),
    remove: (userId: string) => storageManager.removeUserData(userId, currentUser?.preferences.storagePreference || 'local'),
    getUsers: () => storageManager.getUsers(),
    setUsers: (users: UserAccount[]) => storageManager.setUsers(users),
  }

  const exportUserData = async (userId: string) => {
    const userData = await getUserData(userId);
    const users = await dataManager.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    return { user, data: userData, exportDate: new Date().toISOString(), version: '1.1' };
  };

  const importUserData = async (data: any): Promise<boolean> => {
    try {
      if (!data.user || !data.data) return false;
      const users = await dataManager.getUsers();
      const existingUser = users.find((u) => u.id === data.user.id);
      if (!existingUser) {
        await dataManager.setUsers([...users, data.user]);
      }
      await dataManager.set(data.user.id, data.data);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  };
  
  const migrateLegacyData = (userId: string) => { return true; };

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = await dataManager.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      if (password === 'password') { // Demo password
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
        const updatedUsers = users.map((u) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
        await dataManager.setUsers(updatedUsers);
        migrateLegacyData(user.id);
        return true;
      }
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, storagePreference: 'local' | 'cloud' = 'local'): Promise<boolean> => {
    const users = await dataManager.getUsers();
    if (users.find(u => u.username === username)) return false;

    const newUser: UserAccount = {
      id: uuidv4(),
      username,
      email,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      preferences: {
        theme: 'auto',
        currency: 'USD',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: true,
        privacyLevel: storagePreference,
        storagePreference: storagePreference,
      },
      dataVersion: '1.1'
    };
    const updatedUsers = [...users, newUser];
    await dataManager.setUsers(updatedUsers);
    await dataManager.set(newUser.id, DEFAULT_USER_DATA);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  };

  const switchUser = async (userId: string) => {
    const users = await dataManager.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    }
  };

  const updateUser = async (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    const users = await dataManager.getUsers();
    const updatedUsers = users.map((u) => u.id === currentUser.id ? updatedUser : u);
    await dataManager.setUsers(updatedUsers);
  };

  const deleteUser = async (userId: string) => {
    const users = await dataManager.getUsers();
    const updatedUsers = users.filter((u) => u.id !== userId);
    await dataManager.setUsers(updatedUsers);
    await dataManager.remove(userId);
    if (currentUser?.id === userId) {
      logout();
    }
  };

  const clearUserData = async (userId: string) => {
    await dataManager.set(userId, DEFAULT_USER_DATA);
  };

  const getUserData = async (userId: string) => {
    const data = await dataManager.get(userId);
    return data || DEFAULT_USER_DATA;
  };

  const updateUserDataSection = async (userId: string, section: string, data: any) => {
    const allData = await getUserData(userId);
    const updatedData = {
      ...allData,
      [section]: { ...(allData[section] || {}), ...data, lastUpdated: new Date().toISOString() },
    };
    await dataManager.set(userId, updatedData);
    return updatedData;
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    switchUser,
    updateUser,
    exportUserData,
    importUserData,
    deleteUser,
    clearUserData,
    getUserData,
    updateUserDataSection,
    migrateLegacyData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple Login Form Component
export function LoginForm() {
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [storagePreference, setStoragePreference] = useState<'local' | 'cloud'>('local');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    if (isRegister) {
      success = await register(username, email, password, storagePreference);
    } else {
      success = await login(username, password);
    }
    
    if (!success) {
      setError(isRegister ? 'Registration failed. Username may already exist.' : 'Login failed. Check username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-aegis-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Project Aegis</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{isRegister ? 'Create a new account' : 'Sign in to your account'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Engine for the People</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username" 
              required 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email" 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password" 
              required 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {!isRegister && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Demo password: password</p>
            )}
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Storage Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStoragePreference('local')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    storagePreference === 'local'
                      ? 'border-aegis-500 bg-aegis-50 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">Local Storage</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Data stays on your device. Maximum privacy, works offline.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setStoragePreference('cloud')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    storagePreference === 'cloud'
                      ? 'border-aegis-500 bg-aegis-50 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Cloud Storage</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sync across devices. Automatic backups, access anywhere.
                  </p>
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-aegis-600 hover:bg-aegis-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setStoragePreference('local');
            }} 
            className="text-sm text-aegis-600 dark:text-aegis-400 hover:text-aegis-700 dark:hover:text-aegis-300 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
} 
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
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  switchUser: (userId: string) => void
  updateUser: (updates: Partial<UserAccount>) => void
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
    const users = dataManager.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    return { user, data: userData, exportDate: new Date().toISOString(), version: '1.1' };
  };

  const importUserData = async (data: any): Promise<boolean> => {
    try {
      if (!data.user || !data.data) return false;
      const users = dataManager.getUsers();
      const existingUser = users.find((u) => u.id === data.user.id);
      if (!existingUser) {
        dataManager.setUsers([...users, data.user]);
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
    const users = dataManager.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      if (password === 'password') { // Demo password
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
        const updatedUsers = users.map((u) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
        dataManager.setUsers(updatedUsers);
        migrateLegacyData(user.id);
        return true;
      }
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = dataManager.getUsers();
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
        privacyLevel: 'local',
        storagePreference: 'local',
      },
      dataVersion: '1.1'
    };
    const updatedUsers = [...users, newUser];
    dataManager.setUsers(updatedUsers);
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

  const switchUser = (userId: string) => {
    const users = dataManager.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    }
  };

  const updateUser = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    const users = dataManager.getUsers();
    const updatedUsers = users.map((u) => u.id === currentUser.id ? updatedUser : u);
    dataManager.setUsers(updatedUsers);
  };

  const deleteUser = async (userId: string) => {
    const users = dataManager.getUsers();
    const updatedUsers = users.filter((u) => u.id !== userId);
    dataManager.setUsers(updatedUsers);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (isRegister) {
      success = await register(username, email, password);
    } else {
      success = await login(username, password);
    }
    if (!success) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Project Aegis</h2>
          <p className="mt-2 text-gray-600">{isRegister ? 'Create a new account' : 'Sign in to your account'}</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="aegis-input" />
          {isRegister && <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="aegis-input" />}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="aegis-input" />
          <button type="submit" className="aegis-button-primary w-full">{isRegister ? 'Register' : 'Sign In'}</button>
        </form>
        <div className="text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-aegis-600 hover:underline">
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
} 
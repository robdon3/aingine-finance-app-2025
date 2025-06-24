'use client'

import React, { useState, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { storageManager } from '../lib/storageManager'
import { Shield, Database, Globe } from 'lucide-react'

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
  passwordHash?: string // Add password hash for security
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
  register: (username: string, email: string, password: string, storagePreference?: 'local' | 'cloud') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchUser: (userId: string) => Promise<void>
  updateUser: (updates: Partial<UserAccount>) => Promise<void>
  exportUserData: (userId: string) => Promise<unknown>
  importUserData: (data: unknown) => Promise<boolean>
  deleteUser: (userId: string) => Promise<void>
  clearUserData: (userId: string) => Promise<void>
  getUserData: (userId: string) => Promise<unknown>
  updateUserDataSection: (userId: string, section: string, data: unknown) => Promise<unknown>
  migrateLegacyData: () => boolean
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aingen_users',
  CURRENT_USER_ID: 'aingen_current_user_id',
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

// Simple password hashing function (in production, use bcrypt or similar)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Password validation
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Please choose a stronger password')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const dataManager = {
    get: (userId: string) => storageManager.getUserData(userId, currentUser?.preferences.storagePreference || 'local'),
    set: (userId: string, data: unknown) => storageManager.setUserData(userId, data, currentUser?.preferences.storagePreference || 'local'),
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

  const importUserData = async (data: unknown): Promise<boolean> => {
    try {
      if (
        typeof data === 'object' &&
        data !== null &&
        'user' in data &&
        'data' in data
      ) {
        const user = (data as { user: unknown }).user;
        const userData = (data as { data: unknown }).data;
        // Type guard for user
        if (
          typeof user === 'object' &&
          user !== null &&
          'id' in user &&
          typeof (user as { id: unknown }).id === 'string'
        ) {
          const users = await dataManager.getUsers();
          const existingUser = users.find((u) => u.id === (user as { id: string }).id);
          if (!existingUser) {
            await dataManager.setUsers([...users, user as UserAccount]);
          }
          await dataManager.set((user as { id: string }).id, userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  };
  
  const migrateLegacyData = () => { return true; };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = await dataManager.getUsers();
      const user = users.find(u => u.username === username);
      
      if (user && user.passwordHash) {
        const isValidPassword = await verifyPassword(password, user.passwordHash);
        
        if (isValidPassword) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
          const updatedUsers = users.map((u) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
          await dataManager.setUsers(updatedUsers);
          migrateLegacyData();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, storagePreference: 'local' | 'cloud' = 'cloud'): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate password
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        return { 
          success: false, 
          error: passwordValidation.errors.join(', ') 
        }
      }

      const users = await dataManager.getUsers();
      if (users.find(u => u.username === username)) {
        return { 
          success: false, 
          error: 'Username already exists' 
        }
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      const newUser: UserAccount = {
        id: uuidv4(),
        username,
        email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        passwordHash, // Store the hashed password
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
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An error occurred during registration' 
      }
    }
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

  const updateUserDataSection = async (userId: string, section: string, data: unknown) => {
    const allData = await getUserData(userId);
    if (typeof allData === 'object' && allData !== null) {
      const updatedData = {
        ...(allData as object),
        [section]: data,
        lastUpdated: new Date().toISOString(),
      };
      await dataManager.set(userId, updatedData);
      return updatedData;
    }
    return allData;
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
  const [storagePreference, setStoragePreference] = useState<'local' | 'cloud'>('cloud');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegister) {
        const result = await register(username, email, password, storagePreference);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      } else {
        const success = await login(username, password);
        if (!success) {
          setError('Login failed. Check username and password.');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            />
            {isRegister && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p>
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
                  disabled={isLoading}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    storagePreference === 'local'
                      ? 'border-aegis-500 bg-aegis-50 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  } disabled:opacity-50`}
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
                  disabled={isLoading}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    storagePreference === 'cloud'
                      ? 'border-aegis-500 bg-aegis-50 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  } disabled:opacity-50`}
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
            disabled={isLoading}
            className="w-full bg-aegis-600 hover:bg-aegis-700 disabled:bg-aegis-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div className="text-center">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setStoragePreference('cloud');
            }} 
            disabled={isLoading}
            className="text-sm text-aegis-600 dark:text-aegis-400 hover:text-aegis-700 dark:hover:text-aegis-300 hover:underline disabled:opacity-50"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
} 
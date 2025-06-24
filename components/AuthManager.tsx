'use client'

import React, { useState, createContext, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { storageManager } from '../lib/storageManager'
import { Shield, Database, AlertTriangle } from 'lucide-react'
import { sha256 } from 'js-sha256'

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
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
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

// Simple password hashing function using js-sha256 (works in all environments)
const hashPassword = (password: string): string => {
  return sha256(password)
}

const verifyPassword = (password: string, hash: string): boolean => {
  const passwordHash = hashPassword(password)
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

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedUserId = localStorage.getItem('aingen_current_user_id');
      if (storedUserId) {
        const users = await storageManager.getUsers();
        const user = users.find((u) => u.id === storedUserId);
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    };
    restoreSession();
  }, []);

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
    } catch {
      return false;
    }
  };
  
  const migrateLegacyData = () => { return true; };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = await dataManager.getUsers();
      const user = users.find(u => u.username === username);
      
      if (user && user.passwordHash) {
        const isValidPassword = verifyPassword(password, user.passwordHash);
        
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
    } catch {
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
      const passwordHash = hashPassword(password);

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
    } catch {
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

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch {
      return { 
        success: false, 
        error: 'An error occurred while processing your request' 
      };
    }
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
    forgotPassword,
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
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const success = await login(username, password)
        if (!success) {
          setError('Invalid username or password')
        }
      } else {
        const result = await register(username, email, password)
        if (!result.success) {
          setError(result.error || 'Registration failed')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cassette-900 flex items-center justify-center p-4">
      {/* CRT Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cassette-800/20 to-transparent"></div>
      </div>
      
      <div className="w-full max-w-md z-20 relative">
        {/* Main Login Panel */}
        <div className="cassette-panel">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Shield className="h-12 w-12 text-orange-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cassette-50 font-mono tracking-wider">AEGIS ENGINE</h1>
                <p className="text-cassette-400 font-mono text-sm">v2.1.0 // SECURE ACCESS</p>
              </div>
            </div>
            
            {/* System Status */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="status-indicator status-online">
                <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                SYSTEM ONLINE
              </div>
              <div className="status-indicator status-online">
                <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                ENCRYPTED
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cassette-input w-full"
                placeholder="ENTER USERNAME"
                required
              />
            </div>

            {/* Email Field (Registration only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cassette-input w-full"
                  placeholder="ENTER EMAIL"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cassette-input w-full"
                placeholder="ENTER PASSWORD"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-400/20 border border-red-400 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="cassette-btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="cassette-loading"></div>
                  <span className="font-mono">PROCESSING...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span className="font-mono">{isLogin ? 'AUTHENTICATE' : 'REGISTER'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-cassette-400 hover:text-orange-400 font-mono text-sm transition-colors"
            >
              {isLogin ? 'CREATE NEW ACCOUNT' : 'RETURN TO LOGIN'}
            </button>
          </div>
        </div>

        {/* System Info Footer */}
        <div className="mt-6 text-center">
          <div className="cassette-terminal">
            <div className="text-xs text-cassette-400 font-mono space-y-1">
              <div>SYSTEM: AEGIS ENGINE v2.1.0</div>
              <div>STATUS: OPERATIONAL</div>
              <div>SECURITY: ENCRYPTED CONNECTION</div>
              <div>TIME: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
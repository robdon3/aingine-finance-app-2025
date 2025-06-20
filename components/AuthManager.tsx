'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { User, Users, Lock, Shield, Database, Smartphone, Globe, Key, LogOut, Plus, Settings, Download, Upload, Trash2, Eye, EyeOff } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

// Types
interface UserAccount {
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
  privacyLevel: 'local' | 'encrypted' | 'cloud'
}

interface AuthContextType {
  currentUser: UserAccount | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  switchUser: (userId: string) => void
  updateUser: (updates: Partial<UserAccount>) => void
  exportUserData: (userId: string) => void
  importUserData: (data: any) => Promise<boolean>
  deleteUser: (userId: string) => void
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aegis_users',
  CURRENT_USER_ID: 'aegis_current_user_id',
  USER_DATA_PREFIX: 'aegis_user_data_',
  APP_SETTINGS: 'aegis_app_settings'
}

// Encryption utilities (simple for now, can be enhanced)
const encryption = {
  encrypt: (data: any, key: string): string => {
    // Simple base64 encoding for now - can be enhanced with proper encryption
    return btoa(JSON.stringify(data))
  },
  decrypt: (encryptedData: string, key: string): any => {
    try {
      return JSON.parse(atob(encryptedData))
    } catch {
      return null
    }
  }
}

// Storage utilities
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error)
      return null
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error)
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error)
    }
  },
  getUserData: (userId: string) => {
    return storage.get(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`)
  },
  setUserData: (userId: string, data: any) => {
    storage.set(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`, data)
  },
  removeUserData: (userId: string) => {
    storage.remove(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`)
  }
}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user on mount
  useEffect(() => {
    const currentUserId = storage.get(STORAGE_KEYS.CURRENT_USER_ID)
    if (currentUserId) {
      const users = storage.get(STORAGE_KEYS.USERS) || []
      const user = users.find((u: UserAccount) => u.id === currentUserId)
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const user = users.find((u: UserAccount) => u.username === username)
    
    if (user) {
      // Simple password check (in real app, use proper hashing)
      if (password === 'password') { // Demo password
        setCurrentUser(user)
        setIsAuthenticated(true)
        storage.set(STORAGE_KEYS.CURRENT_USER_ID, user.id)
        
        // Update last login
        const updatedUsers = users.map((u: UserAccount) => 
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
        )
        storage.set(STORAGE_KEYS.USERS, updatedUsers)
        
        return true
      }
    }
    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    
    // Check if username already exists
    if (users.find((u: UserAccount) => u.username === username)) {
      return false
    }

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
        privacyLevel: 'local'
      },
      dataVersion: '1.0'
    }

    const updatedUsers = [...users, newUser]
    storage.set(STORAGE_KEYS.USERS, updatedUsers)
    
    // Auto-login after registration
    setCurrentUser(newUser)
    setIsAuthenticated(true)
    storage.set(STORAGE_KEYS.CURRENT_USER_ID, newUser.id)
    
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    storage.remove(STORAGE_KEYS.CURRENT_USER_ID)
  }

  const switchUser = (userId: string) => {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const user = users.find((u: UserAccount) => u.id === userId)
    if (user) {
      setCurrentUser(user)
      setIsAuthenticated(true)
      storage.set(STORAGE_KEYS.CURRENT_USER_ID, userId)
    }
  }

  const updateUser = (updates: Partial<UserAccount>) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const updatedUsers = users.map((u: UserAccount) => 
      u.id === currentUser.id ? updatedUser : u
    )
    storage.set(STORAGE_KEYS.USERS, updatedUsers)
  }

  const exportUserData = (userId: string) => {
    const userData = storage.getUserData(userId)
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const user = users.find((u: UserAccount) => u.id === userId)
    
    if (!userData || !user) return

    const exportData = {
      user,
      data: userData,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aegis-${user.username}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importUserData = async (data: any): Promise<boolean> => {
    try {
      if (!data.user || !data.data) return false
      
      const users = storage.get(STORAGE_KEYS.USERS) || []
      const existingUser = users.find((u: UserAccount) => u.id === data.user.id)
      
      if (!existingUser) {
        // Add new user
        const updatedUsers = [...users, data.user]
        storage.set(STORAGE_KEYS.USERS, updatedUsers)
      }
      
      // Import user data
      storage.setUserData(data.user.id, data.data)
      
      return true
    } catch (error) {
      console.error('Error importing user data:', error)
      return false
    }
  }

  const deleteUser = (userId: string) => {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const updatedUsers = users.filter((u: UserAccount) => u.id !== userId)
    storage.set(STORAGE_KEYS.USERS, updatedUsers)
    storage.removeUserData(userId)
    
    // If deleting current user, logout
    if (currentUser?.id === userId) {
      logout()
    }
  }

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
    deleteUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Login Component
export function LoginForm() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let success = false
      if (isLogin) {
        success = await login(username, password)
      } else {
        success = await register(username, email, password)
      }

      if (!success) {
        setError(isLogin ? 'Invalid username or password' : 'Username already exists')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="aegis-card max-w-md w-full">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 text-aegis-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your Aegis account' : 'Start your journey with Project Aegis'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              required
            />
            {isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Demo password: <code>password</code>
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="aegis-button w-full"
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-aegis-600 hover:text-aegis-700 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Privacy First</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All data stored locally on your device</li>
            <li>• No data transmitted to external servers</li>
            <li>• Complete control over your information</li>
            <li>• Export/import your data anytime</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// User Management Component
export function UserManager() {
  const { currentUser, logout, switchUser, exportUserData, importUserData, deleteUser } = useAuth()
  const [users, setUsers] = useState<UserAccount[]>([])
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    const allUsers = storage.get(STORAGE_KEYS.USERS) || []
    setUsers(allUsers)
  }, [])

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          const success = await importUserData(data)
          if (success) {
            // Refresh users list
            const allUsers = storage.get(STORAGE_KEYS.USERS) || []
            setUsers(allUsers)
            setShowImport(false)
          }
        } catch (error) {
          alert('Error importing data. Please check file format.')
        }
      }
      reader.readAsText(file)
    }
  }

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
          <button
            onClick={logout}
            className="aegis-button-secondary flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* User Accounts */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5 text-aegis-600" />
          <span>User Accounts</span>
        </h3>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                currentUser?.id === user.id
                  ? 'border-aegis-300 bg-aegis-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentUser?.id !== user.id && (
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
                {users.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete user ${user.username}? This cannot be undone.`)) {
                        deleteUser(user.id)
                        setUsers(users.filter(u => u.id !== user.id))
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
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
              All data is stored locally on your device. No data is transmitted to external servers.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">100% Private</div>
            <div className="text-xs text-gray-500">Local storage only</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
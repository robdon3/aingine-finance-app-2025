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
  clearUserData: (userId: string) => void
  getUserData: (userId: string) => any
  updateUserDataSection: (userId: string, section: string, data: any) => any
  migrateLegacyData: (userId: string) => boolean
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aegis_users',
  CURRENT_USER_ID: 'aegis_current_user_id',
  USER_DATA_PREFIX: 'aegis_user_data_',
  APP_SETTINGS: 'aegis_app_settings',
  LEGACY_DATA_MIGRATED: 'aegis_legacy_migrated'
}

// Default data templates for new users
const DEFAULT_USER_DATA = {
  financialHealth: {
    income: 0,
    expenses: 0,
    savings: 0,
    debt: 0,
    lastUpdated: new Date().toISOString()
  },
  netWorth: {
    assets: [],
    liabilities: [],
    lastUpdated: new Date().toISOString()
  },
  trueCost: {
    calculations: [],
    lastUpdated: new Date().toISOString()
  },
  timeValue: {
    calculations: [],
    lastUpdated: new Date().toISOString()
  },
  fuelCost: {
    trips: [],
    gasPrices: {},
    lastUpdated: new Date().toISOString()
  },
  lifeContext: {
    goals: [],
    priorities: [],
    lastUpdated: new Date().toISOString()
  },
  location: {
    currentLocation: null,
    savedLocations: [],
    lastUpdated: new Date().toISOString()
  },
  aiInsights: {
    insights: [],
    preferences: {},
    lastUpdated: new Date().toISOString()
  },
  dataSources: {
    fredApiKey: '',
    censusApiKey: '',
    lastUpdated: new Date().toISOString()
  },
  taxData: {
    policies: {},
    calculations: [],
    lastUpdated: new Date().toISOString()
  }
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

// Data management utilities
const dataManager = {
  // Initialize fresh data for new user
  initializeUserData: (userId: string) => {
    const freshData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA))
    storage.setUserData(userId, freshData)
    return freshData
  },

  // Clear all data for a user
  clearUserData: (userId: string) => {
    storage.removeUserData(userId)
    return true
  },

  // Get user data with fallback to defaults
  getUserData: (userId: string) => {
    let userData = storage.getUserData(userId)
    if (!userData) {
      userData = dataManager.initializeUserData(userId)
    }
    return userData
  },

  // Update specific section of user data
  updateUserDataSection: (userId: string, section: string, data: any) => {
    const userData = dataManager.getUserData(userId)
    userData[section] = {
      ...userData[section],
      ...data,
      lastUpdated: new Date().toISOString()
    }
    storage.setUserData(userId, userData)
    return userData
  },

  // Migrate legacy data to new user system
  migrateLegacyData: (userId: string) => {
    const migrated = storage.get(STORAGE_KEYS.LEGACY_DATA_MIGRATED)
    if (migrated) return false // Already migrated

    const userData = dataManager.getUserData(userId)
    
    // Check for legacy data keys and migrate them
    const legacyKeys = [
      'financialHealth',
      'netWorth',
      'trueCost',
      'timeValue',
      'fuelCost',
      'lifeContext',
      'location',
      'aiInsights',
      'dataSources',
      'taxData'
    ]

    let hasLegacyData = false
    legacyKeys.forEach(key => {
      const legacyData = storage.get(key)
      if (legacyData) {
        userData[key] = {
          ...userData[key],
          ...legacyData,
          lastUpdated: new Date().toISOString()
        }
        hasLegacyData = true
        storage.remove(key) // Clean up legacy data
      }
    })

    if (hasLegacyData) {
      storage.setUserData(userId, userData)
      storage.set(STORAGE_KEYS.LEGACY_DATA_MIGRATED, true)
      return true
    }

    return false
  },

  // Export all data for a user
  exportAllUserData: (userId: string) => {
    const userData = dataManager.getUserData(userId)
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const user = users.find((u: UserAccount) => u.id === userId)
    
    if (!user) return null

    return {
      user,
      data: userData,
      exportDate: new Date().toISOString(),
      version: '1.1',
      metadata: {
        totalSections: Object.keys(userData).length,
        dataSize: JSON.stringify(userData).length,
        sections: Object.keys(userData)
      }
    }
  },

  // Import and validate user data
  importUserData: async (data: any): Promise<boolean> => {
    try {
      if (!data.user || !data.data) return false
      
      // Validate data structure
      const requiredSections = Object.keys(DEFAULT_USER_DATA)
      const hasValidStructure = requiredSections.every(section => 
        data.data.hasOwnProperty(section)
      )
      
      if (!hasValidStructure) {
        console.warn('Imported data missing required sections, initializing defaults')
        // Merge with defaults for missing sections
        data.data = {
          ...DEFAULT_USER_DATA,
          ...data.data
        }
      }
      
      const users = storage.get(STORAGE_KEYS.USERS) || []
      const existingUser = users.find((u: UserAccount) => u.id === data.user.id)
      
      if (!existingUser) {
        const updatedUsers = [...users, data.user]
        storage.set(STORAGE_KEYS.USERS, updatedUsers)
      }
      
      storage.setUserData(data.user.id, data.data)
      return true
    } catch (error) {
      console.error('Error importing user data:', error)
      return false
    }
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
        
        // Ensure user has data initialized and migrate legacy data if needed
        dataManager.getUserData(user.id)
        dataManager.migrateLegacyData(user.id)
        
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
      dataVersion: '1.1'
    }

    const updatedUsers = [...users, newUser]
    storage.set(STORAGE_KEYS.USERS, updatedUsers)
    
    // Initialize fresh data for new user
    dataManager.initializeUserData(newUser.id)
    
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
      
      // Ensure user has data initialized
      dataManager.getUserData(userId)
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
    const exportData = dataManager.exportAllUserData(userId)
    if (!exportData) return

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aegis-${exportData.user.username}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importUserData = async (data: any): Promise<boolean> => {
    return await dataManager.importUserData(data)
  }

  const deleteUser = (userId: string) => {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const updatedUsers = users.filter((u: UserAccount) => u.id !== userId)
    storage.set(STORAGE_KEYS.USERS, updatedUsers)
    
    // Clear all user data
    dataManager.clearUserData(userId)
    
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
    deleteUser,
    clearUserData: dataManager.clearUserData,
    getUserData: dataManager.getUserData,
    updateUserDataSection: dataManager.updateUserDataSection,
    migrateLegacyData: dataManager.migrateLegacyData
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
  const { currentUser, logout, switchUser, exportUserData, importUserData, deleteUser, clearUserData, getUserData } = useAuth()
  const [users, setUsers] = useState<UserAccount[]>([])
  const [showImport, setShowImport] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showDataStats, setShowDataStats] = useState<string | null>(null)

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
            alert('Data imported successfully!')
          } else {
            alert('Error importing data. Please check file format.')
          }
        } catch (error) {
          alert('Error importing data. Please check file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClearData = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to clear all data for ${username}? This action cannot be undone.`)) {
      clearUserData(userId)
      alert('Data cleared successfully!')
    }
  }

  const getDataStats = (userId: string) => {
    const userData = getUserData(userId)
    const stats = {
      totalSections: Object.keys(userData).length,
      dataSize: JSON.stringify(userData).length,
      sections: Object.keys(userData).map(section => ({
        name: section,
        hasData: Object.keys(userData[section]).length > 1, // More than just lastUpdated
        lastUpdated: userData[section].lastUpdated
      }))
    }
    return stats
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
          {users.map((user) => {
            const stats = getDataStats(user.id)
            const isCurrentUser = currentUser?.id === user.id
            
            return (
              <div
                key={user.id}
                className={`p-4 rounded-lg border ${
                  isCurrentUser
                    ? 'border-aegis-300 bg-aegis-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
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
                        <div className="font-medium">{stats.sections.filter(s => s.hasData).length}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Updated</div>
                        <div className="font-medium">
                          {new Date(Math.max(...stats.sections.map(s => new Date(s.lastUpdated).getTime()))).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Data Sections:</div>
                      <div className="flex flex-wrap gap-1">
                        {stats.sections.map(section => (
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
            )
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
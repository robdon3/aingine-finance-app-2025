import * as cloudStorage from './cloudStorage';
import { UserAccount } from '../components/AuthManager';

// --- Local Storage Implementation ---
const localStorageAdapter = {
  get: (key: string) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting from local storage: ${key}`, error);
      return null;
    }
  },
  set: (key: string, value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting to local storage: ${key}`, error);
    }
  },
  remove: (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from local storage: ${key}`, error);
    }
  },
};

// --- API-based Redis Operations (for client-side) ---
const apiRedisAdapter = {
  async getUsers(): Promise<UserAccount[]> {
    try {
      const response = await fetch('/api/redis/users');
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error getting users from Redis API:', error);
      return [];
    }
  },

  async setUsers(users: UserAccount[]): Promise<void> {
    try {
      await fetch('/api/redis/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });
    } catch (error) {
      console.error('Error setting users via Redis API:', error);
      throw error;
    }
  },

  async getUserData(userId: string): Promise<unknown> {
    try {
      const response = await fetch(`/api/redis/user-data?userId=${encodeURIComponent(userId)}`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error getting user data from Redis API:', error);
      return null;
    }
  },

  async setUserData(userId: string, data: unknown): Promise<void> {
    try {
      await fetch('/api/redis/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, data })
      });
    } catch (error) {
      console.error('Error setting user data via Redis API:', error);
      throw error;
    }
  },

  async removeUserData(userId: string): Promise<void> {
    try {
      await fetch(`/api/redis/user-data?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error removing user data via Redis API:', error);
      throw error;
    }
  }
};

// --- Storage Manager ---
export const storageManager = {
  // --- User Account Management (Local or Cloud) ---
  getUsers: async (): Promise<UserAccount[]> => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Client-side: try API first, then fall back to local
      try {
        const cloudUsers = await apiRedisAdapter.getUsers();
        if (cloudUsers && cloudUsers.length > 0) {
          return cloudUsers;
        }
      } catch {
        console.log('No cloud users found via API, checking local storage');
      }
      
      // Fall back to local storage
      return localStorageAdapter.get('aingen_users') || [];
    } else {
      // Server-side: use direct Redis access
      try {
        const cloudUsers = await cloudStorage.getUsers();
        if (cloudUsers && cloudUsers.length > 0) {
          return cloudUsers;
        }
      } catch {
        console.log('No cloud users found, checking local storage');
      }
      
      // Fall back to local storage (if available on server)
      return localStorageAdapter.get('aingen_users') || [];
    }
  },
  
  setUsers: async (users: UserAccount[]) => {
    // Store in both cloud and local for redundancy
    if (typeof window !== 'undefined') {
      // Client-side: use API
      try {
        await apiRedisAdapter.setUsers(users);
      } catch (error) {
        console.error('Failed to store users via API:', error);
      }
    } else {
      // Server-side: use direct Redis
      try {
        await cloudStorage.setUsers(users);
      } catch (error) {
        console.error('Failed to store users in cloud:', error);
      }
    }
    localStorageAdapter.set('aingen_users', users);
  },
  
  // --- User-Specific Data Management (Local or Cloud) ---
  getUserData: async (userId: string, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      if (typeof window !== 'undefined') {
        // Client-side: use API
        try {
          const cloudData = await apiRedisAdapter.getUserData(userId);
          if (cloudData !== null) {
            return cloudData;
          }
          // If cloud storage returns null (Redis not available), fall back to local
          console.log('Cloud storage unavailable via API, falling back to local storage');
          return localStorageAdapter.get(`aingen_user_data_${userId}`);
        } catch (error) {
          console.error('Error accessing cloud storage via API, falling back to local:', error);
          return localStorageAdapter.get(`aingen_user_data_${userId}`);
        }
      } else {
        // Server-side: use direct Redis
        try {
          const cloudData = await cloudStorage.getUserData(userId);
          if (cloudData !== null) {
            return cloudData;
          }
          // If cloud storage returns null (Redis not available), fall back to local
          console.log('Cloud storage unavailable, falling back to local storage');
          return localStorageAdapter.get(`aingen_user_data_${userId}`);
        } catch (error) {
          console.error('Error accessing cloud storage, falling back to local:', error);
          return localStorageAdapter.get(`aingen_user_data_${userId}`);
        }
      }
    }
    return localStorageAdapter.get(`aingen_user_data_${userId}`);
  },
  
  setUserData: async (userId: string, data: unknown, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      if (typeof window !== 'undefined') {
        // Client-side: use API
        try {
          await apiRedisAdapter.setUserData(userId, data);
        } catch (error) {
          console.error('Failed to store in cloud via API, falling back to local storage:', error);
        }
      } else {
        // Server-side: use direct Redis
        try {
          await cloudStorage.setUserData(userId, data);
        } catch (error) {
          console.error('Failed to store in cloud, falling back to local storage:', error);
        }
      }
    }
    // Always store locally as backup
    localStorageAdapter.set(`aingen_user_data_${userId}`, data);
  },
  
  removeUserData: async (userId: string, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      if (typeof window !== 'undefined') {
        // Client-side: use API
        try {
          await apiRedisAdapter.removeUserData(userId);
        } catch (error) {
          console.error('Failed to remove from cloud storage via API:', error);
        }
      } else {
        // Server-side: use direct Redis
        try {
          await cloudStorage.removeUserData(userId);
        } catch (error) {
          console.error('Failed to remove from cloud storage:', error);
        }
      }
    }
    // Always remove from local storage
    localStorageAdapter.remove(`aingen_user_data_${userId}`);
  },
}; 
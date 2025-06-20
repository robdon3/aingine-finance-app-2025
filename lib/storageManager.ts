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
  set: (key: string, value: any) => {
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

// --- Storage Manager ---
export const storageManager = {
  // --- User Account Management (Local or Cloud) ---
  getUsers: async (): Promise<UserAccount[]> => {
    // Try to get users from cloud first, then fall back to local
    try {
      const cloudUsers = await cloudStorage.getUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        return cloudUsers;
      }
    } catch (error) {
      console.log('No cloud users found, checking local storage');
    }
    
    // Fall back to local storage
    return localStorageAdapter.get('aegis_users') || [];
  },
  
  setUsers: async (users: UserAccount[]) => {
    // Store in both cloud and local for redundancy
    try {
      await cloudStorage.setUsers(users);
    } catch (error) {
      console.error('Failed to store users in cloud:', error);
    }
    localStorageAdapter.set('aegis_users', users);
  },
  
  // --- User-Specific Data Management (Local or Cloud) ---
  getUserData: async (userId: string, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      return await cloudStorage.getUserData(userId);
    }
    return localStorageAdapter.get(`aegis_user_data_${userId}`);
  },
  setUserData: async (userId: string, data: any, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      return await cloudStorage.setUserData(userId, data);
    }
    localStorageAdapter.set(`aegis_user_data_${userId}`, data);
  },
  removeUserData: async (userId: string, storagePreference: 'local' | 'cloud') => {
    if (storagePreference === 'cloud') {
      return await cloudStorage.removeUserData(userId);
    }
    localStorageAdapter.remove(`aegis_user_data_${userId}`);
  },
}; 
import { useAuth } from './AuthManager'
import { useCallback } from 'react'

// Hook for easy access to user data management
export const useUserData = () => {
  const { currentUser, getUserData, updateUserDataSection, clearUserData } = useAuth()

  if (!currentUser) {
    throw new Error('useUserData must be used within an authenticated context')
  }

  const getAllData = useCallback(async () => {
    return await getUserData(currentUser.id)
  }, [currentUser.id, getUserData])

  const getSection = useCallback(async (section: string) => {
    const allData = await getUserData(currentUser.id)
    if (typeof allData !== 'object' || allData === null) return null;
    const dataObj = allData as { [key: string]: unknown };
    return dataObj[section] || null
  }, [currentUser.id, getUserData])

  const updateSection = useCallback(async (section: string, data: unknown) => {
    return await updateUserDataSection(currentUser.id, section, data)
  }, [currentUser.id, updateUserDataSection])

  const clearAllData = useCallback(async () => {
    return await clearUserData(currentUser.id)
  }, [currentUser.id, clearUserData])

  const getStats = useCallback(async () => {
    const allData = await getUserData(currentUser.id)
    if (typeof allData !== 'object' || allData === null) {
      return { totalSections: 0, dataSize: 0, sections: [] };
    }
    const dataObj = allData as { [key: string]: unknown };
    return {
      totalSections: Object.keys(dataObj).length,
      dataSize: JSON.stringify(dataObj).length,
      sections: Object.keys(dataObj).map(section => {
        const sectionData = dataObj[section];
        return {
          name: section,
          hasData: typeof sectionData === 'object' && sectionData !== null && Object.keys(sectionData as object).length > 1,
          lastUpdated: (typeof sectionData === 'object' && sectionData !== null && 'lastUpdated' in sectionData) ? (sectionData as { lastUpdated?: string }).lastUpdated || '' : ''
        }
      })
    }
  }, [currentUser.id, getUserData])

  const hasData = useCallback(async (section: string) => {
    const allData = await getUserData(currentUser.id)
    if (typeof allData !== 'object' || allData === null) return false;
    const dataObj = allData as { [key: string]: unknown };
    const sectionData = dataObj[section]
    return sectionData && typeof sectionData === 'object' && sectionData !== null && Object.keys(sectionData as object).length > 1
  }, [currentUser.id, getUserData])

  return {
    getAllData,
    getSection,
    updateSection,
    clearAllData,
    getStats,
    hasData
  }
}

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
}

// Utility functions for common data operations
export const userDataUtils = {
  // Initialize a new section with defaults
  initializeSection: (section: string, defaults: unknown) => {
    if (typeof defaults !== 'object' || defaults === null) {
      return { lastUpdated: new Date().toISOString() }
    }
    return {
      ...(defaults as object),
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Add item to an array section
  addToArray: (currentArray: unknown[], newItem: unknown) => {
    if (isPlainObject(newItem)) {
      return [...currentArray, Object.assign({}, newItem, { id: Date.now().toString() })];
    }
    return currentArray;
  },
  
  // Update item in array section
  updateInArray: (currentArray: unknown[], itemId: string, updates: unknown) => {
    return currentArray.map(item => {
      if (isPlainObject(item) && 'id' in item && (item as { id?: string }).id === itemId && isPlainObject(updates)) {
        return { ...item, ...updates };
      }
      return item;
    });
  },
  
  // Remove item from array section
  removeFromArray: (currentArray: unknown[], itemId: string) => {
    return currentArray.filter(item => isPlainObject(item) && 'id' in item && (item as { id?: string }).id !== itemId)
  },
  
  // Merge data with existing section
  mergeSection: (existingData: unknown, newData: unknown) => {
    if (typeof existingData !== 'object' || existingData === null) return newData;
    if (typeof newData !== 'object' || newData === null) return existingData;
    return {
      ...(existingData as object),
      ...(newData as object),
      lastUpdated: new Date().toISOString()
    }
  }
} 
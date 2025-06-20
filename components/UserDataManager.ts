import { useAuth } from './AuthManager'

// Hook for easy access to user data management
export const useUserData = () => {
  const { currentUser, getUserData, updateUserDataSection, clearUserData } = useAuth()

  if (!currentUser) {
    throw new Error('useUserData must be used within an authenticated context')
  }

  return {
    // Get all user data
    getAllData: async () => await getUserData(currentUser.id),
    
    // Get specific section data
    getSection: async (section: string) => {
      const allData = await getUserData(currentUser.id)
      return allData[section] || null
    },
    
    // Update specific section
    updateSection: async (section: string, data: any) => {
      return await updateUserDataSection(currentUser.id, section, data)
    },
    
    // Clear all user data
    clearAllData: async () => await clearUserData(currentUser.id),
    
    // Get data statistics
    getStats: async () => {
      const allData = await getUserData(currentUser.id)
      return {
        totalSections: Object.keys(allData).length,
        dataSize: JSON.stringify(allData).length,
        sections: Object.keys(allData).map(section => ({
          name: section,
          hasData: Object.keys(allData[section]).length > 1,
          lastUpdated: allData[section].lastUpdated
        }))
      }
    },
    
    // Check if section has meaningful data
    hasData: async (section: string) => {
      const allData = await getUserData(currentUser.id)
      const sectionData = allData[section]
      return sectionData && Object.keys(sectionData).length > 1
    }
  }
}

// Utility functions for common data operations
export const userDataUtils = {
  // Initialize a new section with defaults
  initializeSection: (section: string, defaults: any) => {
    return {
      ...defaults,
      lastUpdated: new Date().toISOString()
    }
  },
  
  // Add item to an array section
  addToArray: (currentArray: any[], newItem: any) => {
    return [...currentArray, { ...newItem, id: Date.now().toString() }]
  },
  
  // Update item in array section
  updateInArray: (currentArray: any[], itemId: string, updates: any) => {
    return currentArray.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    )
  },
  
  // Remove item from array section
  removeFromArray: (currentArray: any[], itemId: string) => {
    return currentArray.filter(item => item.id !== itemId)
  },
  
  // Merge data with existing section
  mergeSection: (existingData: any, newData: any) => {
    return {
      ...existingData,
      ...newData,
      lastUpdated: new Date().toISOString()
    }
  }
} 
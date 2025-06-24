'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load theme from localStorage or default to auto
    const savedTheme = localStorage.getItem('aingen_theme') as Theme || 'auto'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('aingen_theme', theme)
    
    // Apply theme to document
    const root = document.documentElement
    const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setIsDark(isDarkMode)
    
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const isDarkMode = mediaQuery.matches
        setIsDark(isDarkMode)
        if (isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'auto'
      return 'light'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="cassette-btn flex items-center space-x-2"
      title={`Current: ${theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="font-mono text-xs hidden sm:inline">
        {theme === 'auto' ? 'AUTO' : theme === 'dark' ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  )
} 
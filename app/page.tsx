'use client'

import React, { useState } from 'react'
import { Shield, TrendingUp, Clock, DollarSign, Brain, Lock, Calculator, BarChart3, User, MapPin, FileText, CheckCircle, Key, Fuel, Menu, X, Activity } from 'lucide-react'
import { AuthProvider, useAuth, LoginForm } from '../components/AuthManager'
import { UserManager } from '../components/UserManager'
import { ThemeToggle } from '../components/ThemeProvider'
import Dashboard from '../components/Dashboard'
import TimeValueCalculator from '../components/TimeValueCalculator'
import TrueCostCalculator from '../components/TrueCostCalculator'
import FinancialDashboard from '../components/FinancialDashboard'
import NetWorthTracker from '../components/NetWorthTracker'
import LifeContextManager from '../components/LifeContextManager'
import AIPersonalization from '../components/AIPersonalization'
import PrivacyGuard from '../components/PrivacyGuard'
import DataSources from '../components/DataSources'
import LocationManager from '../components/LocationManager'
import FuelCostManager from '../components/FuelCostManager'
import FREDApiKeyManager from '../components/FREDApiKeyManager'
import CensusAPIKeyManager from '../components/CensusAPIKeyManager'
import TaxPolicyUpdater from '../components/TaxPolicyUpdater'
import TaxDataValidator from '../components/TaxDataValidator'
import MonitoringDashboard from '../components/MonitoringDashboard'

// Tab configuration with categories
const tabs = [
  // Primary Features - Most Popular
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, category: 'primary' },
  { id: 'fuel-cost', name: 'Fuel Cost', icon: Fuel, category: 'primary' },
  { id: 'true-cost', name: 'True Cost Calculator', icon: Calculator, category: 'primary' },
  { id: 'financial-health', name: 'Financial Health', icon: TrendingUp, category: 'primary' },
  { id: 'net-worth', name: 'Net Worth Tracker', icon: DollarSign, category: 'primary' },
  
  // Secondary Features - Regular Use
  { id: 'time-value', name: 'Time Value', icon: Clock, category: 'secondary' },
  { id: 'life-context', name: 'Life Context', icon: Brain, category: 'secondary' },
  { id: 'location', name: 'Location', icon: MapPin, category: 'secondary' },
  { id: 'ai-insights', name: 'AI Insights', icon: Brain, category: 'secondary' },
  { id: 'monitoring', name: 'System Monitoring', icon: Activity, category: 'secondary' },
  
  // Setup & Config - Infrequent Use
  { id: 'account-manager', name: 'Account Manager', icon: User, category: 'setup' },
  { id: 'data-sources', name: 'Data Sources', icon: BarChart3, category: 'setup' },
  { id: 'fred-api', name: 'FRED API', icon: Key, category: 'setup' },
  { id: 'census-api', name: 'Census API', icon: Key, category: 'setup' },
  { id: 'tax-policy', name: 'Tax Policy', icon: FileText, category: 'setup' },
  { id: 'tax-validator', name: 'Tax Validator', icon: CheckCircle, category: 'setup' },
  { id: 'privacy', name: 'Privacy Guard', icon: Lock, category: 'setup' }
]

function MainApp() {
  const { isAuthenticated, currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    closeMobileMenu() // Close mobile menu when tab is selected
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-aegis-600" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Aingen</h1>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Engine for the People</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            User: {currentUser?.username}
          </div>
        </div>
        
        <nav className="mt-4">
          {/* Primary Features - Most Popular */}
          <div className="px-4 py-1">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              🔥 Most Used
            </div>
            {tabs.filter(tab => tab.category === 'primary').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Secondary Features - Regular Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              📊 Regular Use
            </div>
            {tabs.filter(tab => tab.category === 'secondary').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Setup & Config - Infrequent Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              ⚙️ Setup & Config
            </div>
            {tabs.filter(tab => tab.category === 'setup').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 dark:bg-aegis-900 text-aegis-700 dark:text-aegis-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-3 w-3" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-aegis-600" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Aingen</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser?.username}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div>
            {activeTab === 'dashboard' && <Dashboard />}

            {activeTab === 'fuel-cost' && <FuelCostManager />}
            {activeTab === 'true-cost' && <TrueCostCalculator />}
            {activeTab === 'financial-health' && <FinancialDashboard />}
            {activeTab === 'net-worth' && <NetWorthTracker />}
            {activeTab === 'time-value' && <TimeValueCalculator />}
            {activeTab === 'life-context' && <LifeContextManager />}
            {activeTab === 'location' && <LocationManager />}
            {activeTab === 'ai-insights' && <AIPersonalization />}
            {activeTab === 'account-manager' && <UserManager />}
            {activeTab === 'data-sources' && <DataSources />}
            {activeTab === 'fred-api' && <FREDApiKeyManager />}
            {activeTab === 'census-api' && <CensusAPIKeyManager />}
            {activeTab === 'tax-policy' && <TaxPolicyUpdater />}
            {activeTab === 'tax-validator' && <TaxDataValidator />}
            {activeTab === 'privacy' && <PrivacyGuard />}
            {activeTab === 'monitoring' && <MonitoringDashboard />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
} 
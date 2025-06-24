'use client'

import React, { useState } from 'react'
import { Shield, TrendingUp, Clock, DollarSign, Brain, Lock, Calculator, User, MapPin, FileText, CheckCircle, Key, Fuel, Menu, X, Activity, Zap, Cpu, Database } from 'lucide-react'
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

// Enhanced Tab configuration with cassette futurism styling
const tabs = [
  // Primary Features - Most Popular
  { id: 'dashboard', name: 'MAIN DASHBOARD', icon: Cpu, category: 'primary', status: 'online' },
  { id: 'fuel-cost', name: 'FUEL COST ANALYZER', icon: Fuel, category: 'primary', status: 'online' },
  { id: 'true-cost', name: 'TRUE COST CALCULATOR', icon: Calculator, category: 'primary', status: 'online' },
  { id: 'financial-health', name: 'FINANCIAL HEALTH', icon: TrendingUp, category: 'primary', status: 'online' },
  { id: 'net-worth', name: 'NET WORTH TRACKER', icon: DollarSign, category: 'primary', status: 'online' },
  
  // Secondary Features - Regular Use
  { id: 'time-value', name: 'TIME VALUE ENGINE', icon: Clock, category: 'secondary', status: 'online' },
  { id: 'life-context', name: 'LIFE CONTEXT AI', icon: Brain, category: 'secondary', status: 'online' },
  { id: 'location', name: 'LOCATION MANAGER', icon: MapPin, category: 'secondary', status: 'online' },
  { id: 'ai-insights', name: 'AI INSIGHTS', icon: Zap, category: 'secondary', status: 'online' },
  { id: 'monitoring', name: 'SYSTEM MONITORING', icon: Activity, category: 'secondary', status: 'warning' },
  
  // Setup & Config - Infrequent Use
  { id: 'account-manager', name: 'ACCOUNT MANAGER', icon: User, category: 'setup', status: 'online' },
  { id: 'data-sources', name: 'DATA SOURCES', icon: Database, category: 'setup', status: 'online' },
  { id: 'fred-api', name: 'FRED API CONFIG', icon: Key, category: 'setup', status: 'online' },
  { id: 'census-api', name: 'CENSUS API CONFIG', icon: Key, category: 'setup', status: 'online' },
  { id: 'tax-policy', name: 'TAX POLICY UPDATER', icon: FileText, category: 'setup', status: 'online' },
  { id: 'tax-validator', name: 'TAX DATA VALIDATOR', icon: CheckCircle, category: 'setup', status: 'online' },
  { id: 'privacy', name: 'PRIVACY GUARD', icon: Lock, category: 'setup', status: 'online' }
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

  const getStatusIndicator = (status: string) => {
    const statusClasses = {
      online: 'status-online',
      offline: 'status-offline',
      warning: 'status-warning'
    }
    return <div className={`status-indicator ${statusClasses[status as keyof typeof statusClasses]}`}>
      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
      {status.toUpperCase()}
    </div>
  }

  return (
    <div className="flex h-screen bg-cassette-900 text-cassette-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Enhanced Sidebar with Cassette Futurism styling */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 cassette-sidebar transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b-2 border-cassette-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-orange-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-cassette-50 font-mono tracking-wider">AEGIS ENGINE</h1>
                <p className="text-xs text-cassette-400 font-mono">v2.1.0 // ONLINE</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-cassette-700/50 transition-colors"
            >
              <X className="h-5 w-5 text-cassette-400" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-cassette-700/50 rounded-lg border border-cassette-600">
            <div className="text-xs text-cassette-400 font-mono mb-1">ACTIVE USER</div>
            <div className="text-sm text-cassette-50 font-mono">{currentUser?.username}</div>
            <div className="text-xs text-green-400 font-mono mt-1">● CONNECTED</div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Primary Features - Most Popular */}
          <div className="mb-6">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 font-mono border-b border-cassette-600 pb-2">
              🔥 PRIMARY SYSTEMS
            </div>
            {tabs.filter(tab => tab.category === 'primary').map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full nav-item mb-2 ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-mono">{tab.name}</div>
                  <div className="text-xs text-cassette-400">{getStatusIndicator(tab.status)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Secondary Features - Regular Use */}
          <div className="mb-6">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 font-mono border-b border-cassette-600 pb-2">
              📊 SECONDARY MODULES
            </div>
            {tabs.filter(tab => tab.category === 'secondary').map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full nav-item mb-2 ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-mono">{tab.name}</div>
                  <div className="text-xs text-cassette-400">{getStatusIndicator(tab.status)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Setup & Config - Infrequent Use */}
          <div className="mb-6">
            <div className="text-xs font-bold text-magenta-400 uppercase tracking-widest mb-3 font-mono border-b border-cassette-600 pb-2">
              ⚙️ SYSTEM CONFIG
            </div>
            {tabs.filter(tab => tab.category === 'setup').map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full nav-item mb-2 ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-mono">{tab.name}</div>
                  <div className="text-xs text-cassette-400">{getStatusIndicator(tab.status)}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>
        
        {/* Footer with system status */}
        <div className="p-4 border-t-2 border-cassette-600">
          <div className="text-xs text-cassette-400 font-mono mb-2">SYSTEM STATUS</div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-green-400">● OPERATIONAL</span>
            <span className="text-cassette-400">CPU: 23%</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono mt-1">
            <span className="text-orange-400">● CACHE: ACTIVE</span>
            <span className="text-cassette-400">MEM: 67%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden cassette-panel border-b-2 border-cassette-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-cassette-700/50 transition-colors"
              >
                <Menu className="h-5 w-5 text-cassette-400" />
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-orange-400" />
                <h1 className="text-lg font-bold text-cassette-50 font-mono">AEGIS ENGINE</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="text-sm text-cassette-300 font-mono">
                {currentUser?.username}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-cassette-900 via-cassette-800 to-cassette-900">
          <div className="max-w-7xl mx-auto">
            {/* Content Header */}
            <div className="mb-6">
              <div className="cassette-panel">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-cassette-50 font-mono mb-2">
                      {tabs.find(tab => tab.id === activeTab)?.name || 'SYSTEM'}
                    </h2>
                    <p className="text-cassette-400 font-mono text-sm">
                      MODULE STATUS: {tabs.find(tab => tab.id === activeTab)?.status?.toUpperCase() || 'UNKNOWN'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="cassette-loading"></div>
                    <span className="text-xs text-cassette-400 font-mono">SYNCING...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="cassette-panel">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'fuel-cost' && <FuelCostManager />}
              {activeTab === 'true-cost' && <TrueCostCalculator />}
              {activeTab === 'financial-health' && <FinancialDashboard />}
              {activeTab === 'net-worth' && <NetWorthTracker />}
              {activeTab === 'time-value' && <TimeValueCalculator />}
              {activeTab === 'life-context' && <LifeContextManager />}
              {activeTab === 'location' && <LocationManager />}
              {activeTab === 'ai-insights' && <AIPersonalization />}
              {activeTab === 'monitoring' && <MonitoringDashboard />}
              {activeTab === 'account-manager' && <UserManager />}
              {activeTab === 'data-sources' && <DataSources />}
              {activeTab === 'fred-api' && <FREDApiKeyManager />}
              {activeTab === 'census-api' && <CensusAPIKeyManager />}
              {activeTab === 'tax-policy' && <TaxPolicyUpdater />}
              {activeTab === 'tax-validator' && <TaxDataValidator />}
              {activeTab === 'privacy' && <PrivacyGuard />}
            </div>
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
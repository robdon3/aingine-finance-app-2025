'use client'

import React, { useState, useEffect } from 'react'
import { Shield, TrendingUp, Clock, DollarSign, Brain, Lock, Calculator, BarChart3, User, Settings, Database, MapPin, FileText, CheckCircle, Key, Fuel, Menu, X } from 'lucide-react'
import { AuthProvider, useAuth, LoginForm, UserManager } from '../components/AuthManager'
import TimeValueCalculator from '../components/TimeValueCalculator'
import TrueCostCalculator from '../components/TrueCostCalculator'
import FinancialDashboard from '../components/FinancialDashboard'
import NetWorthTracker from '../components/NetWorthTracker'
import LifeContextManager from '../components/LifeContextManager'
import AccountManager from '../components/AccountManager'
import AIPersonalization from '../components/AIPersonalization'
import PrivacyGuard from '../components/PrivacyGuard'
import DataSources from '../components/DataSources'
import LocationManager from '../components/LocationManager'
import FuelCostManager from '../components/FuelCostManager'
import FREDApiKeyManager from '../components/FREDApiKeyManager'
import CensusAPIKeyManager from '../components/CensusAPIKeyManager'
import TaxPolicyUpdater from '../components/TaxPolicyUpdater'
import TaxDataValidator from '../components/TaxDataValidator'

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
  
  // Setup & Config - Infrequent Use
  { id: 'account-manager', name: 'Account Manager', icon: User, category: 'setup' },
  { id: 'data-sources', name: 'Data Sources', icon: Database, category: 'setup' },
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-aegis-600" />
              <h1 className="text-lg font-bold text-gray-900">Project Aegis</h1>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">Engine for the People</p>
          <div className="mt-2 text-xs text-gray-500">
            User: {currentUser?.username}
          </div>
        </div>
        
        <nav className="mt-4">
          {/* Primary Features - Most Popular */}
          <div className="px-4 py-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              🔥 Most Used
            </div>
            {tabs.filter(tab => tab.category === 'primary').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 text-aegis-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Secondary Features - Regular Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              📊 Regular Use
            </div>
            {tabs.filter(tab => tab.category === 'secondary').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 text-aegis-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Setup & Config - Infrequent Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              ⚙️ Setup & Config
            </div>
            {tabs.filter(tab => tab.category === 'setup').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs transition-colors duration-200 mb-1 ${
                  activeTab === tab.id
                    ? 'bg-aegis-100 text-aegis-700'
                    : 'text-gray-500 hover:bg-gray-100'
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
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-aegis-600" />
                <h1 className="text-lg font-bold text-gray-900">Aegis</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {currentUser?.username}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Agency Dashboard</h2>
                  <p className="text-gray-600">Comprehensive overview of your financial health, life context, and key metrics.</p>
                </div>
                
                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Net Worth</p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">$247,850</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+$12,450</p>
                        <p className="text-xs text-gray-500">+5.3%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Fuel Cost Today</p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">$3.42</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600">+$0.08</p>
                        <p className="text-xs text-gray-500">+2.4%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">$2,850</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+$320</p>
                        <p className="text-xs text-gray-500">+12.6%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Time Value Score</p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900">87/100</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+5</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Financial Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Financial Health Summary */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Monthly Income</p>
                          <p className="text-lg lg:text-xl font-bold text-gray-900">$8,500</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Expenses</p>
                          <p className="text-lg lg:text-xl font-bold text-gray-900">$5,200</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Savings Rate</p>
                          <p className="text-lg lg:text-xl font-bold text-green-600">33.5%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Emergency Fund</p>
                          <p className="text-lg lg:text-xl font-bold text-blue-600">6.2 months</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent True Cost Analysis */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent True Cost Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">New Car Purchase</p>
                            <p className="text-sm text-gray-600">Sticker: $35,000</p>
                          </div>
                          <div className="sm:text-right mt-2 sm:mt-0">
                            <p className="font-bold text-red-600">True Cost: $52,400</p>
                            <p className="text-xs text-gray-500">+49.7% hidden costs</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Home Renovation</p>
                            <p className="text-sm text-gray-600">Quote: $25,000</p>
                          </div>
                          <div className="sm:text-right mt-2 sm:mt-0">
                            <p className="font-bold text-red-600">True Cost: $31,200</p>
                            <p className="text-xs text-gray-500">+24.8% overruns</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net Worth Trend */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Worth Trend</h3>
                      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Chart placeholder - Net worth over time</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Quick Actions & Insights */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left p-3 bg-aegis-50 hover:bg-aegis-100 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <Calculator className="h-5 w-5 text-aegis-600" />
                            <div>
                              <p className="font-medium text-gray-900">Calculate True Cost</p>
                              <p className="text-sm text-gray-600">New purchase decision</p>
                            </div>
                          </div>
                        </button>
                        <button className="w-full text-left p-3 bg-aegis-50 hover:bg-aegis-100 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <Fuel className="h-5 w-5 text-aegis-600" />
                            <div>
                              <p className="font-medium text-gray-900">Check Fuel Prices</p>
                              <p className="text-sm text-gray-600">Current AAA rates</p>
                            </div>
                          </div>
                        </button>
                        <button className="w-full text-left p-3 bg-aegis-50 hover:bg-aegis-100 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-aegis-600" />
                            <div>
                              <p className="font-medium text-gray-900">Time Value Analysis</p>
                              <p className="text-sm text-gray-600">Opportunity costs</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Savings Opportunity</p>
                          <p className="text-xs text-green-700">You could save $2,400/year by refinancing your car loan</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Investment Alert</p>
                          <p className="text-xs text-blue-700">Your emergency fund exceeds 6 months - consider investing excess</p>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">Tax Optimization</p>
                          <p className="text-xs text-yellow-700">Maximize your 401(k) contribution to reduce tax burden</p>
                        </div>
                      </div>
                    </div>

                    {/* Life Context Summary */}
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Context</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Age</span>
                          <span className="text-sm font-medium text-gray-900">32 years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Career Stage</span>
                          <span className="text-sm font-medium text-gray-900">Mid-career</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Family Status</span>
                          <span className="text-sm font-medium text-gray-900">Married, 1 child</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Primary Goal</span>
                          <span className="text-sm font-medium text-gray-900">Home ownership</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
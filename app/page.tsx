'use client'

import React, { useState, useEffect } from 'react'
import { Shield, TrendingUp, Clock, DollarSign, Brain, Lock, Calculator, BarChart3, User, Settings, Database, MapPin, FileText, CheckCircle, Key, Fuel } from 'lucide-react'
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
import TaxPolicyUpdater from '../components/TaxPolicyUpdater'
import TaxDataValidator from '../components/TaxDataValidator'
import FREDApiKeyManager from '../components/FREDApiKeyManager'
import CensusDataInfo from '../components/CensusAPIKeyManager'
import FuelCostManager from '../components/FuelCostManager'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Reorganized tabs by popularity and frequency of use
  const tabs = [
    // 🥇 MOST POPULAR - Daily/Weekly Use
    { id: 'dashboard', label: 'Dashboard', icon: Shield, category: 'primary' },
    { id: 'fuel-cost', label: 'Fuel Cost', icon: Fuel, category: 'primary' },
    { id: 'true-cost', label: 'True Cost Calculator', icon: Calculator, category: 'primary' },
    { id: 'finance', label: 'Financial Health', icon: DollarSign, category: 'primary' },
    { id: 'net-worth', label: 'Net Worth Tracker', icon: BarChart3, category: 'primary' },
    
    // 🥈 REGULAR USE - Monthly/Quarterly
    { id: 'time-value', label: 'Time Value', icon: Clock, category: 'secondary' },
    { id: 'life-context', label: 'Life Context', icon: User, category: 'secondary' },
    { id: 'location', label: 'Location', icon: MapPin, category: 'secondary' },
    { id: 'ai', label: 'AI Insights', icon: Brain, category: 'secondary' },
    
    // 🥉 SETUP & CONFIGURATION - One-time/Infrequent
    { id: 'account', label: 'Account Manager', icon: Settings, category: 'setup' },
    { id: 'data-sources', label: 'Data Sources', icon: Database, category: 'setup' },
    { id: 'fred-key', label: 'FRED API Key', icon: Key, category: 'setup' },
    { id: 'census-key', label: 'Census Data', icon: Database, category: 'setup' },
    { id: 'tax-policy', label: 'Tax Policy', icon: FileText, category: 'setup' },
    { id: 'tax-validator', label: 'Tax Validator', icon: CheckCircle, category: 'setup' },
    { id: 'privacy', label: 'Privacy', icon: Lock, category: 'setup' },
  ]

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'primary':
        return 'text-gray-900 font-medium'
      case 'secondary':
        return 'text-gray-700'
      case 'setup':
        return 'text-gray-500 text-sm'
      default:
        return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'primary':
        return '🔥'
      case 'secondary':
        return '📊'
      case 'setup':
        return '⚙️'
      default:
        return ''
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-aegis-600" />
            <h1 className="text-lg font-bold text-gray-900">Project Aegis</h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">Engine for the People</p>
        </div>
        
        <nav className="mt-4">
          {/* Primary Features - Most Popular */}
          <div className="px-4 py-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              🔥 Most Used
            </div>
            {tabs.filter(tab => tab.category === 'primary').map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-left transition-colors rounded-md mb-0.5 ${
                    activeTab === tab.id
                      ? 'bg-aegis-50 text-aegis-700 border border-aegis-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Secondary Features - Regular Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              📊 Regular Use
            </div>
            {tabs.filter(tab => tab.category === 'secondary').map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 text-left transition-colors rounded-md mb-0.5 ${
                    activeTab === tab.id
                      ? 'bg-aegis-50 text-aegis-700 border border-aegis-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Setup & Configuration - Infrequent Use */}
          <div className="px-4 py-1 mt-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              ⚙️ Setup & Config
            </div>
            {tabs.filter(tab => tab.category === 'setup').map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 px-2 py-1 text-left transition-colors rounded-md mb-0.5 ${
                    activeTab === tab.id
                      ? 'bg-aegis-50 text-aegis-700 border border-aegis-200'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Agency Dashboard</h2>
                <p className="text-gray-600">Comprehensive overview of your financial health, life context, and key metrics.</p>
              </div>
              
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Current Net Worth</p>
                      <p className="text-2xl font-bold text-gray-900">$247,850</p>
                      <p className="text-sm text-green-600">+$12,450 (5.3%)</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-aegis-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fuel Cost Today</p>
                      <p className="text-2xl font-bold text-gray-900">$3.42</p>
                      <p className="text-sm text-red-600">+$0.08 (2.4%)</p>
                    </div>
                    <Fuel className="h-8 w-8 text-aegis-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
                      <p className="text-2xl font-bold text-gray-900">$2,850</p>
                      <p className="text-sm text-green-600">+$320 (12.6%)</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-aegis-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time Value Score</p>
                      <p className="text-2xl font-bold text-gray-900">87/100</p>
                      <p className="text-sm text-green-600">+5 points</p>
                    </div>
                    <Clock className="h-8 w-8 text-aegis-600" />
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Financial Overview */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Financial Health Summary */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Financial Health Overview</h3>
                      <button 
                        onClick={() => setActiveTab('finance')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Income</p>
                        <p className="text-xl font-semibold text-gray-900">$8,500</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Expenses</p>
                        <p className="text-xl font-semibold text-gray-900">$5,650</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Savings Rate</p>
                        <p className="text-xl font-semibold text-green-600">33.5%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Emergency Fund</p>
                        <p className="text-xl font-semibold text-gray-900">6.2 months</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent True Cost Calculations */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent True Cost Analysis</h3>
                      <button 
                        onClick={() => setActiveTab('true-cost')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        Calculate More →
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">New Car Purchase</p>
                          <p className="text-sm text-gray-600">Sticker: $35,000 | True Cost: $52,400</p>
                        </div>
                        <span className="text-sm text-red-600 font-medium">+49%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Home Renovation</p>
                          <p className="text-sm text-gray-600">Contract: $25,000 | True Cost: $31,200</p>
                        </div>
                        <span className="text-sm text-red-600 font-medium">+25%</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Worth Trend */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Net Worth Trend</h3>
                      <button 
                        onClick={() => setActiveTab('net-worth')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">📈 Net Worth Chart Placeholder</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Assets</p>
                        <p className="font-semibold text-gray-900">$312,400</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Liabilities</p>
                        <p className="font-semibold text-gray-900">$64,550</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Net Worth</p>
                        <p className="font-semibold text-green-600">$247,850</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Insights */}
                <div className="space-y-6">
                  {/* Fuel Cost Summary */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Fuel Cost Summary</h3>
                      <button 
                        onClick={() => setActiveTab('fuel-cost')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">National Average</span>
                        <span className="font-medium">$3.42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Your State (CA)</span>
                        <span className="font-medium">$4.85</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weekly Cost</span>
                        <span className="font-medium">$68.40</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Last updated: 2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Life Context Highlights */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Life Context</h3>
                      <button 
                        onClick={() => setActiveTab('life-context')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Emergency fund goal: 85% complete</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Retirement savings: 12 months behind</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Next milestone: Home purchase (18 months)</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Summary */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                      <button 
                        onClick={() => setActiveTab('ai')}
                        className="text-sm text-aegis-600 hover:text-aegis-700 font-medium"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Optimization Opportunity</p>
                        <p className="text-xs text-blue-700 mt-1">Consider refinancing your mortgage to save $180/month</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Positive Trend</p>
                        <p className="text-xs text-green-700 mt-1">Your savings rate is above the 90th percentile</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setActiveTab('true-cost')}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        💰 Calculate True Cost
                      </button>
                      <button 
                        onClick={() => setActiveTab('time-value')}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        ⏰ Time Value Analysis
                      </button>
                      <button 
                        onClick={() => setActiveTab('fuel-cost')}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        ⛽ Plan Trip Cost
                      </button>
                      <button 
                        onClick={() => setActiveTab('net-worth')}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        📊 Update Net Worth
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && <AccountManager />}
          {activeTab === 'location' && <LocationManager />}
          {activeTab === 'fuel-cost' && <FuelCostManager />}
          {activeTab === 'fred-key' && <FREDApiKeyManager />}
          {activeTab === 'census-key' && <CensusDataInfo />}
          {activeTab === 'tax-policy' && <TaxPolicyUpdater />}
          {activeTab === 'tax-validator' && <TaxDataValidator />}
          {activeTab === 'life-context' && <LifeContextManager />}
          {activeTab === 'time-value' && <TimeValueCalculator />}
          {activeTab === 'true-cost' && <TrueCostCalculator />}
          {activeTab === 'finance' && <FinancialDashboard />}
          {activeTab === 'net-worth' && <NetWorthTracker />}
          {activeTab === 'data-sources' && <DataSources />}
          {activeTab === 'ai' && <AIPersonalization />}
          {activeTab === 'privacy' && <PrivacyGuard />}
        </div>
      </div>
    </div>
  )
} 
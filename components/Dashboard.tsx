'use client'

import React, { useState, useEffect } from 'react'
import { useUserData } from './UserDataManager'
import { Calculator, Fuel, Clock, TrendingUp, PiggyBank, ShieldCheck, Zap, Cpu, Database, Activity, Target, AlertTriangle } from 'lucide-react'

// Helper to format currency
const formatCurrency = (value: number | undefined) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)
}

export default function Dashboard() {
  const { getSection } = useUserData()
  const [data, setData] = useState<Record<string, unknown>>({
    financialHealth: {},
    netWorth: {},
    trueCost: {},
    timeValue: {},
    fuelCost: {},
    lifeContext: {},
    aiInsights: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          financialHealth,
          netWorth,
          trueCost,
          timeValue,
          fuelCost,
          lifeContext,
          aiInsights
        ] = await Promise.all([
          getSection('financialHealth'),
          getSection('netWorth'),
          getSection('timeValue'),
          getSection('trueCost'),
          getSection('fuelCost'),
          getSection('lifeContext'),
          getSection('aiInsights')
        ])

        setData({
          financialHealth: financialHealth || {},
          netWorth: netWorth || {},
          trueCost: trueCost || {},
          timeValue: timeValue || {},
          fuelCost: fuelCost || {},
          lifeContext: lifeContext || {},
          aiInsights: aiInsights || {}
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [getSection])

  // Function to handle quick action navigation
  const handleQuickAction = (action: string) => {
    // Find the tab element and click it
    const tabElement = document.querySelector(`[data-tab="${action}"]`) as HTMLElement
    if (tabElement) {
      tabElement.click()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="cassette-panel">
          <div className="flex items-center space-x-3 mb-4">
            <Cpu className="h-6 w-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-cassette-50 font-mono">SYSTEM DASHBOARD</h2>
          </div>
          <p className="text-cassette-400 font-mono">INITIALIZING DATA STREAMS...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="data-card animate-pulse">
              <div className="h-4 bg-cassette-600 rounded mb-2"></div>
              <div className="h-8 bg-cassette-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- Safe Calculations with default fallbacks ---
  const netWorthData = data.netWorth as { assets?: Array<{ value?: number }>; liabilities?: Array<{ value?: number }> } || {}
  const financialHealthData = data.financialHealth as { income?: number; expenses?: number } || {}
  const aiInsightsData = data.aiInsights as { insights?: unknown[] } || {}
  const lifeContextData = data.lifeContext as { goals?: unknown[] } || {}
  const fuelCostData = data.fuelCost as { gasPrices?: { regular?: number } } || {}

  const assets = netWorthData.assets || []
  const liabilities = netWorthData.liabilities || []
  const netWorthValue = assets.reduce((sum: number, a: { value?: number }) => sum + (a.value || 0), 0) - liabilities.reduce((sum: number, l: { value?: number }) => sum + (l.value || 0), 0)
  
  const income = financialHealthData.income || 0
  const expenses = financialHealthData.expenses || 0
  const monthlySavings = income - expenses
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0
  
  const cashAssets = assets.find((a: { value?: number; type?: string }) => a.type === 'cash')?.value || 0
  const emergencyFund = expenses > 0 ? cashAssets / expenses : 0

  const aiInsightsList = aiInsightsData.insights || []
  const lifeContextGoals = lifeContextData.goals || []

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="cassette-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Cpu className="h-8 w-8 text-orange-400" />
            <div>
              <h2 className="text-2xl font-bold text-cassette-50 font-mono">MAIN DASHBOARD</h2>
              <p className="text-cassette-400 font-mono text-sm">COMPREHENSIVE FINANCIAL OVERVIEW {'//'} v2.1.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="status-indicator status-online">
              <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
              ONLINE
            </div>
            <div className="cassette-loading"></div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => handleQuickAction('fuel-cost')}
            className="cassette-btn flex items-center space-x-2"
          >
            <Fuel className="h-4 w-4" />
            <span className="font-mono text-xs">FUEL COST</span>
          </button>
          <button 
            onClick={() => handleQuickAction('true-cost')}
            className="cassette-btn flex items-center space-x-2"
          >
            <Calculator className="h-4 w-4" />
            <span className="font-mono text-xs">TRUE COST</span>
          </button>
          <button 
            onClick={() => handleQuickAction('time-value')}
            className="cassette-btn flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono text-xs">TIME VALUE</span>
          </button>
          <button 
            onClick={() => handleQuickAction('financial-health')}
            className="cassette-btn flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="font-mono text-xs">FINANCIAL</span>
          </button>
        </div>
      </div>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Net Worth */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">NET WORTH</span>
            </div>
            <div className="status-indicator status-online">
              <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
              ACTIVE
            </div>
          </div>
          <p className="text-2xl font-bold text-cassette-50 font-mono">{formatCurrency(netWorthValue)}</p>
          <div className="mt-2 text-xs text-cassette-400 font-mono">
            ASSETS: {assets.length} | LIABILITIES: {liabilities.length}
          </div>
        </div>
        
        {/* Avg. Fuel Cost */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Fuel className="h-5 w-5 text-orange-400" />
              <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">FUEL COST</span>
            </div>
            <div className="status-indicator status-warning">
              <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
              MONITOR
            </div>
          </div>
          <p className="text-2xl font-bold text-cassette-50 font-mono">{formatCurrency(fuelCostData.gasPrices?.regular)}</p>
          <div className="mt-2 text-xs text-cassette-400 font-mono">
            REGULAR GRADE {'//'} PER GALLON
          </div>
        </div>
        
        {/* Monthly Savings */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-teal-400" />
              <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">SAVINGS</span>
            </div>
            <div className={`status-indicator ${monthlySavings >= 0 ? 'status-online' : 'status-offline'}`}>
              <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
              {monthlySavings >= 0 ? 'POSITIVE' : 'NEGATIVE'}
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono ${monthlySavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(monthlySavings)}
          </p>
          <div className="mt-2 text-xs text-cassette-400 font-mono">
            RATE: {savingsRate.toFixed(1)}% {'//'} MONTHLY
          </div>
        </div>
        
        {/* Emergency Fund */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">EMERGENCY</span>
            </div>
            <div className={`status-indicator ${emergencyFund >= 6 ? 'status-online' : emergencyFund >= 3 ? 'status-warning' : 'status-offline'}`}>
              <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
              {emergencyFund >= 6 ? 'SAFE' : emergencyFund >= 3 ? 'LOW' : 'CRITICAL'}
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400 font-mono">{emergencyFund.toFixed(1)} MONTHS</p>
          <div className="mt-2 text-xs text-cassette-400 font-mono">
            CASH: {formatCurrency(cashAssets)} {'//'} COVERAGE
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Health Summary */}
          <div className="cassette-panel">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-bold text-cassette-50 font-mono">FINANCIAL HEALTH SUMMARY</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="data-card">
                <p className="text-xs text-cassette-400 font-mono uppercase tracking-wider mb-1">MONTHLY INCOME</p>
                <p className="text-lg font-bold text-green-400 font-mono">{formatCurrency(income)}</p>
              </div>
              <div className="data-card">
                <p className="text-xs text-cassette-400 font-mono uppercase tracking-wider mb-1">MONTHLY EXPENSES</p>
                <p className="text-lg font-bold text-red-400 font-mono">{formatCurrency(expenses)}</p>
              </div>
              <div className="data-card">
                <p className="text-xs text-cassette-400 font-mono uppercase tracking-wider mb-1">SAVINGS RATE</p>
                <p className={`text-lg font-bold font-mono ${savingsRate >= 10 ? 'text-green-400' : 'text-orange-400'}`}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="data-card">
                <p className="text-xs text-cassette-400 font-mono uppercase tracking-wider mb-1">ASSETS/DEBT RATIO</p>
                <p className="text-lg font-bold text-blue-400 font-mono">
                  {liabilities.reduce((s: number, l: { value?: number }) => s + (l.value || 0), 0) > 0 
                    ? `${(assets.reduce((s: number, a: { value?: number }) => s + (a.value || 0), 0) / liabilities.reduce((s: number, l: { value?: number }) => s + (l.value || 0), 0)).toFixed(1)}x` 
                    : '∞'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity & Insights */}
          <div className="cassette-panel">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-magenta-400" />
              <h3 className="text-lg font-bold text-cassette-50 font-mono">SYSTEM INSIGHTS</h3>
            </div>
            <div className="space-y-3">
              {aiInsightsList.length > 0 ? (
                (aiInsightsList as Array<{ message?: string }>).slice(0, 3).map((insight, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-cassette-700/50 rounded-lg border border-cassette-600">
                    <Zap className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-cassette-50 font-mono">{insight.message || 'AI Insight available'}</p>
                      <p className="text-xs text-cassette-400 font-mono mt-1">AI ANALYSIS {'//'} {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-cassette-700/50 rounded-lg border border-cassette-600">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <div>
                    <p className="text-sm text-cassette-50 font-mono">NO AI INSIGHTS AVAILABLE</p>
                    <p className="text-xs text-cassette-400 font-mono">CONFIGURE AI MODULE FOR PERSONALIZED INSIGHTS</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats & Goals */}
        <div className="space-y-6">
          {/* Life Context Goals */}
          <div className="cassette-panel">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-bold text-cassette-50 font-mono">LIFE CONTEXT</h3>
            </div>
            <div className="space-y-3">
              {lifeContextGoals.length > 0 ? (
                (lifeContextGoals as Array<{ name?: string; progress?: number; target?: string }>).slice(0, 3).map((goal, index: number) => (
                  <div key={index} className="p-3 bg-cassette-700/50 rounded-lg border border-cassette-600">
                    <p className="text-sm text-cassette-50 font-mono">{goal.name || 'Goal'}</p>
                    <p className="text-xs text-cassette-400 font-mono mt-1">
                      PROGRESS: {goal.progress || 0}% {'//'} {goal.target || 'Target set'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-cassette-700/50 rounded-lg border border-cassette-600">
                  <p className="text-sm text-cassette-50 font-mono">NO GOALS CONFIGURED</p>
                  <p className="text-xs text-cassette-400 font-mono mt-1">SET LIFE CONTEXT GOALS FOR BETTER INSIGHTS</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="cassette-panel">
            <div className="flex items-center space-x-2 mb-4">
              <Cpu className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold text-cassette-50 font-mono">SYSTEM STATUS</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cassette-400 font-mono">DATA SYNC</span>
                <div className="status-indicator status-online">
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  ACTIVE
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cassette-400 font-mono">API CONNECTIONS</span>
                <div className="status-indicator status-online">
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  STABLE
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cassette-400 font-mono">CACHE STATUS</span>
                <div className="status-indicator status-warning">
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  UPDATING
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cassette-400 font-mono">SECURITY</span>
                <div className="status-indicator status-online">
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  SECURE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
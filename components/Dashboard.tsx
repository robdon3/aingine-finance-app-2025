'use client'

import React, { useState, useEffect } from 'react'
import { useUserData } from './UserDataManager'
import { Calculator, Fuel, Clock, TrendingUp, PiggyBank, ShieldCheck, Zap } from 'lucide-react'

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
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Agency Dashboard</h2>
          <p className="text-gray-700 dark:text-gray-300">Loading your data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- Safe Calculations with default fallbacks ---
  const netWorthData = data.netWorth as { assets?: Array<{ value?: number }>; liabilities?: Array<{ value?: number }> } || {}
  const financialHealthData = data.financialHealth as { income?: number; expenses?: number } || {}
  const trueCostData = data.trueCost as { calculations?: unknown[] } || {}
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

  const trueCostCalculations = trueCostData.calculations || []
  const aiInsightsList = aiInsightsData.insights || []
  const lifeContextGoals = lifeContextData.goals || []

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Agency Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300">Comprehensive overview of your financial health, life context, and key metrics.</p>
      </div>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Net Worth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Net Worth</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(netWorthValue)}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        {/* Avg. Fuel Cost */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg. Fuel Cost</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(fuelCostData.gasPrices?.regular)}</p>
            </div>
            <Fuel className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        
        {/* Monthly Savings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Savings</p>
              <p className={`text-xl lg:text-2xl font-bold ${monthlySavings >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{formatCurrency(monthlySavings)}</p>
            </div>
            <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        {/* Emergency Fund */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Fund</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-400">{emergencyFund.toFixed(1)} months</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Health Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Financial Health Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Income</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(income)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Monthly Expenses</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(expenses)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Savings Rate</p>
                <p className={`text-lg lg:text-xl font-bold ${savingsRate >= 10 ? 'text-green-700 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{savingsRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Assets vs Debt</p>
                <p className="text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-400">
                  {liabilities.reduce((s: number, l: { value?: number }) => s + (l.value || 0), 0) > 0 
                    ? `${(assets.reduce((s: number, a: { value?: number }) => s + (a.value || 0), 0) / liabilities.reduce((s: number, l: { value?: number }) => s + (l.value || 0), 0)).toFixed(1)}x` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent True Cost Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent True Cost Analysis</h3>
            <div className="space-y-3">
              {trueCostCalculations.length > 0 ? (
                trueCostCalculations.slice(0, 2).map((calc: unknown) => {
                  const calcData = calc as { id?: string; name?: string; stickerPrice?: number; trueCost?: number }
                  return (
                    <div key={calcData.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{calcData.name || 'Untitled Calculation'}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Sticker: {formatCurrency(calcData.stickerPrice)}</p>
                      </div>
                      <div className="sm:text-right mt-2 sm:mt-0">
                        <p className="font-bold text-red-700 dark:text-red-400">True Cost: {formatCurrency(calcData.trueCost)}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {calcData.stickerPrice && calcData.stickerPrice > 0 
                            ? `+${(((calcData.trueCost || 0) - calcData.stickerPrice) / calcData.stickerPrice * 100).toFixed(1)}% hidden costs`
                            : 'Invalid sticker price'}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-center py-4">No True Cost analyses performed yet.</p>
              )}
            </div>
          </div>

          {/* Net Worth Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Net Worth Trend</h3>
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-700 dark:text-gray-300">Chart placeholder - Net worth over time</p>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('true-cost')}
                className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Calculate True Cost</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">New purchase decision</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('fuel-cost')}
                className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Check Fuel Prices</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Current AAA rates</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('time-value')}
                className="w-full text-left p-3 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Time Value Calculator</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Future value analysis</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span>AI Insights</span>
            </h3>
            <div className="space-y-3">
              {aiInsightsList.length > 0 ? (
                aiInsightsList.slice(0, 3).map((insight: unknown, index: number) => {
                  const insightData = insight as { message?: string } | string
                  return (
                    <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        {typeof insightData === 'object' && insightData !== null ? insightData.message || 'Unknown insight' : insightData}
                      </p>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-center py-4">No AI insights available yet.</p>
              )}
            </div>
          </div>

          {/* Life Context Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Life Context Goals</h3>
            <div className="space-y-2">
              {lifeContextGoals.length > 0 ? (
                lifeContextGoals.slice(0, 3).map((goal: unknown, index: number) => {
                  const goalData = goal as { name?: string } | string
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {typeof goalData === 'object' && goalData !== null ? goalData.name || 'Unknown goal' : goalData}
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-center py-4">No goals set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
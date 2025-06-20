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

// Helper to format numbers with signs
const formatSignedCurrency = (value: number) => {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${formatCurrency(Math.abs(value))}`
}

export default function Dashboard() {
  const { getSection, hasData } = useUserData()
  const [data, setData] = useState<any>({
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Agency Dashboard</h2>
          <p className="text-gray-600">Loading your data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- Safe Calculations with default fallbacks ---
  const assets = data.netWorth.assets || []
  const liabilities = data.netWorth.liabilities || []
  const netWorthValue = assets.reduce((sum: number, a: any) => sum + (a.value || 0), 0) - liabilities.reduce((sum: number, l: any) => sum + (l.value || 0), 0)
  
  const income = data.financialHealth.income || 0
  const expenses = data.financialHealth.expenses || 0
  const monthlySavings = income - expenses
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0
  
  const cashAssets = assets.find((a: any) => a.type === 'cash')?.value || 0
  const emergencyFund = expenses > 0 ? cashAssets / expenses : 0

  const trueCostCalculations = data.trueCost.calculations || []
  const aiInsightsList = data.aiInsights.insights || []
  const lifeContextGoals = data.lifeContext.goals || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Agency Dashboard</h2>
        <p className="text-gray-600">Comprehensive overview of your financial health, life context, and key metrics.</p>
      </div>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Net Worth */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Net Worth</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(netWorthValue)}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Avg. Fuel Cost */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Fuel Cost</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(data.fuelCost.gasPrices?.regular)}</p>
            </div>
            <Fuel className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Monthly Savings */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
              <p className={`text-xl lg:text-2xl font-bold ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(monthlySavings)}</p>
            </div>
            <PiggyBank className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Emergency Fund */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Fund</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-600">{emergencyFund.toFixed(1)} months</p>
            </div>
            <ShieldCheck className="h-6 w-6 text-gray-400" />
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
                <p className="text-lg lg:text-xl font-bold text-gray-900">{formatCurrency(income)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{formatCurrency(expenses)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Savings Rate</p>
                <p className={`text-lg lg:text-xl font-bold ${savingsRate >= 10 ? 'text-green-600' : 'text-orange-500'}`}>{savingsRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assets vs Debt</p>
                <p className="text-lg lg:text-xl font-bold text-blue-600">
                  {liabilities.reduce((s: number, l:any) => s + l.value, 0) > 0 
                    ? `${(assets.reduce((s: number, a:any) => s + a.value, 0) / liabilities.reduce((s: number, l:any) => s + l.value, 0)).toFixed(1)}x` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent True Cost Analysis */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent True Cost Analysis</h3>
            <div className="space-y-3">
              {trueCostCalculations.length > 0 ? (
                trueCostCalculations.slice(0, 2).map((calc: any) => (
                  <div key={calc.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{calc.name || 'Untitled Calculation'}</p>
                      <p className="text-sm text-gray-600">Sticker: {formatCurrency(calc.stickerPrice)}</p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className="font-bold text-red-600">True Cost: {formatCurrency(calc.trueCost)}</p>
                      <p className="text-xs text-gray-500">
                        {calc.stickerPrice > 0 
                          ? `+${(((calc.trueCost - calc.stickerPrice) / calc.stickerPrice) * 100).toFixed(1)}% hidden costs`
                          : 'Invalid sticker price'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No True Cost analyses performed yet.</p>
              )}
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
                    <p className="font-medium text-gray-900">Time Value Calculator</p>
                    <p className="text-sm text-gray-600">Future value analysis</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-aegis-600" />
              <span>AI Insights</span>
            </h3>
            <div className="space-y-3">
              {aiInsightsList.length > 0 ? (
                aiInsightsList.slice(0, 3).map((insight: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">{insight.message || insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No AI insights available yet.</p>
              )}
            </div>
          </div>

          {/* Life Context Goals */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Context Goals</h3>
            <div className="space-y-2">
              {lifeContextGoals.length > 0 ? (
                lifeContextGoals.slice(0, 3).map((goal: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-aegis-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{goal.name || goal}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No goals set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
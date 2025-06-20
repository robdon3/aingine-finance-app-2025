'use client'

import React from 'react'
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

  // Safely get data sections, providing default empty objects
  const financialHealth = getSection('financialHealth') || {}
  const netWorth = getSection('netWorth') || {}
  const trueCost = getSection('trueCost') || {}
  const timeValue = getSection('timeValue') || {}
  const fuelCost = getSection('fuelCost') || {}
  const lifeContext = getSection('lifeContext') || {}
  const aiInsights = getSection('aiInsights') || {}

  // --- Safe Calculations with default fallbacks ---
  const assets = netWorth.assets || []
  const liabilities = netWorth.liabilities || []
  const netWorthValue = assets.reduce((sum: number, a: any) => sum + (a.value || 0), 0) - liabilities.reduce((sum: number, l: any) => sum + (l.value || 0), 0)
  
  const income = financialHealth.income || 0
  const expenses = financialHealth.expenses || 0
  const monthlySavings = income - expenses
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0
  
  const cashAssets = assets.find((a: any) => a.type === 'cash')?.value || 0
  const emergencyFund = expenses > 0 ? cashAssets / expenses : 0

  const trueCostCalculations = trueCost.calculations || []
  const aiInsightsList = aiInsights.insights || []
  const lifeContextGoals = lifeContext.goals || []

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
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(fuelCost.gasPrices?.regular)}</p>
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
                    <p className="font-medium text-gray-900">Time Value Analysis</p>
                    <p className="text-sm text-gray-600">Opportunity costs</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-aegis-500" />
              AI Insights
            </h3>
            {aiInsightsList.length > 0 ? (
              <div className="space-y-3">
                {aiInsightsList.slice(0,3).map((insight: any) => (
                    <div key={insight.id} className={`p-3 bg-${insight.color}-50 border border-${insight.color}-200 rounded-lg`}>
                        <p className={`text-sm font-medium text-${insight.color}-800`}>{insight.title}</p>
                        <p className={`text-xs text-${insight.color}-700`}>{insight.text}</p>
                    </div>
                ))}
              </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No AI insights generated yet.</p>
            )}
          </div>

          {/* Life Context Summary */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Context</h3>
            {lifeContextGoals.length > 0 ? (
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Primary Goal</span>
                    <span className="text-sm font-medium text-gray-900">{lifeContextGoals[0].name}</span>
                  </div>
              </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No life context defined yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
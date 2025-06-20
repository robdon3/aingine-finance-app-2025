'use client'

import React from 'react'
import { useUserData } from './UserDataManager'
import { Calculator, Fuel, Clock } from 'lucide-react'

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Helper to format numbers with signs
const formatSignedCurrency = (value: number) => {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${formatCurrency(Math.abs(value))}`
}

export default function Dashboard() {
  const { getSection, hasData } = useUserData()

  const financialHealth = getSection('financialHealth')
  const netWorth = getSection('netWorth')
  const trueCost = getSection('trueCost')
  const timeValue = getSection('timeValue')
  const fuelCost = getSection('fuelCost')
  const lifeContext = getSection('lifeContext')

  // Example calculations (replace with real logic later)
  const netWorthValue = netWorth.assets.reduce((sum: number, a: any) => sum + a.value, 0) - netWorth.liabilities.reduce((sum: number, l: any) => sum + l.value, 0)
  const monthlySavings = financialHealth.income - financialHealth.expenses
  const savingsRate = financialHealth.income > 0 ? (monthlySavings / financialHealth.income) * 100 : 0
  const emergencyFund = financialHealth.expenses > 0 ? (netWorth.assets.find((a: any) => a.type === 'cash')?.value || 0) / financialHealth.expenses : 0

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
          </div>
        </div>
        
        {/* Fuel Cost Today */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Fuel Cost</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(fuelCost.gasPrices?.regular || 0)}</p>
            </div>
          </div>
        </div>
        
        {/* Monthly Savings */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(monthlySavings)}</p>
            </div>
          </div>
        </div>
        
        {/* Time Value Score */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Value Score</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{timeValue.score || 0}/100</p>
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
                <p className="text-lg lg:text-xl font-bold text-gray-900">{formatCurrency(financialHealth.income)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900">{formatCurrency(financialHealth.expenses)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Savings Rate</p>
                <p className="text-lg lg:text-xl font-bold text-green-600">{savingsRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Fund</p>
                <p className="text-lg lg:text-xl font-bold text-blue-600">{emergencyFund.toFixed(1)} months</p>
              </div>
            </div>
          </div>

          {/* Recent True Cost Analysis */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent True Cost Analysis</h3>
            <div className="space-y-3">
              {hasData('trueCost') && trueCost.calculations.length > 0 ? (
                trueCost.calculations.slice(0, 2).map((calc: any) => (
                  <div key={calc.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{calc.name}</p>
                      <p className="text-sm text-gray-600">Sticker: {formatCurrency(calc.stickerPrice)}</p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className="font-bold text-red-600">True Cost: {formatCurrency(calc.trueCost)}</p>
                      <p className="text-xs text-gray-500">
                        +{(((calc.trueCost - calc.stickerPrice) / calc.stickerPrice) * 100).toFixed(1)}% hidden costs
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No True Cost analyses performed yet.</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
            {hasData('aiInsights') && lifeContext.insights.length > 0 ? (
              <div className="space-y-3">
                {lifeContext.insights.slice(0,3).map((insight: any) => (
                    <div key={insight.id} className={`p-3 bg-${insight.color}-50 border border-${insight.color}-200 rounded-lg`}>
                        <p className={`text-sm font-medium text-${insight.color}-800`}>{insight.title}</p>
                        <p className={`text-xs text-${insight.color}-700`}>{insight.text}</p>
                    </div>
                ))}
              </div>
            ) : (
                <p className="text-gray-500">No AI insights generated yet.</p>
            )}
          </div>

          {/* Life Context Summary */}
          <div className="bg-white rounded-lg shadow p-4 lg:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Context</h3>
            {hasData('lifeContext') && lifeContext.goals?.length > 0 ? (
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Primary Goal</span>
                    <span className="text-sm font-medium text-gray-900">{lifeContext.goals[0].name}</span>
                  </div>
              </div>
            ) : (
                <p className="text-gray-500">No life context defined yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Target } from 'lucide-react'

// Helper function to check if user chose blank data
const shouldShowBlankData = () => {
  try {
    const item = localStorage.getItem('aegis_started_with_blank_data')
    return item ? JSON.parse(item) : false
  } catch {
    return false
  }
}

interface FinancialData {
  date: string
  balance: number
  income: number
  expenses: number
  investments: number
  savings: number
}

interface Category {
  name: string
  amount: number
  percentage: number
  color: string
}

export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [currentBalance, setCurrentBalance] = useState('')
  const [currentIncome, setCurrentIncome] = useState('')
  const [currentExpenses, setCurrentExpenses] = useState('')
  const [currentInvestments, setCurrentInvestments] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')

  // Sample data for demonstration
  useEffect(() => {
    // Only load sample data if user didn't choose blank data
    if (shouldShowBlankData()) {
      setFinancialData([])
      return
    }

    const sampleData: FinancialData[] = [
      { date: '2024-01', balance: 50000, income: 8000, expenses: 4000, investments: 2000, savings: 2000 },
      { date: '2024-02', balance: 52000, income: 8000, expenses: 3800, investments: 2200, savings: 2000 },
      { date: '2024-03', balance: 54500, income: 8000, expenses: 4200, investments: 2000, savings: 1800 },
      { date: '2024-04', balance: 56800, income: 8000, expenses: 3900, investments: 2300, savings: 1800 },
      { date: '2024-05', balance: 59200, income: 8000, expenses: 4100, investments: 2100, savings: 1800 },
    ]
    setFinancialData(sampleData)
  }, [])

  const addFinancialEntry = () => {
    if (!currentBalance || !currentIncome || !currentExpenses) return

    const newEntry: FinancialData = {
      date: new Date().toISOString().slice(0, 7),
      balance: parseFloat(currentBalance),
      income: parseFloat(currentIncome),
      expenses: parseFloat(currentExpenses),
      investments: parseFloat(currentInvestments) || 0,
      savings: parseFloat(currentSavings) || 0,
    }

    setFinancialData([...financialData, newEntry])
    
    // Clear form
    setCurrentBalance('')
    setCurrentIncome('')
    setCurrentExpenses('')
    setCurrentInvestments('')
    setCurrentSavings('')
  }

  const getLatestData = () => {
    return financialData[financialData.length - 1] || null
  }

  const calculateGrowth = () => {
    if (financialData.length < 2) return 0
    const latest = financialData[financialData.length - 1]
    const previous = financialData[financialData.length - 2]
    return ((latest.balance - previous.balance) / previous.balance) * 100
  }

  const getExpenseCategories = (): Category[] => {
    const latest = getLatestData()
    if (!latest) return []

    const total = latest.expenses
    return [
      { name: 'Housing', amount: total * 0.35, percentage: 35, color: '#3B82F6' },
      { name: 'Transportation', amount: total * 0.15, percentage: 15, color: '#10B981' },
      { name: 'Food', amount: total * 0.12, percentage: 12, color: '#F59E0B' },
      { name: 'Utilities', amount: total * 0.08, percentage: 8, color: '#EF4444' },
      { name: 'Entertainment', amount: total * 0.10, percentage: 10, color: '#8B5CF6' },
      { name: 'Other', amount: total * 0.20, percentage: 20, color: '#6B7280' },
    ]
  }

  const latestData = getLatestData()
  const growth = calculateGrowth()
  const expenseCategories = getExpenseCategories()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Dashboard</h2>
        <p className="text-gray-600">
          Track your financial health and identify opportunities for optimization.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${latestData?.balance.toLocaleString() || '0'}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-aegis-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {growth.toFixed(1)}% from last month
            </span>
          </div>
        </div>

        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${latestData?.income.toLocaleString() || '0'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${latestData?.expenses.toLocaleString() || '0'}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-liberty-600">
                {latestData ? ((latestData.savings / latestData.income) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <Target className="h-8 w-8 text-liberty-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Entry */}
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-aegis-600" />
            <span>Add Financial Entry</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Balance
                </label>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Income
                </label>
                <input
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expenses
                </label>
                <input
                  type="number"
                  value={currentExpenses}
                  onChange={(e) => setCurrentExpenses(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investments
                </label>
                <input
                  type="number"
                  value={currentInvestments}
                  onChange={(e) => setCurrentInvestments(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Savings
                </label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addFinancialEntry}
              className="aegis-button w-full"
            >
              Add Entry
            </button>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-liberty-600" />
            <span>Expense Breakdown</span>
          </h3>
          
          <div className="space-y-3">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    ${category.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Financial Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-semibold mb-1">Emergency Fund</div>
            <div className="text-gray-600">
              {latestData ? Math.round(latestData.balance / latestData.expenses) : 0} months of expenses
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold mb-1">Investment Rate</div>
            <div className="text-gray-600">
              {latestData ? ((latestData.investments / latestData.income) * 100).toFixed(1) : '0'}% of income
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-semibold mb-1">Debt-to-Income</div>
            <div className="text-gray-600">
              {latestData ? ((latestData.expenses / latestData.income) * 100).toFixed(1) : '0'}% ratio
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
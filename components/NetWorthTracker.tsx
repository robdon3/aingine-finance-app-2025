'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Home, GraduationCap, Baby, Target, BarChart3, PieChart, LineChart } from 'lucide-react'

// Helper function to check if user chose blank data
const shouldShowBlankData = () => {
  try {
    const item = localStorage.getItem('aingen_started_with_blank_data')
    return item ? JSON.parse(item) : false
  } catch {
    return false
  }
}

interface NetWorthEntry {
  date: string
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  breakdown: {
    cash: number
    investments: number
    realEstate: number
    vehicles: number
    otherAssets: number
    mortgage: number
    carLoans: number
    studentLoans: number
    creditCards: number
    otherDebt: number
  }
}

interface LifeMilestone {
  id: string
  type: 'education' | 'family' | 'career' | 'property' | 'investment'
  title: string
  date: string
  impact: number
  description: string
  achieved: boolean
}

interface Investment {
  name: string
  type: 'stock' | 'bond' | 'crypto' | 'real-estate' | 'other'
  value: number
  allocation: number
  performance: number
  lastUpdated: string
}

export default function NetWorthTracker() {
  const [netWorthData, setNetWorthData] = useState<NetWorthEntry[]>([])
  const [lifeMilestones, setLifeMilestones] = useState<LifeMilestone[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])

  // Sample data
  useEffect(() => {
    // Only load sample data if user didn't choose blank data
    if (shouldShowBlankData()) {
      setNetWorthData([])
      setLifeMilestones([])
      setInvestments([])
      return
    }

    const sampleNetWorth: NetWorthEntry[] = [
      {
        date: '2024-01',
        totalAssets: 150000,
        totalLiabilities: 80000,
        netWorth: 70000,
        breakdown: {
          cash: 15000,
          investments: 35000,
          realEstate: 80000,
          vehicles: 15000,
          otherAssets: 5000,
          mortgage: 70000,
          carLoans: 5000,
          studentLoans: 3000,
          creditCards: 1000,
          otherDebt: 1000
        }
      },
      {
        date: '2024-02',
        totalAssets: 155000,
        totalLiabilities: 78000,
        netWorth: 77000,
        breakdown: {
          cash: 16000,
          investments: 37000,
          realEstate: 82000,
          vehicles: 15000,
          otherAssets: 5000,
          mortgage: 69000,
          carLoans: 4800,
          studentLoans: 3000,
          creditCards: 800,
          otherDebt: 400
        }
      },
      {
        date: '2024-03',
        totalAssets: 162000,
        totalLiabilities: 76000,
        netWorth: 86000,
        breakdown: {
          cash: 18000,
          investments: 40000,
          realEstate: 84000,
          vehicles: 15000,
          otherAssets: 5000,
          mortgage: 68000,
          carLoans: 4600,
          studentLoans: 3000,
          creditCards: 600,
          otherDebt: 400
        }
      }
    ]

    const sampleMilestones: LifeMilestone[] = [
      {
        id: '1',
        type: 'education',
        title: 'Graduate College',
        date: '2024-06',
        impact: 50000,
        description: 'Complete bachelor\'s degree',
        achieved: false
      },
      {
        id: '2',
        type: 'family',
        title: 'First Child',
        date: '2025-03',
        impact: -25000,
        description: 'Welcome first child to family',
        achieved: false
      },
      {
        id: '3',
        type: 'property',
        title: 'Buy First Home',
        date: '2024-12',
        impact: 100000,
        description: 'Purchase 3-bedroom house',
        achieved: false
      }
    ]

    const sampleInvestments: Investment[] = [
      {
        name: 'S&P 500 ETF',
        type: 'stock',
        value: 25000,
        allocation: 0.4,
        performance: 12.5,
        lastUpdated: '2024-03-15'
      },
      {
        name: 'Bitcoin',
        type: 'crypto',
        value: 8000,
        allocation: 0.15,
        performance: 45.2,
        lastUpdated: '2024-03-15'
      },
      {
        name: 'Municipal Bonds',
        type: 'bond',
        value: 15000,
        allocation: 0.25,
        performance: 3.2,
        lastUpdated: '2024-03-15'
      },
      {
        name: 'Real Estate Fund',
        type: 'real-estate',
        value: 12000,
        allocation: 0.2,
        performance: 8.7,
        lastUpdated: '2024-03-15'
      }
    ]

    setNetWorthData(sampleNetWorth)
    setLifeMilestones(sampleMilestones)
    setInvestments(sampleInvestments)
  }, [])

  const getLatestNetWorth = () => {
    return netWorthData[netWorthData.length - 1] || null
  }

  const calculateGrowth = () => {
    if (netWorthData.length < 2) return 0
    const latest = netWorthData[netWorthData.length - 1]
    const previous = netWorthData[netWorthData.length - 2]
    return ((latest.netWorth - previous.netWorth) / previous.netWorth) * 100
  }

  const getAssetBreakdown = () => {
    const latest = getLatestNetWorth()
    if (!latest) return []

    return [
      { name: 'Cash', value: latest.breakdown.cash, color: '#10B981' },
      { name: 'Investments', value: latest.breakdown.investments, color: '#3B82F6' },
      { name: 'Real Estate', value: latest.breakdown.realEstate, color: '#F59E0B' },
      { name: 'Vehicles', value: latest.breakdown.vehicles, color: '#8B5CF6' },
      { name: 'Other Assets', value: latest.breakdown.otherAssets, color: '#6B7280' }
    ]
  }

  const getLiabilityBreakdown = () => {
    const latest = getLatestNetWorth()
    if (!latest) return []

    return [
      { name: 'Mortgage', value: latest.breakdown.mortgage, color: '#EF4444' },
      { name: 'Car Loans', value: latest.breakdown.carLoans, color: '#F97316' },
      { name: 'Student Loans', value: latest.breakdown.studentLoans, color: '#EC4899' },
      { name: 'Credit Cards', value: latest.breakdown.creditCards, color: '#DC2626' },
      { name: 'Other Debt', value: latest.breakdown.otherDebt, color: '#991B1B' }
    ]
  }

  const latestNetWorth = getLatestNetWorth()
  const growth = calculateGrowth()
  const assetBreakdown = getAssetBreakdown()
  const liabilityBreakdown = getLiabilityBreakdown()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Net Worth Tracker</h2>
        <p className="text-gray-600">
          Track your wealth building journey with comprehensive asset and liability monitoring.
        </p>
      </div>

      {/* Net Worth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Net Worth</p>
              <p className="text-3xl font-bold text-gray-900">
                ${latestNetWorth?.netWorth.toLocaleString() || '0'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-aegis-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
            )}
            <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {growth.toFixed(1)}% from last month
            </span>
          </div>
        </div>

        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-green-600">
                ${latestNetWorth?.totalAssets.toLocaleString() || '0'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="aegis-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600">
                ${latestNetWorth?.totalLiabilities.toLocaleString() || '0'}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Asset vs Liability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-green-600" />
            <span>Asset Breakdown</span>
          </h3>
          
          <div className="space-y-3">
            {assetBreakdown.map((asset, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {asset.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    ${asset.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((asset.value / (latestNetWorth?.totalAssets || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-red-600" />
            <span>Liability Breakdown</span>
          </h3>
          
          <div className="space-y-3">
            {liabilityBreakdown.map((liability, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: liability.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {liability.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    ${liability.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {((liability.value / (latestNetWorth?.totalLiabilities || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Portfolio */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <LineChart className="h-5 w-5 text-aegis-600" />
          <span>Investment Portfolio</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Investment</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Allocation</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Performance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{investment.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{investment.type.replace('-', ' ')}</div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-900">
                    ${investment.value.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {(investment.allocation * 100).toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-medium ${
                      investment.performance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.performance >= 0 ? '+' : ''}{investment.performance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-gray-500">
                    {new Date(investment.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Life Milestones */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-liberty-600" />
          <span>Life Milestones</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeMilestones.map((milestone) => {
            const Icon = {
              education: GraduationCap,
              family: Baby,
              career: TrendingUp,
              property: Home,
              investment: BarChart3
            }[milestone.type]

            return (
              <div key={milestone.id} className={`p-4 rounded-lg border-2 ${
                milestone.achieved 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 ${
                    milestone.achieved ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{milestone.date}</span>
                      <span className={`font-medium ${
                        milestone.impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {milestone.impact >= 0 ? '+' : ''}${milestone.impact.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        milestone.achieved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.achieved ? 'Achieved' : 'Planned'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Net Worth Insights */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Net Worth Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold mb-1">Debt-to-Asset Ratio</div>
            <div className="text-gray-600">
              {latestNetWorth ? ((latestNetWorth.totalLiabilities / latestNetWorth.totalAssets) * 100).toFixed(1) : '0'}%
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-semibold mb-1">Investment Allocation</div>
            <div className="text-gray-600">
              {latestNetWorth ? ((latestNetWorth.breakdown.investments / latestNetWorth.totalAssets) * 100).toFixed(1) : '0'}% of assets
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-semibold mb-1">Monthly Growth</div>
            <div className="text-gray-600">
              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% this month
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
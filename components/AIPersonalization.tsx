'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Lightbulb, TrendingUp, Target, Zap, Shield } from 'lucide-react'

interface Insight {
  id: string
  type: 'opportunity' | 'warning' | 'optimization' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: string
  actionable: boolean
  action?: string
}

interface UserPattern {
  category: string
  frequency: number
  averageAmount: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export default function AIPersonalization() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [userPatterns, setUserPatterns] = useState<UserPattern[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [privacyLevel, setPrivacyLevel] = useState('high')

  // Simulate AI analysis
  const generateInsights = () => {
    setIsAnalyzing(true)
    
    // Simulate processing time
    setTimeout(() => {
      const newInsights: Insight[] = [
        {
          id: '1',
          type: 'opportunity',
          title: 'Investment Opportunity Detected',
          description: 'Your savings rate is above average. Consider increasing your investment allocation by 5% to accelerate wealth building.',
          impact: 'high',
          category: 'investment',
          actionable: true,
          action: 'Increase monthly investment by $200'
        },
        {
          id: '2',
          type: 'optimization',
          title: 'Expense Optimization',
          description: 'Your entertainment spending has increased 15% this month. This category shows the highest variance in your budget.',
          impact: 'medium',
          category: 'expenses',
          actionable: true,
          action: 'Review entertainment subscriptions'
        },
        {
          id: '3',
          type: 'trend',
          title: 'Positive Savings Trend',
          description: 'Your emergency fund has grown consistently for 3 months. You\'re on track to reach 6 months of expenses by Q3.',
          impact: 'medium',
          category: 'savings',
          actionable: false
        },
        {
          id: '4',
          type: 'warning',
          title: 'Debt-to-Income Ratio Alert',
          description: 'Your debt-to-income ratio is approaching 40%. Consider reducing discretionary spending to maintain financial flexibility.',
          impact: 'high',
          category: 'debt',
          actionable: true,
          action: 'Reduce monthly expenses by $300'
        }
      ]

      const patterns: UserPattern[] = [
        { category: 'Housing', frequency: 1, averageAmount: 2000, trend: 'stable' },
        { category: 'Entertainment', frequency: 8, averageAmount: 150, trend: 'increasing' },
        { category: 'Food', frequency: 45, averageAmount: 25, trend: 'stable' },
        { category: 'Transportation', frequency: 12, averageAmount: 80, trend: 'decreasing' }
      ]

      setInsights(newInsights)
      setUserPatterns(patterns)
      setIsAnalyzing(false)
    }, 2000)
  }

  useEffect(() => {
    generateInsights()
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'warning': return <Target className="h-5 w-5 text-red-600" />
      case 'optimization': return <Zap className="h-5 w-5 text-blue-600" />
      case 'trend': return <Lightbulb className="h-5 w-5 text-purple-600" />
      default: return <Brain className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Insights</h2>
        <p className="text-gray-600">
          Privacy-first AI analysis of your financial patterns and opportunities.
        </p>
      </div>

      {/* Privacy Status */}
      <div className="aegis-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-aegis-600" />
            <div>
              <h3 className="text-lg font-semibold">Privacy Status</h3>
              <p className="text-sm text-gray-600">All analysis performed locally on your device</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">Secure</div>
            <div className="text-xs text-gray-500">No data transmitted</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Personalized Insights</span>
          </h3>
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="aegis-button text-sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {isAnalyzing ? (
          <div className="aegis-card text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your financial patterns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className="aegis-card">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    {insight.actionable && insight.action && (
                      <div className="bg-aegis-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-aegis-700 mb-1">Recommended Action:</div>
                        <div className="text-sm text-aegis-600">{insight.action}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spending Patterns */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Spending Patterns Analysis</h3>
        
        <div className="space-y-4">
          {userPatterns.map((pattern, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-aegis-600"></div>
                <div>
                  <div className="font-medium text-gray-900">{pattern.category}</div>
                  <div className="text-sm text-gray-600">
                    {pattern.frequency} transactions/month • ${pattern.averageAmount} average
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  pattern.trend === 'increasing' ? 'text-red-600' :
                  pattern.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {pattern.trend.charAt(0).toUpperCase() + pattern.trend.slice(1)}
                </div>
                <div className="text-xs text-gray-500">trend</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">AI Capabilities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-purple-600 font-semibold mb-1">Pattern Recognition</div>
            <div className="text-gray-600">Identifies spending and saving patterns</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-blue-600 font-semibold mb-1">Opportunity Detection</div>
            <div className="text-gray-600">Finds optimization opportunities</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-green-600 font-semibold mb-1">Privacy First</div>
            <div className="text-gray-600">All processing done locally</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
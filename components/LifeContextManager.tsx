'use client'

import React, { useState, useEffect } from 'react'
import { User, GraduationCap, Baby, Briefcase, Target, Calendar, TrendingUp, BookOpen } from 'lucide-react'

// Helper function to check if user chose blank data
const shouldShowBlankData = () => {
  try {
    const item = localStorage.getItem('aegis_started_with_blank_data')
    return item ? JSON.parse(item) : false
  } catch {
    return false
  }
}

interface LifeStage {
  id: string
  name: string
  ageRange: string
  description: string
  keyMilestones: string[]
  financialPriorities: string[]
  isActive: boolean
}

interface LifeGoal {
  id: string
  category: 'education' | 'family' | 'career' | 'financial' | 'personal'
  title: string
  description: string
  targetDate: string
  estimatedCost: number
  priority: 'high' | 'medium' | 'low'
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
}

interface EducationPath {
  level: string
  institution: string
  field: string
  startDate: string
  endDate: string
  cost: number
  status: 'completed' | 'in-progress' | 'planned'
  impact: string
}

interface FamilyContext {
  maritalStatus: string
  children: number
  planningChildren: boolean
  dependents: number
  familyGoals: string[]
}

export default function LifeContextManager() {
  const [lifeStages, setLifeStages] = useState<LifeStage[]>([])
  const [lifeGoals, setLifeGoals] = useState<LifeGoal[]>([])
  const [educationPath, setEducationPath] = useState<EducationPath[]>([])
  const [familyContext] = useState<FamilyContext>({
    maritalStatus: 'single',
    children: 0,
    planningChildren: false,
    dependents: 0,
    familyGoals: []
  })
  const [currentAge] = useState(30)

  useEffect(() => {
    // Only load sample data if user didn't choose blank data
    if (shouldShowBlankData()) {
      setLifeStages([])
      setLifeGoals([])
      setEducationPath([])
      return
    }

    const stages: LifeStage[] = [
      {
        id: '1',
        name: 'Early Career',
        ageRange: '22-30',
        description: 'Building foundation, paying off student loans, starting to save',
        keyMilestones: ['Graduate college', 'First job', 'Start emergency fund'],
        financialPriorities: ['Pay off student loans', 'Build emergency fund', 'Start retirement savings'],
        isActive: currentAge >= 22 && currentAge <= 30
      },
      {
        id: '2',
        name: 'Career Growth',
        ageRange: '30-40',
        description: 'Career advancement, family planning, major purchases',
        keyMilestones: ['Buy first home', 'Start family', 'Career promotion'],
        financialPriorities: ['Save for down payment', 'Increase retirement contributions', 'Life insurance'],
        isActive: currentAge >= 30 && currentAge <= 40
      },
      {
        id: '3',
        name: 'Peak Earning',
        ageRange: '40-55',
        description: 'Peak earning years, college planning, wealth building',
        keyMilestones: ['Kids college', 'Maximize retirement', 'Investment portfolio'],
        financialPriorities: ['College savings', 'Maximize retirement', 'Diversify investments'],
        isActive: currentAge >= 40 && currentAge <= 55
      },
      {
        id: '4',
        name: 'Pre-Retirement',
        ageRange: '55-65',
        description: 'Final wealth building, debt elimination, retirement planning',
        keyMilestones: ['Pay off mortgage', 'Retirement planning', 'Estate planning'],
        financialPriorities: ['Eliminate debt', 'Maximize retirement', 'Estate planning'],
        isActive: currentAge >= 55 && currentAge <= 65
      }
    ]

    const goals: LifeGoal[] = [
      {
        id: '1',
        category: 'education',
        title: 'Complete MBA',
        description: 'Earn Master of Business Administration degree',
        targetDate: '2025-06',
        estimatedCost: 75000,
        priority: 'high',
        progress: 25,
        status: 'in-progress'
      },
      {
        id: '2',
        category: 'family',
        title: 'Start Family',
        description: 'Welcome first child to our family',
        targetDate: '2025-03',
        estimatedCost: 25000,
        priority: 'high',
        progress: 0,
        status: 'not-started'
      },
      {
        id: '3',
        category: 'financial',
        title: 'Buy First Home',
        description: 'Purchase 3-bedroom house in desired neighborhood',
        targetDate: '2024-12',
        estimatedCost: 450000,
        priority: 'high',
        progress: 60,
        status: 'in-progress'
      },
      {
        id: '4',
        category: 'career',
        title: 'Senior Management Role',
        description: 'Advance to senior management position',
        targetDate: '2026-01',
        estimatedCost: 0,
        priority: 'medium',
        progress: 40,
        status: 'in-progress'
      }
    ]

    const education: EducationPath[] = [
      {
        level: 'Bachelor\'s',
        institution: 'State University',
        field: 'Computer Science',
        startDate: '2018-09',
        endDate: '2022-05',
        cost: 80000,
        status: 'completed',
        impact: 'Entry-level software developer position'
      },
      {
        level: 'Master\'s',
        institution: 'Business School',
        field: 'Business Administration',
        startDate: '2024-01',
        endDate: '2025-06',
        cost: 75000,
        status: 'in-progress',
        impact: 'Career advancement opportunities'
      }
    ]

    setLifeStages(stages)
    setLifeGoals(goals)
    setEducationPath(education)
  }, [currentAge])

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'education': return <GraduationCap className="h-5 w-5" />
      case 'family': return <Baby className="h-5 w-5" />
      case 'career': return <Briefcase className="h-5 w-5" />
      case 'financial': return <TrendingUp className="h-5 w-5" />
      case 'personal': return <User className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-700 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'not-started': return 'text-gray-700 bg-gray-50'
      default: return 'text-gray-700 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Life Context Manager</h2>
        <p className="text-gray-600">
          Manage your life journey, goals, and milestones in one comprehensive view.
        </p>
      </div>

      {/* Life Stage Overview */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-aegis-600" />
          <span>Your Life Stage</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifeStages.map((stage) => (
            <div key={stage.id} className={`p-4 rounded-lg border-2 ${
              stage.isActive 
                ? 'border-aegis-200 bg-aegis-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                {stage.isActive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-aegis-100 text-aegis-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{stage.description}</p>
              <div className="text-xs text-gray-600 dark:text-gray-400">{stage.ageRange}</div>
              
              {stage.isActive && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Key Priorities:</div>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    {stage.financialPriorities.slice(0, 2).map((priority, index) => (
                      <li key={index}>• {priority}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Life Goals */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-liberty-600" />
          <span>Life Goals</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lifeGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {getGoalIcon(goal.category)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Target Date:</span>
                      <span className="font-medium">{goal.targetDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Estimated Cost:</span>
                      <span className="font-medium">${goal.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">Progress:</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-aegis-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Path */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <span>Education Journey</span>
        </h3>
        
        <div className="space-y-4">
          {educationPath.map((edu, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                edu.status === 'completed' ? 'bg-green-100' :
                edu.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <GraduationCap className={`h-6 w-6 ${
                  edu.status === 'completed' ? 'text-green-600' :
                  edu.status === 'in-progress' ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{edu.level} - {edu.field}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(edu.status)}`}>
                    {edu.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{edu.institution}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Duration:</span>
                    <span className="ml-2 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Cost:</span>
                    <span className="ml-2 font-medium">${edu.cost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Impact:</span>
                  <span className="ml-2 text-gray-900">{edu.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Context */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Baby className="h-5 w-5 text-pink-600" />
          <span>Family Context</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Family Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Marital Status:</span>
                <span className="font-medium capitalize">{familyContext.maritalStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Children:</span>
                <span className="font-medium">{familyContext.children}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Planning Children:</span>
                <span className="font-medium">{familyContext.planningChildren ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Dependents:</span>
                <span className="font-medium">{familyContext.dependents}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Family Goals</h4>
            <div className="space-y-2">
              {familyContext.familyGoals.length > 0 ? (
                familyContext.familyGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No family goals set yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Life Context Insights */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Life Context Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-blue-600 font-semibold mb-1">Education Impact</div>
            <div className="text-gray-700 dark:text-gray-300">
              {educationPath.filter(e => e.status === 'completed').length} degrees completed
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-green-600 font-semibold mb-1">Goal Progress</div>
            <div className="text-gray-700 dark:text-gray-300">
              {lifeGoals.filter(g => g.status === 'completed').length} of {lifeGoals.length} goals achieved
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-purple-600 font-semibold mb-1">Life Stage</div>
            <div className="text-gray-700 dark:text-gray-300">
              {lifeStages.find(s => s.isActive)?.name || 'Transitioning'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
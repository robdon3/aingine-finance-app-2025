'use client'

import React, { useState } from 'react'
import { Calculator, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'

interface TimeValueCalculation {
  item: string
  cost: number
  hourlyWage: number
  timeCost: number
  futureValue: number
  years: number
  interestRate: number
}

export default function TimeValueCalculator() {
  const [calculations, setCalculations] = useState<TimeValueCalculation[]>([])
  const [newItem, setNewItem] = useState('')
  const [newCost, setNewCost] = useState('')
  const [hourlyWage, setHourlyWage] = useState('25')
  const [years, setYears] = useState('10')
  const [interestRate, setInterestRate] = useState('7')

  const calculateTimeValue = () => {
    if (!newItem || !newCost || !hourlyWage) return

    const cost = parseFloat(newCost)
    const wage = parseFloat(hourlyWage)
    const timeCost = cost / wage
    const rate = parseFloat(interestRate) / 100
    const yearCount = parseFloat(years)
    
    // Future value calculation: FV = PV * (1 + r)^n
    const futureValue = cost * Math.pow(1 + rate, yearCount)

    const calculation: TimeValueCalculation = {
      item: newItem,
      cost,
      hourlyWage: wage,
      timeCost,
      futureValue,
      years: yearCount,
      interestRate: rate * 100
    }

    setCalculations([...calculations, calculation])
    setNewItem('')
    setNewCost('')
  }

  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 8)
    const remainingHours = hours % 8
    if (days > 0) {
      return `${days}d ${remainingHours.toFixed(1)}h`
    }
    return `${hours.toFixed(1)}h`
  }

  const getTimeValueClass = (timeCost: number) => {
    if (timeCost > 40) return 'time-value-negative'
    if (timeCost > 8) return 'time-value-neutral'
    return 'time-value-positive'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Time Value Calculator</h2>
        <p className="text-gray-600">
          Understand the true cost of your purchases in terms of time worked and future value lost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-aegis-600" />
            <span>Calculate Time Value</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item or Purchase
              </label>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="e.g., New iPhone, Car, Vacation"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Hourly Wage ($)
              </label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years to Calculate
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateTimeValue}
              className="aegis-button w-full"
            >
              Calculate Time Value
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-liberty-600" />
            <span>Your Calculations</span>
          </h3>

          {calculations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No calculations yet. Add an item to see its time value.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {calculations.map((calc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{calc.item}</h4>
                    <span className="text-sm text-gray-500">${calc.cost.toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Time Cost:</span>
                      <div className={`time-value-indicator ${getTimeValueClass(calc.timeCost)}`}>
                        {formatTime(calc.timeCost)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Future Value:</span>
                      <div className="font-semibold text-liberty-600">
                        ${calc.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Based on ${calc.hourlyWage}/hr wage, {calc.years} years, {calc.interestRate}% interest
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>Key Insights</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-semibold mb-1">Time is Money</div>
            <div className="text-gray-600">Every purchase costs you time worked</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold mb-1">Compound Interest</div>
            <div className="text-gray-600">Money saved today grows exponentially</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-semibold mb-1">Opportunity Cost</div>
            <div className="text-gray-600">Every dollar spent is a dollar not invested</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
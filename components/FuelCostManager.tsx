'use client'

import React, { useState, useEffect } from 'react'
import { Fuel, MapPin, Calculator, TrendingUp, TrendingDown, RefreshCw, ExternalLink, Car, Route } from 'lucide-react'
import GasPriceService, { type GasPriceData, type StateGasPrice } from './GasPriceService'
import { getLocationByCode } from '../data/locations'

interface TripCalculation {
  id: string
  origin: string
  destination: string
  distance: number
  fuelEfficiency: number
  fuelType: 'regular' | 'midgrade' | 'premium' | 'diesel'
  fuelCost: number
  gasPrice: number
  calculationDate: string
}

export default function FuelCostManager() {
  const [nationalData, setNationalData] = useState<GasPriceData | null>(null)
  const [stateData, setStateData] = useState<StateGasPrice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'prices' | 'trip-calculator'>('prices')
  const [tripCalculations, setTripCalculations] = useState<TripCalculation[]>([])
  
  // Trip calculator form state
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [distance, setDistance] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState('')
  const [fuelType, setFuelType] = useState<'regular' | 'midgrade' | 'premium' | 'diesel'>('regular')
  
  const gasPriceService = GasPriceService.getInstance()

  useEffect(() => {
    loadGasPrices()
  }, [])

  const loadGasPrices = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
      // Clear cache to force fresh data
      gasPriceService.clearCache()
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      console.log('Loading gas prices...')
      
      // Get national average
      const national = await gasPriceService.getNationalAverage()
      console.log('National data loaded:', national)
      setNationalData(national)
      
      // Get state-specific data
      const selectedLocationCode = localStorage.getItem('aegis_selected_location') || 'CA'
      const state = await gasPriceService.getStatePrices(selectedLocationCode)
      console.log('State data loaded:', state)
      setStateData(state)
      
      console.log('Gas prices loaded successfully')
    } catch (err) {
      console.error('Error loading gas prices:', err)
      setError('Unable to load gas price data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const calculateTripCost = () => {
    console.log('Calculating trip cost...')
    console.log('Form data:', { origin, destination, distance, fuelEfficiency, fuelType, nationalData })
    
    if (!origin || !destination || !distance || !fuelEfficiency) {
      console.log('Missing required fields')
      setError('Please fill in all required fields')
      return
    }

    if (!nationalData) {
      console.log('No national data available')
      setError('Gas price data not available. Please refresh.')
      return
    }

    const distanceMiles = parseFloat(distance)
    const efficiency = parseFloat(fuelEfficiency)
    
    if (distanceMiles <= 0 || efficiency <= 0) {
      console.log('Invalid distance or efficiency')
      setError('Distance and fuel efficiency must be greater than 0')
      return
    }

    // Get gas price based on fuel type
    const gasPrice = nationalData[fuelType]
    console.log('Gas price for', fuelType, ':', gasPrice)
    
    // Calculate fuel cost
    const gallonsNeeded = distanceMiles / efficiency
    const fuelCost = gallonsNeeded * gasPrice
    
    console.log('Calculation:', {
      distanceMiles,
      efficiency,
      gallonsNeeded,
      gasPrice,
      fuelCost
    })

    const calculation: TripCalculation = {
      id: Date.now().toString(),
      origin,
      destination,
      distance: distanceMiles,
      fuelEfficiency: efficiency,
      fuelType,
      fuelCost,
      gasPrice,
      calculationDate: new Date().toISOString()
    }

    console.log('New calculation:', calculation)
    setTripCalculations(prev => [calculation, ...prev]) // Add to beginning
    setError(null) // Clear any previous errors
    
    // Clear form
    setOrigin('')
    setDestination('')
    setDistance('')
    setFuelEfficiency('')
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-red-500" />
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-green-500" />
    }
    return null
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(3)}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="aegis-card">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 text-aegis-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading fuel cost data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !nationalData) {
    return (
      <div className="p-4 lg:p-6">
        <div className="aegis-card">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">{error}</div>
            <button 
              onClick={() => loadGasPrices(true)}
              className="aegis-button-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fuel Cost Manager</h2>
        <p className="text-gray-600">
          Track gas prices and calculate fuel costs for your trips and daily driving.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="aegis-card bg-red-50 border border-red-200">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('prices')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'prices'
              ? 'bg-white text-aegis-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Fuel className="h-4 w-4" />
          <span>Gas Prices</span>
        </button>
        <button
          onClick={() => setActiveTab('trip-calculator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'trip-calculator'
              ? 'bg-white text-aegis-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Route className="h-4 w-4" />
          <span>Trip Calculator</span>
        </button>
      </div>

      {/* Gas Prices Tab */}
      {activeTab === 'prices' && nationalData && (
        <div className="space-y-6">
          {/* National Average */}
          <div className="aegis-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Fuel className="h-5 w-5 text-aegis-600" />
                <h3 className="text-lg font-semibold text-gray-900">AAA National Gas Prices</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loadGasPrices(true)}
                  disabled={isRefreshing}
                  className={`text-aegis-600 hover:text-aegis-700 ${isRefreshing ? 'opacity-50' : ''}`}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <a
                  href="https://gasprices.aaa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aegis-600 hover:text-aegis-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Regular</div>
                <div className="text-xl font-bold text-gray-900">{formatPrice(nationalData.regular)}</div>
                <div className="text-xs text-gray-500">per gallon</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Mid-Grade</div>
                <div className="text-xl font-bold text-gray-900">{formatPrice(nationalData.midgrade)}</div>
                <div className="text-xs text-gray-500">per gallon</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Premium</div>
                <div className="text-xl font-bold text-gray-900">{formatPrice(nationalData.premium)}</div>
                <div className="text-xs text-gray-500">per gallon</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Diesel</div>
                <div className="text-xl font-bold text-gray-900">{formatPrice(nationalData.diesel)}</div>
                <div className="text-xs text-gray-500">per gallon</div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Last updated: {new Date(nationalData.lastUpdated).toLocaleString()}
            </div>
          </div>

          {/* Historical Data */}
          {nationalData.historical && (
            <div className="aegis-card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Historical Trends</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Yesterday', value: nationalData.historical.yesterday },
                  { label: 'Week Ago', value: nationalData.historical.weekAgo },
                  { label: 'Month Ago', value: nationalData.historical.monthAgo },
                  { label: 'Year Ago', value: nationalData.historical.yearAgo }
                ].map((period) => {
                  const change = nationalData.regular - period.value
                  return (
                    <div key={period.label} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">{period.label}</div>
                      <div className="text-lg font-semibold text-gray-900">{formatPrice(period.value)}</div>
                      <div className="flex items-center justify-center space-x-1 text-xs">
                        {getTrendIcon(nationalData.regular, period.value)}
                        <span className={change > 0 ? 'text-red-600' : 'text-green-600'}>
                          {change > 0 ? '+' : ''}{change.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* State Comparison */}
          {stateData && (
            <div className="aegis-card">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-4 w-4 text-aegis-600" />
                <h4 className="text-md font-semibold text-gray-900">
                  {stateData.state} vs National Average
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Local Regular</div>
                  <div className="text-lg font-semibold text-gray-900">{formatPrice(stateData.regular)}</div>
                  <div className="text-xs text-gray-500">
                    {stateData.regular > nationalData.regular ? '+' : ''}
                    {(stateData.regular - nationalData.regular).toFixed(3)} vs national
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Local Premium</div>
                  <div className="text-lg font-semibold text-gray-900">{formatPrice(stateData.premium)}</div>
                  <div className="text-xs text-gray-500">
                    {stateData.premium > nationalData.premium ? '+' : ''}
                    {(stateData.premium - nationalData.premium).toFixed(3)} vs national
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trip Calculator Tab */}
      {activeTab === 'trip-calculator' && (
        <div className="space-y-6">
          <div className="aegis-card">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-aegis-600" />
              <h3 className="text-lg font-semibold text-gray-900">Trip Cost Calculator</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin *
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Starting location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ending location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (miles) *
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Efficiency (MPG) *
                </label>
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  placeholder="30"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
                >
                  <option value="regular">Regular</option>
                  <option value="midgrade">Mid-Grade</option>
                  <option value="premium">Premium</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={calculateTripCost}
                  disabled={!origin || !destination || !distance || !fuelEfficiency || !nationalData}
                  className="aegis-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate Trip Cost
                </button>
              </div>
            </div>
            
            {nationalData && (
              <div className="text-xs text-gray-500">
                Using {fuelType} fuel price: {formatPrice(nationalData[fuelType])}/gal
              </div>
            )}
          </div>

          {/* Trip Calculations History */}
          {tripCalculations.length > 0 && (
            <div className="aegis-card">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Trip Calculations</h4>
              <div className="space-y-3">
                {tripCalculations.map((trip) => (
                  <div key={trip.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {trip.origin} → {trip.destination}
                        </div>
                        <div className="text-sm text-gray-600">
                          {trip.distance} miles • {trip.fuelEfficiency} MPG • {trip.fuelType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(trip.fuelCost)}
                        </div>
                        <div className="text-xs text-gray-500">
                          @ {formatPrice(trip.gasPrice)}/gal
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Calculated: {new Date(trip.calculationDate).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Source Info */}
      <div className="text-xs text-gray-500 text-center">
        Data source: {nationalData?.source || 'AAA Gas Prices'} • 
        <a 
          href="https://gasprices.aaa.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-aegis-600 hover:text-aegis-700 ml-1"
        >
          View on AAA
        </a>
      </div>
    </div>
  )
} 
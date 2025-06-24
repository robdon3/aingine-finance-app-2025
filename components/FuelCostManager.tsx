'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Fuel, MapPin, Calculator, TrendingUp, RefreshCw, Route, AlertTriangle } from 'lucide-react'
import GasPriceService, { type GasPriceData, type StateGasPrice } from './GasPriceService'

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

  const loadGasPrices = useCallback(async (isRefresh = false) => {
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
      const selectedLocationCode = localStorage.getItem('aingen_selected_location') || 'CA'
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
  }, [gasPriceService])

  useEffect(() => {
    loadGasPrices()
  }, [loadGasPrices])

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
      <div className="space-y-6">
        <div className="cassette-panel">
          <div className="flex items-center justify-center py-8">
            <div className="cassette-loading"></div>
            <span className="ml-3 text-cassette-400 font-mono">INITIALIZING FUEL COST MODULE...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !nationalData) {
    return (
      <div className="space-y-6">
        <div className="cassette-panel">
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <span className="text-red-400 font-mono">{error}</span>
            </div>
            <button 
              onClick={() => loadGasPrices(true)}
              className="cassette-btn-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              RETRY CONNECTION
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cassette-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Fuel className="h-8 w-8 text-orange-400" />
            <div>
              <h2 className="text-2xl font-bold text-cassette-50 font-mono">FUEL COST ANALYZER</h2>
              <p className="text-cassette-400 font-mono text-sm">REAL-TIME GAS PRICES & TRIP CALCULATIONS</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => loadGasPrices(true)}
              disabled={isRefreshing}
              className="cassette-btn flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-mono text-xs">REFRESH</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('prices')}
            className={`cassette-tab ${activeTab === 'prices' ? 'cassette-tab-active' : ''}`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            GAS PRICES
          </button>
          <button
            onClick={() => setActiveTab('trip-calculator')}
            className={`cassette-tab ${activeTab === 'trip-calculator' ? 'cassette-tab-active' : ''}`}
          >
            <Calculator className="h-4 w-4 mr-2" />
            TRIP CALCULATOR
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          {/* National Averages */}
          {nationalData && (
            <div className="cassette-panel">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-bold text-cassette-50 font-mono">NATIONAL AVERAGES</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="data-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">REGULAR</span>
                    <div className="status-indicator status-online">
                      <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
                      LIVE
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-cassette-50 font-mono">{formatPrice(nationalData.regular)}</p>
                  <p className="text-xs text-cassette-400 font-mono mt-1">PER GALLON</p>
                </div>
                <div className="data-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">MIDGRADE</span>
                    <div className="status-indicator status-online">
                      <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
                      LIVE
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-cassette-50 font-mono">{formatPrice(nationalData.midgrade)}</p>
                  <p className="text-xs text-cassette-400 font-mono mt-1">PER GALLON</p>
                </div>
                <div className="data-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">PREMIUM</span>
                    <div className="status-indicator status-online">
                      <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
                      LIVE
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-cassette-50 font-mono">{formatPrice(nationalData.premium)}</p>
                  <p className="text-xs text-cassette-400 font-mono mt-1">PER GALLON</p>
                </div>
                <div className="data-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cassette-400 uppercase tracking-wider">DIESEL</span>
                    <div className="status-indicator status-online">
                      <div className="w-1 h-1 rounded-full bg-current mr-1"></div>
                      LIVE
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-cassette-50 font-mono">{formatPrice(nationalData.diesel)}</p>
                  <p className="text-xs text-cassette-400 font-mono mt-1">PER GALLON</p>
                </div>
              </div>
            </div>
          )}

          {/* State Data */}
          {stateData && (
            <div className="cassette-panel">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-cassette-50 font-mono">STATE DATA: {stateData.state}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="data-card">
                  <p className="text-xs font-mono text-cassette-400 uppercase tracking-wider mb-1">REGULAR</p>
                  <p className="text-xl font-bold text-cassette-50 font-mono">{formatPrice(stateData.regular)}</p>
                </div>
                <div className="data-card">
                  <p className="text-xs font-mono text-cassette-400 uppercase tracking-wider mb-1">MIDGRADE</p>
                  <p className="text-xl font-bold text-cassette-50 font-mono">{formatPrice(stateData.midgrade)}</p>
                </div>
                <div className="data-card">
                  <p className="text-xs font-mono text-cassette-400 uppercase tracking-wider mb-1">PREMIUM</p>
                  <p className="text-xl font-bold text-cassette-50 font-mono">{formatPrice(stateData.premium)}</p>
                </div>
                <div className="data-card">
                  <p className="text-xs font-mono text-cassette-400 uppercase tracking-wider mb-1">DIESEL</p>
                  <p className="text-xl font-bold text-cassette-50 font-mono">{formatPrice(stateData.diesel)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trip-calculator' && (
        <div className="space-y-6">
          {/* Trip Calculator Form */}
          <div className="cassette-panel">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-bold text-cassette-50 font-mono">TRIP COST CALCULATOR</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                  ORIGIN
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="cassette-input w-full"
                  placeholder="ENTER ORIGIN"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                  DESTINATION
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="cassette-input w-full"
                  placeholder="ENTER DESTINATION"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                  DISTANCE (MILES)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="cassette-input w-full"
                  placeholder="ENTER DISTANCE"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                  FUEL EFFICIENCY (MPG)
                </label>
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  className="cassette-input w-full"
                  placeholder="ENTER MPG"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono text-cassette-400 uppercase tracking-wider mb-2">
                FUEL TYPE
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as 'regular' | 'midgrade' | 'premium' | 'diesel')}
                className="cassette-input w-full md:w-64"
              >
                <option value="regular">REGULAR</option>
                <option value="midgrade">MIDGRADE</option>
                <option value="premium">PREMIUM</option>
                <option value="diesel">DIESEL</option>
              </select>
            </div>

            <button
              onClick={calculateTripCost}
              className="cassette-btn-primary flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span className="font-mono">CALCULATE TRIP COST</span>
            </button>

            {error && (
              <div className="mt-4 flex items-center space-x-2 p-3 bg-red-400/20 border border-red-400 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}
          </div>

          {/* Trip Calculations History */}
          {tripCalculations.length > 0 && (
            <div className="cassette-panel">
              <div className="flex items-center space-x-2 mb-4">
                <Route className="h-5 w-5 text-magenta-400" />
                <h3 className="text-lg font-bold text-cassette-50 font-mono">TRIP CALCULATIONS</h3>
              </div>
              <div className="space-y-3">
                {tripCalculations.map((calculation) => (
                  <div key={calculation.id} className="data-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-mono text-cassette-50">
                          {calculation.origin} → {calculation.destination}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-400 font-mono">
                          {formatCurrency(calculation.fuelCost)}
                        </p>
                        <p className="text-xs text-cassette-400 font-mono">
                          {calculation.distance} MILES // {calculation.fuelEfficiency} MPG
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-cassette-400 font-mono">
                      FUEL: {calculation.fuelType.toUpperCase()} @ {formatPrice(calculation.gasPrice)} {'//'} 
                      {new Date(calculation.calculationDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 
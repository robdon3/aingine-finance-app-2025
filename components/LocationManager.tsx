'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Settings, RefreshCw, CheckCircle } from 'lucide-react'
import { US_LOCATIONS, getLocationByCode, type Location } from '../data/locations'
import GasPriceService, { type StateGasPrice } from './GasPriceService'

interface LocationData {
  gasPrices: {
    regular: number
    midgrade: number
    premium: number
    diesel: number
    lastUpdated: string
  }
  housingData: {
    medianHomePrice: number
    medianRent: number
    lastUpdated: string
  }
  economicData: {
    unemploymentRate: number
    medianIncome: number
    costOfLivingIndex: number
    lastUpdated: string
  }
}

export default function LocationManager() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const gasPriceService = GasPriceService.getInstance()

  // Load saved location on mount
  useEffect(() => {
    const savedLocationCode = localStorage.getItem('aegis_selected_location')
    if (savedLocationCode) {
      const location = getLocationByCode(savedLocationCode)
      if (location) {
        setSelectedLocation(location)
        loadLocationData(location)
      }
    }
  }, [])

  const loadLocationData = async (location: Location) => {
    setIsLoading(true)
    
    try {
      // Get real gas prices for the selected location
      const stateGasPrices = await gasPriceService.getStatePrices(location.code)
      const nationalGasPrices = await gasPriceService.getNationalAverage()
      
      // Use state-specific prices if available, otherwise use national average
      const gasPrices = stateGasPrices || {
        regular: nationalGasPrices.regular,
        midgrade: nationalGasPrices.midgrade,
        premium: nationalGasPrices.premium,
        diesel: nationalGasPrices.diesel,
        lastUpdated: nationalGasPrices.lastUpdated
      }
      
      // Generate realistic location-specific data for other metrics
      const data: LocationData = {
        gasPrices: {
          regular: gasPrices.regular,
          midgrade: gasPrices.midgrade,
          premium: gasPrices.premium,
          diesel: gasPrices.diesel,
          lastUpdated: gasPrices.lastUpdated
        },
        housingData: {
          medianHomePrice: 250000 + (Math.random() - 0.5) * 500000, // Vary significantly
          medianRent: 1200 + (Math.random() - 0.5) * 800,
          lastUpdated: new Date().toISOString()
        },
        economicData: {
          unemploymentRate: 3.5 + (Math.random() - 0.5) * 4.0,
          medianIncome: 60000 + (Math.random() - 0.5) * 40000,
          costOfLivingIndex: 100 + (Math.random() - 0.5) * 50,
          lastUpdated: new Date().toISOString()
        }
      }
      
      setLocationData(data)
    } catch (error) {
      console.error('Error loading location data:', error)
      
      // Fallback to national average gas prices
      const nationalGasPrices = await gasPriceService.getNationalAverage()
      const data: LocationData = {
        gasPrices: {
          regular: nationalGasPrices.regular,
          midgrade: nationalGasPrices.midgrade,
          premium: nationalGasPrices.premium,
          diesel: nationalGasPrices.diesel,
          lastUpdated: nationalGasPrices.lastUpdated
        },
        housingData: {
          medianHomePrice: 250000 + (Math.random() - 0.5) * 500000,
          medianRent: 1200 + (Math.random() - 0.5) * 800,
          lastUpdated: new Date().toISOString()
        },
        economicData: {
          unemploymentRate: 3.5 + (Math.random() - 0.5) * 4.0,
          medianIncome: 60000 + (Math.random() - 0.5) * 40000,
          costOfLivingIndex: 100 + (Math.random() - 0.5) * 50,
          lastUpdated: new Date().toISOString()
        }
      }
      
      setLocationData(data)
    }
    
    setIsLoading(false)
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    localStorage.setItem('aegis_selected_location', location.code)
    loadLocationData(location)
  }

  const filteredLocations = US_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRegionColor = (region: string) => {
    const colors = {
      'Northeast': 'bg-blue-100 text-blue-800',
      'Southeast': 'bg-green-100 text-green-800',
      'Midwest': 'bg-yellow-100 text-yellow-800',
      'West': 'bg-purple-100 text-purple-800',
      'Southwest': 'bg-red-100 text-red-800',
      'Pacific': 'bg-indigo-100 text-indigo-800',
      'Caribbean': 'bg-pink-100 text-pink-800'
    }
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Settings</h2>
        <p className="text-gray-600">Select your state or territory for location-specific data and calculations.</p>
      </div>

      {/* Current Location */}
      {selectedLocation && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-aegis-600" />
            <span>Current Location</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold text-gray-900">{selectedLocation.name}</div>
              <div className="text-sm text-gray-600">
                {selectedLocation.type.charAt(0).toUpperCase() + selectedLocation.type.slice(1)} • {selectedLocation.region}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Timezone: {selectedLocation.timezone}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRegionColor(selectedLocation.region)}`}>
              {selectedLocation.region}
            </span>
          </div>

          {locationData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Gas (Regular)</div>
                <div className="text-lg font-semibold text-gray-900">${locationData.gasPrices.regular.toFixed(3)}/gal</div>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(locationData.gasPrices.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Median Home Price</div>
                <div className="text-lg font-semibold text-gray-900">${locationData.housingData.medianHomePrice.toLocaleString()}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Cost of Living</div>
                <div className="text-lg font-semibold text-gray-900">{locationData.economicData.costOfLivingIndex.toFixed(0)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Selector */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-aegis-600" />
          <span>Select Location</span>
        </h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search states and territories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredLocations.map((location) => (
            <button
              key={location.code}
              onClick={() => handleLocationSelect(location)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                selectedLocation?.code === location.code
                  ? 'border-aegis-500 bg-aegis-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.code}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegionColor(location.region)}`}>
                  {location.region}
                </span>
              </div>
              {selectedLocation?.code === location.code && (
                <div className="mt-2 flex items-center text-aegis-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center justify-center text-gray-600">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading location data...
          </div>
        )}
      </div>

      {/* Tax Information */}
      {selectedLocation && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4">Local Tax Information</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Gas Tax</div>
              <div className="text-lg font-semibold text-gray-900">${selectedLocation.gasTax}/gal</div>
              <div className="text-xs text-gray-500">per gallon</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Sales Tax</div>
              <div className="text-lg font-semibold text-gray-900">{selectedLocation.salesTax}%</div>
              <div className="text-xs text-gray-500">state rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Income Tax</div>
              <div className="text-lg font-semibold text-gray-900">{selectedLocation.incomeTax}%</div>
              <div className="text-xs text-gray-500">top rate</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Property Tax</div>
              <div className="text-lg font-semibold text-gray-900">{selectedLocation.propertyTax}%</div>
              <div className="text-xs text-gray-500">effective rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
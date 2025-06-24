'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CensusAPIService, CensusData } from './CensusAPIService'
import { 
  Users, 
  DollarSign, 
  Home, 
  TrendingDown, 
  Calendar,
  Database,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface CensusDataDisplayProps {
  stateCode: string
  showAttribution?: boolean
}

export default function CensusDataDisplay({ stateCode, showAttribution = true }: CensusDataDisplayProps) {
  const [censusData, setCensusData] = useState<CensusData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheStatus, setCacheStatus] = useState<{ total: number; expired: number }>({ total: 0, expired: 0 })

  const censusService = CensusAPIService.getInstance()

  const loadCensusData = useCallback(async () => {
    if (!stateCode) return

    setLoading(true)
    setError(null)

    try {
      const data = await censusService.getStateData(stateCode)
      setCensusData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Census data')
    } finally {
      setLoading(false)
    }
  }, [stateCode, censusService])

  const updateStatus = useCallback(() => {
    setCacheStatus(censusService.getCacheStatus())
  }, [censusService])

  useEffect(() => {
    loadCensusData()
    updateStatus()
  }, [loadCensusData, updateStatus])

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="aegis-card">
        <div className="flex items-center justify-center space-x-2 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-aegis-600" />
          <span className="text-gray-600">Loading Census data for {stateCode}...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aegis-card">
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Error Loading Census Data</span>
        </div>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={loadCensusData}
          className="aegis-button-secondary text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!censusData) {
    return (
      <div className="aegis-card">
        <p className="text-gray-600">No Census data available for {stateCode}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Census Data Display */}
      <div className="aegis-card">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Census Bureau Data for {censusData.state}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {censusData.population && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Population</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(censusData.population)}
              </p>
            </div>
          )}

          {censusData.medianIncome && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Median Income</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(censusData.medianIncome)}
              </p>
            </div>
          )}

          {censusData.housingUnits && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Housing Units</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {formatNumber(censusData.housingUnits)}
              </p>
            </div>
          )}

          {censusData.povertyRate && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Poverty Rate</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {formatPercentage(censusData.povertyRate)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last Updated: {censusData.lastUpdated ? new Date(censusData.lastUpdated).toLocaleDateString() : 'N/A'}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Source: {censusData.source || 'N/A'}</p>
          <p className="text-xs text-gray-500 mt-1">
            Data from <a href="https://www.census.gov/data/developers/updates/new-discovery-tool.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Census Bureau Discovery Service</a>
          </p>
        </div>
      </div>

      {/* API Status */}
      <div className="aegis-card bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Census Data Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Cache: {cacheStatus.total} entries ({cacheStatus.expired} expired)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Data Source: Public Census Data</span>
          </div>
        </div>
      </div>

      {/* Required Attribution - Census Bureau Terms of Service */}
      {showAttribution && (
        <div className="aegis-card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-2">
            <Database className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                {censusService.getAttribution()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                This attribution is required by the U.S. Census Bureau Terms of Service for API usage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
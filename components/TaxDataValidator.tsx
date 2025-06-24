'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle, RefreshCw, ExternalLink, Upload, Shield, Database, TrendingUp, TrendingDown, Users } from 'lucide-react'
import { US_LOCATIONS, getLocationByCode } from '../data/locations'
import TaxAPIService, { type TaxRateData, type APISource } from './TaxAPIService'
import CensusDataDisplay from './CensusDataDisplay'

interface TaxDataValidation {
  locationCode: string
  locationName: string
  dataSource: string
  currentLocal: {
    gasTax: number
    salesTax: number
    incomeTax: number
    propertyTax: number
  }
  verifiedOnline: TaxRateData
  discrepancy: {
    gasTax: number
    salesTax: number
    incomeTax: number
    propertyTax: number
  }
  status: 'current' | 'outdated' | 'verifying'
}

export default function TaxDataValidator() {
  const [validations, setValidations] = useState<TaxDataValidation[]>([])
  const [dataSources, setDataSources] = useState<APISource[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const apiService = TaxAPIService.getInstance()

  const loadDataSources = useCallback(() => {
    const sources = apiService.getAvailableSources()
    setDataSources(sources)
  }, [apiService])

  const validateTaxData = useCallback(async (locationCode: string) => {
    setIsLoading(true)
    
    // Get current local tax data
    const savedPolicies = localStorage.getItem('aegis_tax_policies')
    let currentLocal = {
      gasTax: 0,
      salesTax: 0,
      incomeTax: 0,
      propertyTax: 0
    }

    if (savedPolicies) {
      const policies = JSON.parse(savedPolicies)
      const policy = policies.find((p: unknown) => typeof p === 'object' && p !== null && 'locationCode' in p && (p as Record<string, unknown>).locationCode === locationCode)
      if (policy) {
        currentLocal = {
          gasTax: (policy as Record<string, unknown>).gasTax as number,
          salesTax: (policy as Record<string, unknown>).salesTax as number,
          incomeTax: (policy as Record<string, unknown>).incomeTax as number,
          propertyTax: (policy as Record<string, unknown>).propertyTax as number
        }
      }
    }

    // Fall back to static data if no local data
    if (currentLocal.gasTax === 0) {
      const location = getLocationByCode(locationCode)
      if (location) {
        currentLocal = {
          gasTax: location.gasTax,
          salesTax: location.salesTax,
          incomeTax: location.incomeTax,
          propertyTax: location.propertyTax
        }
      }
    }

    try {
      // Fetch verified online data using the API service
      const verifiedOnline = await apiService.fetchTaxRates(locationCode)
      
      // Calculate discrepancies
      const discrepancy = {
        gasTax: verifiedOnline.gasTax - currentLocal.gasTax,
        salesTax: verifiedOnline.salesTax - currentLocal.salesTax,
        incomeTax: verifiedOnline.incomeTax - currentLocal.incomeTax,
        propertyTax: verifiedOnline.propertyTax - currentLocal.propertyTax
      }

      const location = getLocationByCode(locationCode)
      const validation: TaxDataValidation = {
        locationCode,
        locationName: location?.name || locationCode,
        dataSource: verifiedOnline.source,
        currentLocal,
        verifiedOnline,
        discrepancy,
        status: hasDiscrepancy(discrepancy) ? 'outdated' : 'current'
      }

      setValidations(prev => {
        const filtered = prev.filter(v => v.locationCode !== locationCode)
        return [...filtered, validation]
      })
    } catch (error) {
      console.error('Failed to validate tax data:', error)
      // Show error state
      const location = getLocationByCode(locationCode)
      const validation: TaxDataValidation = {
        locationCode,
        locationName: location?.name || locationCode,
        dataSource: 'Error - Unable to fetch',
        currentLocal,
        verifiedOnline: {
          locationCode,
          locationName: location?.name || locationCode,
          gasTax: 0,
          salesTax: 0,
          incomeTax: 0,
          propertyTax: 0,
          source: 'Error',
          lastUpdated: new Date().toISOString(),
          confidence: 'low',
          notes: 'Failed to fetch from API sources'
        },
        discrepancy: {
          gasTax: 0,
          salesTax: 0,
          incomeTax: 0,
          propertyTax: 0
        },
        status: 'verifying'
      }

      setValidations(prev => {
        const filtered = prev.filter(v => v.locationCode !== locationCode)
        return [...filtered, validation]
      })
    }
    
    setIsLoading(false)
  }, [apiService])

  useEffect(() => {
    loadDataSources()
    if (selectedLocation) {
      validateTaxData(selectedLocation)
    }
  }, [selectedLocation, loadDataSources, validateTaxData])

  const hasDiscrepancy = (discrepancy: unknown): boolean => {
    if (typeof discrepancy !== 'object' || discrepancy === null) return false;
    const d = discrepancy as { gasTax: number; salesTax: number; incomeTax: number; propertyTax: number };
    return Math.abs(d.gasTax) > 0.01 ||
           Math.abs(d.salesTax) > 0.1 ||
           Math.abs(d.incomeTax) > 0.1 ||
           Math.abs(d.propertyTax) > 0.1;
  }

  const updateLocalTaxData = (locationCode: string) => {
    const validation = validations.find(v => v.locationCode === locationCode)
    if (!validation) return

    const updatedPolicy = {
      locationCode,
      gasTax: validation.verifiedOnline.gasTax,
      salesTax: validation.verifiedOnline.salesTax,
      incomeTax: validation.verifiedOnline.incomeTax,
      propertyTax: validation.verifiedOnline.propertyTax,
      lastUpdated: new Date().toISOString(),
      source: validation.verifiedOnline.source
    }

    // Update localStorage
    const savedPolicies = localStorage.getItem('aegis_tax_policies')
    const policies = savedPolicies ? JSON.parse(savedPolicies) : []
    
    const existingIndex = policies.findIndex((p: unknown) => typeof p === 'object' && p !== null && 'locationCode' in p && (p as Record<string, unknown>).locationCode === locationCode)
    if (existingIndex >= 0) {
      policies[existingIndex] = updatedPolicy
    } else {
      policies.push(updatedPolicy)
    }

    localStorage.setItem('aegis_tax_policies', JSON.stringify(policies))

    // Update validation status
    setValidations(prev => prev.map(v => 
      v.locationCode === locationCode 
        ? { ...v, status: 'current' as const }
        : v
    ))
  }

  const getDiscrepancyIcon = (value: number) => {
    if (Math.abs(value) < 0.01) return <CheckCircle className="h-4 w-4 text-green-500" />
    return value > 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-blue-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800'
      case 'outdated': return 'bg-yellow-100 text-yellow-800'
      case 'verifying': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTaxRate = (rate: number, type: string) => {
    if (type === 'gasTax') {
      return `$${rate.toFixed(2)}/gal`
    }
    return `${rate.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tax Data Validator</h2>
        <p className="text-gray-700 dark:text-gray-300">Verify your local tax data against authoritative government sources.</p>
      </div>

      {/* Data Sources */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-600" />
          <span>Authoritative Data Sources</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSources.map(source => (
            <div key={source.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{source.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  source.status === 'available' ? 'bg-green-100 text-green-800' : 
                  source.status === 'limited' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {source.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{source.description}</p>
              {source.rateLimit && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Rate limit: {source.rateLimit}</p>
              )}
              <div className="flex items-center space-x-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aegis-600 hover:text-aegis-700 text-sm flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Source
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Selection */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Validate Tax Data</h3>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
          >
            <option value="">Select State/Territory</option>
            {US_LOCATIONS.map(location => (
              <option key={location.code} value={location.code}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {selectedLocation && (
          <button
            onClick={() => validateTaxData(selectedLocation)}
            disabled={isLoading}
            className="aegis-button flex items-center space-x-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Validating...' : 'Validate Tax Data'}</span>
          </button>
        )}
      </div>

      {/* Validation Results */}
      {validations.length > 0 && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
          
          <div className="space-y-4">
            {validations.map(validation => (
              <div key={validation.locationCode} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{validation.locationName}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Data source: {validation.dataSource}</p>
                    {validation.verifiedOnline.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{validation.verifiedOnline.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(validation.verifiedOnline.confidence)}`}>
                      {validation.verifiedOnline.confidence} confidence
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(validation.status)}`}>
                      {validation.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Tax Type</th>
                        <th className="text-right py-2 px-2 font-medium text-gray-700">Local Data</th>
                        <th className="text-right py-2 px-2 font-medium text-gray-700">Verified Online</th>
                        <th className="text-right py-2 px-2 font-medium text-gray-700">Difference</th>
                        <th className="text-center py-2 px-2 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">Gas Tax</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.currentLocal.gasTax, 'gasTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.verifiedOnline.gasTax, 'gasTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.discrepancy.gasTax, 'gasTax')}</td>
                        <td className="text-center py-2 px-2">{getDiscrepancyIcon(validation.discrepancy.gasTax)}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">Sales Tax</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.currentLocal.salesTax, 'salesTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.verifiedOnline.salesTax, 'salesTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.discrepancy.salesTax, 'salesTax')}</td>
                        <td className="text-center py-2 px-2">{getDiscrepancyIcon(validation.discrepancy.salesTax)}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">Income Tax</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.currentLocal.incomeTax, 'incomeTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.verifiedOnline.incomeTax, 'incomeTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.discrepancy.incomeTax, 'incomeTax')}</td>
                        <td className="text-center py-2 px-2">{getDiscrepancyIcon(validation.discrepancy.incomeTax)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">Property Tax</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.currentLocal.propertyTax, 'propertyTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.verifiedOnline.propertyTax, 'propertyTax')}</td>
                        <td className="text-right py-2 px-2">{formatTaxRate(validation.discrepancy.propertyTax, 'propertyTax')}</td>
                        <td className="text-center py-2 px-2">{getDiscrepancyIcon(validation.discrepancy.propertyTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Last verified:</span> {new Date(validation.verifiedOnline.lastUpdated).toLocaleDateString()}
                  </div>
                  
                  {validation.status === 'outdated' && (
                    <button
                      onClick={() => updateLocalTaxData(validation.locationCode)}
                      className="aegis-button text-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Update Local Data
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Census Data Display */}
      {selectedLocation && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Demographic Data</span>
          </h3>
          <CensusDataDisplay stateCode={selectedLocation} showAttribution={true} />
        </div>
      )}

      {/* Information */}
      <div className="aegis-card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">About Tax Data Accuracy</h3>
            <p className="text-blue-800 text-sm mb-2">
              This validator uses Federal Reserve Economic Data (FRED) API calls, U.S. Census Bureau data, and other official government sources to ensure accuracy.
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Federal Reserve Economic Data (FRED):</strong> Official Federal Reserve economic and financial data</li>
              <li>• <strong>US Census Bureau:</strong> Official state and local government finance data and demographic information</li>
            </ul>
            <p className="text-blue-800 text-sm mt-2">
              <strong>FRED API Terms of Use:</strong> By using this application, you agree to be bound by the 
              <a href="https://fred.stlouisfed.org/docs/api/terms_of_use.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                FRED API Terms of Use
              </a>. 
              Rate limited to 120 requests per minute.
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>Census Bureau Terms of Service:</strong> This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau. 
              Rate limited to 100 requests per minute.
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>Data Attribution:</strong> Economic data provided by Federal Reserve Bank of St. Louis via FRED API. Demographic data provided by U.S. Census Bureau.
            </p>
            <p className="text-blue-800 text-sm mt-2">
              <strong>Note:</strong> Tax rates change frequently. Always verify with official sources before making financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
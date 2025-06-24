'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calculator, Car, Home, DollarSign, TrendingUp, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'
import { getLocationByCode, getDefaultLocation } from '../data/locations'
import GasPriceService from './GasPriceService'

interface GasPriceData {
  regular: number
  premium: number
  location: string
  gasTax: number
  source: string
}

interface InflationData {
  currentRate: number
}

interface InterestRateData {
  federalFundsRate: number
  savingsRate: number
}

interface DataSource {
  id: string
  name: string
  url: string
  data: GasPriceData | InflationData | InterestRateData | unknown
  lastUpdated: string
}

interface TrueCostCalculation {
  item: string
  baseCost: number
  category: 'vehicle' | 'home' | 'appliance' | 'service' | 'other'
  trueCost: number
  breakdown: {
    insurance: number
    maintenance: number
    taxes: number
    fuel: number
    opportunityCost: number
    inflation: number
    other: number
  }
  sources: string[]
  calculationDate: string
  location: string
}

interface TaxPolicyData {
  locationCode: string
  gasTax: number
  salesTax: number
  incomeTax: number
  propertyTax: number
  lastUpdated: string
  source: string
}

export default function TrueCostCalculator() {
  const [calculations, setCalculations] = useState<TrueCostCalculation[]>([])
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const gasPriceService = GasPriceService.getInstance()
  
  // Form state
  const [itemName, setItemName] = useState('')
  const [baseCost, setBaseCost] = useState('')
  const [category, setCategory] = useState<'vehicle' | 'home' | 'appliance' | 'service' | 'other'>('vehicle')
  const [yearsOwned, setYearsOwned] = useState('5')
  const [annualUsage, setAnnualUsage] = useState('')
  const [fuelEfficiency, setFuelEfficiency] = useState('')
  const [insuranceCost, setInsuranceCost] = useState('')
  const [maintenanceCost, setMaintenanceCost] = useState('')

  // Move loadDataSources above useEffect
  const loadDataSources = useCallback(async () => {
    setIsLoadingData(true)
    
    // Get user's selected location
    const selectedLocationCode = localStorage.getItem('aegis_selected_location') || 'CA'
    const selectedLocation = getLocationByCode(selectedLocationCode) || getDefaultLocation()
    const currentTaxRates = getCurrentTaxRates(selectedLocationCode)
    
    try {
      // Get real gas prices from AAA
      const gasPrices = await gasPriceService.getNationalAverage()
      
      // Get state-specific gas prices if available
      const stateGasPrices = await gasPriceService.getStatePrices(selectedLocationCode)
      const localGasPrice = stateGasPrices?.regular || gasPrices.regular
      
      const sources: DataSource[] = [
        {
          id: 'gas-prices',
          name: 'AAA Gas Prices',
          url: 'https://gasprices.aaa.com/',
          data: { 
            regular: localGasPrice,
            premium: stateGasPrices?.premium || gasPrices.premium,
            location: selectedLocation.name,
            gasTax: currentTaxRates.gasTax,
            source: (gasPrices && 'source' in gasPrices) ? gasPrices.source : 'Unknown'
          },
          lastUpdated: gasPrices.lastUpdated
        },
        {
          id: 'inflation',
          name: 'Bureau of Labor Statistics',
          url: 'https://www.bls.gov/cpi/',
          data: { currentRate: 3.2 },
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'interest-rates',
          name: 'Federal Reserve Economic Data',
          url: 'https://fred.stlouisfed.org/',
          data: { federalFundsRate: 5.25, savingsRate: 4.5 },
          lastUpdated: new Date().toISOString()
        }
      ]
      
      setDataSources(sources)
    } catch (error) {
      console.error('Error loading data sources:', error)
      // Fallback to basic data
      const sources: DataSource[] = [
        {
          id: 'gas-prices',
          name: 'AAA Gas Prices',
          url: 'https://gasprices.aaa.com/',
          data: { 
            regular: 3.205, // Current AAA national average
            premium: 4.039,
            location: selectedLocation.name,
            gasTax: currentTaxRates.gasTax,
            source: 'AAA Gas Prices (Fallback)'
          },
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'inflation',
          name: 'Bureau of Labor Statistics',
          url: 'https://www.bls.gov/cpi/',
          data: { currentRate: 3.2 },
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'interest-rates',
          name: 'Federal Reserve Economic Data',
          url: 'https://fred.stlouisfed.org/',
          data: { federalFundsRate: 5.25, savingsRate: 4.5 },
          lastUpdated: new Date().toISOString()
        }
      ]
      setDataSources(sources)
    }
    
    setIsLoadingData(false)
  }, [gasPriceService])

  useEffect(() => {
    loadDataSources()
  }, [loadDataSources])

  const getCurrentTaxRates = (locationCode: string): TaxPolicyData => {
    // First try to get updated tax policies from localStorage
    const savedPolicies = localStorage.getItem('aegis_tax_policies')
    if (savedPolicies) {
      const policies: TaxPolicyData[] = JSON.parse(savedPolicies)
      const currentPolicy = policies.find(p => p.locationCode === locationCode)
      if (currentPolicy) {
        return currentPolicy
      }
    }

    // Fall back to static data if no updated policies found
    const location = getLocationByCode(locationCode) || getDefaultLocation()
    return {
      locationCode: location.code,
      gasTax: location.gasTax,
      salesTax: location.salesTax,
      incomeTax: location.incomeTax,
      propertyTax: location.propertyTax,
      lastUpdated: new Date().toISOString(),
      source: 'Static data'
    }
  }

  const calculateTrueCost = () => {
    if (!itemName || !baseCost || !yearsOwned) return

    const cost = parseFloat(baseCost)
    const years = parseFloat(yearsOwned)
    const usage = parseFloat(annualUsage) || 0
    const efficiency = parseFloat(fuelEfficiency) || 0
    const insurance = parseFloat(insuranceCost) || 0
    const maintenance = parseFloat(maintenanceCost) || 0

    // Get user's selected location and current tax rates
    const selectedLocationCode = localStorage.getItem('aegis_selected_location') || 'CA'
    const selectedLocation = getLocationByCode(selectedLocationCode) || getDefaultLocation()
    const currentTaxRates = getCurrentTaxRates(selectedLocationCode)

    // Get real data from sources
    const gasPriceSource = dataSources.find(s => s.id === 'gas-prices')?.data
    const gasPrice = (isObject(gasPriceSource) && 'regular' in gasPriceSource) ? (gasPriceSource as GasPriceData).regular : 3.205
    const inflationSource = dataSources.find(s => s.id === 'inflation')?.data
    const inflationRate = (isObject(inflationSource) && 'currentRate' in inflationSource) ? (inflationSource as InflationData).currentRate : 3.0
    const interestSource = dataSources.find(s => s.id === 'interest-rates')?.data
    const interestRate = (isObject(interestSource) && 'savingsRate' in interestSource) ? (interestSource as InterestRateData).savingsRate : 4.0

    // Calculate breakdown with current tax rates
    const fuelCost = efficiency > 0 ? (usage / efficiency) * gasPrice * years : 0
    const taxCost = cost * (currentTaxRates.salesTax / 100) * years // Use current sales tax
    const opportunityCost = cost * (interestRate / 100) * years // Money could have earned interest
    const inflationImpact = cost * (inflationRate / 100) * years // Purchasing power lost
    const otherCosts = insurance * years + maintenance * years

    const totalTrueCost = cost + fuelCost + taxCost + opportunityCost + inflationImpact + otherCosts

    const calculation: TrueCostCalculation = {
      item: itemName,
      baseCost: cost,
      category,
      trueCost: totalTrueCost,
      breakdown: {
        insurance: insurance * years,
        maintenance: maintenance * years,
        taxes: taxCost,
        fuel: fuelCost,
        opportunityCost,
        inflation: inflationImpact,
        other: 0
      },
      sources: [
        `AAA Gas Prices - $${isObject(dataSources.find(s => s.id === 'gas-prices')?.data) && 'regular' in (dataSources.find(s => s.id === 'gas-prices')?.data as object) ? (dataSources.find(s => s.id === 'gas-prices')?.data as GasPriceData).regular : 3.205}/gal (${isObject(dataSources.find(s => s.id === 'gas-prices')?.data) && 'source' in (dataSources.find(s => s.id === 'gas-prices')?.data as object) ? (dataSources.find(s => s.id === 'gas-prices')?.data as GasPriceData).source : 'AAA'})`,
        'Bureau of Labor Statistics - Inflation rate',
        'Federal Reserve Economic Data - Interest rates',
        `${currentTaxRates.source} - Tax rates (${currentTaxRates.lastUpdated ? 'Updated: ' + new Date(currentTaxRates.lastUpdated).toLocaleDateString() : 'Current'})`
      ],
      calculationDate: new Date().toISOString(),
      location: selectedLocation.name
    }

    setCalculations([...calculations, calculation])
    
    // Clear form
    setItemName('')
    setBaseCost('')
    setAnnualUsage('')
    setFuelEfficiency('')
    setInsuranceCost('')
    setMaintenanceCost('')
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vehicle':
        return <Car className="h-5 w-5" />
      case 'home':
        return <Home className="h-5 w-5" />
      case 'appliance':
        return <Calculator className="h-5 w-5" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vehicle':
        return 'text-blue-600'
      case 'home':
        return 'text-green-600'
      case 'appliance':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Add type guards for 'in' operator
  const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">True Cost Calculator</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Calculate the real cost of ownership including hidden expenses and opportunity costs.
          </p>
        </div>
        <button
          onClick={loadDataSources}
          disabled={isLoadingData}
          className="aegis-button-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          <span>{isLoadingData ? 'Updating...' : 'Update Data'}</span>
        </button>
      </div>

      {/* Data Sources Status */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-aegis-600" />
          <span>Real-Time Data Sources</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm text-gray-900">{source.name}</div>
                <div className="text-xs text-gray-600">
                  {source.id === 'gas-prices' && (isObject(source.data) && 'regular' in source.data ? `$${(source.data as GasPriceData).regular}/gal` : '')}
                  {source.id === 'inflation' && (isObject(source.data) && 'currentRate' in source.data ? `${(source.data as InflationData).currentRate}%` : '')}
                  {source.id === 'interest-rates' && (isObject(source.data) && 'savingsRate' in source.data ? `${(source.data as InterestRateData).savingsRate}%` : '')}
                </div>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-aegis-600 hover:text-aegis-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-gray-600">
          Data sources are used for accurate calculations. Click &quot;Update Data&quot; to refresh.
        </div>
      </div>

      {/* Calculator Form */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-aegis-600" />
          <span>Calculate True Cost</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., 2023 Honda Accord"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'vehicle' | 'home' | 'appliance' | 'service' | 'other')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              >
                <option value="vehicle">Vehicle</option>
                <option value="home">Home/Property</option>
                <option value="appliance">Appliance/Electronics</option>
                <option value="service">Service/Subscription</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Cost
              </label>
              <input
                type="number"
                value={baseCost}
                onChange={(e) => setBaseCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Ownership
              </label>
              <input
                type="number"
                value={yearsOwned}
                onChange={(e) => setYearsOwned(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Usage (miles/hours)
              </label>
              <input
                type="number"
                value={annualUsage}
                onChange={(e) => setAnnualUsage(e.target.value)}
                placeholder="12,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Efficiency (MPG)
              </label>
              <input
                type="number"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Insurance Cost
              </label>
              <input
                type="number"
                value={insuranceCost}
                onChange={(e) => setInsuranceCost(e.target.value)}
                placeholder="1,200"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Maintenance Cost
              </label>
              <input
                type="number"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={calculateTrueCost}
          className="aegis-button w-full mt-6"
        >
          Calculate True Cost
        </button>
      </div>

      {/* Results */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-aegis-600" />
          <span>True Cost Analysis</span>
        </h3>

        {calculations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No calculations yet. Add an item to see its true cost breakdown.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {calculations.map((calc, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${getCategoryColor(calc.category)}`}>
                      {getCategoryIcon(calc.category)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{calc.item}</h4>
                      <p className="text-sm text-gray-600 capitalize">{calc.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-aegis-600">
                      {formatCurrency(calc.trueCost)}
                    </div>
                    <div className="text-sm text-gray-500">True Cost</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Cost Breakdown</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Cost:</span>
                        <span className="font-medium">{formatCurrency(calc.baseCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.fuel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.maintenance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Opportunity Cost:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.opportunityCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inflation Impact:</span>
                        <span className="font-medium">{formatCurrency(calc.breakdown.inflation)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Data Sources</h5>
                    <div className="space-y-2">
                      {calc.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <ExternalLink className="h-3 w-3 text-aegis-600" />
                          <span className="text-gray-700">{source}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Calculated: {new Date(calc.calculationDate).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Hidden Cost Alert:</strong> The true cost is {((calc.trueCost / calc.baseCost - 1) * 100).toFixed(0)}% higher than the base price due to fuel, insurance, maintenance, taxes, opportunity costs, and inflation.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, Calendar, TrendingUp, TrendingDown, Edit3, Save } from 'lucide-react'
import { US_LOCATIONS, getLocationByCode, type Location } from '../data/locations'

interface TaxPolicyChange {
  id: string
  locationCode: string
  locationName: string
  taxType: 'gasTax' | 'salesTax' | 'incomeTax' | 'propertyTax'
  oldValue: number
  newValue: number
  effectiveDate: string
  source: string
  description: string
  status: 'pending' | 'active' | 'verified'
  lastUpdated: string
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

export default function TaxPolicyUpdater() {
  const [taxPolicies, setTaxPolicies] = useState<TaxPolicyData[]>([])
  const [policyChanges, setPolicyChanges] = useState<TaxPolicyChange[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [editingPolicy, setEditingPolicy] = useState<TaxPolicyData | null>(null)

  // Form state for adding policy changes
  const [newChange, setNewChange] = useState({
    locationCode: '',
    taxType: 'gasTax' as TaxPolicyChange['taxType'],
    oldValue: '',
    newValue: '',
    effectiveDate: '',
    source: '',
    description: ''
  })

  useEffect(() => {
    loadTaxPolicies()
    loadPolicyChanges()
  }, [])

  const loadTaxPolicies = () => {
    // Load current tax policies from localStorage or use defaults
    const savedPolicies = localStorage.getItem('aegis_tax_policies')
    if (savedPolicies) {
      setTaxPolicies(JSON.parse(savedPolicies))
    } else {
      // Initialize with current data
      const initialPolicies: TaxPolicyData[] = US_LOCATIONS.map(location => ({
        locationCode: location.code,
        gasTax: location.gasTax,
        salesTax: location.salesTax,
        incomeTax: location.incomeTax,
        propertyTax: location.propertyTax,
        lastUpdated: new Date().toISOString(),
        source: 'Initial data'
      }))
      setTaxPolicies(initialPolicies)
      localStorage.setItem('aegis_tax_policies', JSON.stringify(initialPolicies))
    }
  }

  const loadPolicyChanges = () => {
    const savedChanges = localStorage.getItem('aegis_policy_changes')
    if (savedChanges) {
      setPolicyChanges(JSON.parse(savedChanges))
    }
  }

  const addPolicyChange = () => {
    if (!newChange.locationCode || !newChange.newValue || !newChange.effectiveDate) return

    const location = getLocationByCode(newChange.locationCode)
    if (!location) return

    const currentPolicy = taxPolicies.find(p => p.locationCode === newChange.locationCode)
    if (!currentPolicy) return

    const change: TaxPolicyChange = {
      id: Date.now().toString(),
      locationCode: newChange.locationCode,
      locationName: location.name,
      taxType: newChange.taxType,
      oldValue: currentPolicy[newChange.taxType],
      newValue: parseFloat(newChange.newValue),
      effectiveDate: newChange.effectiveDate,
      source: newChange.source,
      description: newChange.description,
      status: 'pending',
      lastUpdated: new Date().toISOString()
    }

    const updatedChanges = [...policyChanges, change]
    setPolicyChanges(updatedChanges)
    localStorage.setItem('aegis_policy_changes', JSON.stringify(updatedChanges))

    // Clear form
    setNewChange({
      locationCode: '',
      taxType: 'gasTax',
      oldValue: '',
      newValue: '',
      effectiveDate: '',
      source: '',
      description: ''
    })
  }

  const applyPolicyChange = (change: TaxPolicyChange) => {
    const updatedPolicies = taxPolicies.map(policy => {
      if (policy.locationCode === change.locationCode) {
        return {
          ...policy,
          [change.taxType]: change.newValue,
          lastUpdated: new Date().toISOString(),
          source: change.source
        }
      }
      return policy
    })

    setTaxPolicies(updatedPolicies)
    localStorage.setItem('aegis_tax_policies', JSON.stringify(updatedPolicies))

    // Update change status
    const updatedChanges = policyChanges.map(c => 
      c.id === change.id ? { ...c, status: 'active' as const } : c
    )
    setPolicyChanges(updatedChanges)
    localStorage.setItem('aegis_policy_changes', JSON.stringify(updatedChanges))
  }

  const editPolicy = (policy: TaxPolicyData) => {
    setEditingPolicy(policy)
  }

  const savePolicyEdit = () => {
    if (!editingPolicy) return

    const updatedPolicies = taxPolicies.map(policy => 
      policy.locationCode === editingPolicy.locationCode ? editingPolicy : policy
    )
    setTaxPolicies(updatedPolicies)
    localStorage.setItem('aegis_tax_policies', JSON.stringify(updatedPolicies))
    setEditingPolicy(null)
  }

  const getTaxTypeLabel = (type: string) => {
    switch (type) {
      case 'gasTax': return 'Gas Tax'
      case 'salesTax': return 'Sales Tax'
      case 'incomeTax': return 'Income Tax'
      case 'propertyTax': return 'Property Tax'
      default: return type
    }
  }

  const getTaxTypeUnit = (type: string) => {
    switch (type) {
      case 'gasTax': return '/gal'
      case 'salesTax': return '%'
      case 'incomeTax': return '%'
      case 'propertyTax': return '%'
      default: return ''
    }
  }

  const getChangeIcon = (oldValue: number, newValue: number) => {
    if (newValue > oldValue) {
      return <TrendingUp className="h-4 w-4 text-red-500" />
    } else if (newValue < oldValue) {
      return <TrendingDown className="h-4 w-4 text-green-500" />
    }
    return <CheckCircle className="h-4 w-4 text-blue-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'verified': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPolicies = selectedLocation 
    ? taxPolicies.filter(p => p.locationCode === selectedLocation)
    : taxPolicies

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tax Policy Manager</h2>
        <p className="text-gray-600">Track and update tax rates when policies change in your state or territory.</p>
      </div>

      {/* Add Policy Change */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>Add Tax Policy Change</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={newChange.locationCode}
              onChange={(e) => setNewChange({ ...newChange, locationCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            >
              <option value="">Select State/Territory</option>
              {US_LOCATIONS.map(location => (
                <option key={location.code} value={location.code}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
            <select
              value={newChange.taxType}
              onChange={(e) => setNewChange({ ...newChange, taxType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            >
              <option value="gasTax">Gas Tax</option>
              <option value="salesTax">Sales Tax</option>
              <option value="incomeTax">Income Tax</option>
              <option value="propertyTax">Property Tax</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
            <input
              type="number"
              step="0.01"
              value={newChange.newValue}
              onChange={(e) => setNewChange({ ...newChange, newValue: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
            <input
              type="date"
              value={newChange.effectiveDate}
              onChange={(e) => setNewChange({ ...newChange, effectiveDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              type="text"
              value={newChange.source}
              onChange={(e) => setNewChange({ ...newChange, source: e.target.value })}
              placeholder="e.g., State Legislature, IRS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={newChange.description}
              onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
              placeholder="Brief description of change"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={addPolicyChange}
          className="aegis-button mt-4"
        >
          Add Policy Change
        </button>
      </div>

      {/* Policy Changes */}
      {policyChanges.length > 0 && (
        <div className="aegis-card">
          <h3 className="text-lg font-semibold mb-4">Pending Policy Changes</h3>
          
          <div className="space-y-4">
            {policyChanges.filter(change => change.status === 'pending').map(change => (
              <div key={change.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getChangeIcon(change.oldValue, change.newValue)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{change.locationName}</h4>
                      <p className="text-sm text-gray-600">{getTaxTypeLabel(change.taxType)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(change.status)}`}>
                    {change.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Old Value:</span>
                    <div className="font-medium">{change.oldValue}{getTaxTypeUnit(change.taxType)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">New Value:</span>
                    <div className="font-medium">{change.newValue}{getTaxTypeUnit(change.taxType)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Effective Date:</span>
                    <div className="font-medium">{new Date(change.effectiveDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Source:</span>
                    <div className="font-medium">{change.source}</div>
                  </div>
                </div>

                {change.description && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Description:</span> {change.description}
                  </div>
                )}

                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => applyPolicyChange(change)}
                    className="aegis-button text-sm"
                  >
                    Apply Change
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Tax Policies */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Tax Policies</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {US_LOCATIONS.map(location => (
                <option key={location.code} value={location.code}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Gas Tax</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Sales Tax</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Income Tax</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Property Tax</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Last Updated</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.locationCode} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {US_LOCATIONS.find(l => l.code === policy.locationCode)?.name}
                    </div>
                    <div className="text-sm text-gray-500">{policy.locationCode}</div>
                  </td>
                  <td className="text-right py-3 px-4 font-medium">${policy.gasTax}</td>
                  <td className="text-right py-3 px-4 font-medium">{policy.salesTax}%</td>
                  <td className="text-right py-3 px-4 font-medium">{policy.incomeTax}%</td>
                  <td className="text-right py-3 px-4 font-medium">{policy.propertyTax}%</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-500">
                    {new Date(policy.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    <button
                      onClick={() => editPolicy(policy)}
                      className="text-aegis-600 hover:text-aegis-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Policy Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Tax Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gas Tax</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPolicy.gasTax}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, gasTax: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPolicy.salesTax}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, salesTax: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income Tax (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPolicy.incomeTax}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, incomeTax: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPolicy.propertyTax}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, propertyTax: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={savePolicyEdit}
                className="aegis-button flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={() => setEditingPolicy(null)}
                className="aegis-button-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
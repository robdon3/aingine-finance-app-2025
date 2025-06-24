'use client'

import React, { useState, useEffect } from 'react'
import { Key, CheckCircle, AlertTriangle, Eye, EyeOff, ExternalLink, Info } from 'lucide-react'
import TaxAPIService from './TaxAPIService'

export default function FREDApiKeyManager() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null)
  const [apiService] = useState(() => TaxAPIService.getInstance())

  useEffect(() => {
    // Load existing API key from localStorage
    const existingKey = localStorage.getItem('aegis_fred_api_key')
    if (existingKey) {
      setApiKey(existingKey)
    }
  }, [])

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setValidationResult('invalid')
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      console.log('Starting FRED API key validation...')
      const isValid = await apiService.validateApiKey(apiKey.trim())
      
      if (isValid) {
        apiService.setFREDApiKey(apiKey.trim())
        setValidationResult('valid')
        console.log('FRED API key saved and validated successfully')
      } else {
        setValidationResult('invalid')
        console.error('FRED API key validation failed')
      }
    } catch (error) {
      console.error('Error during FRED API key validation:', error)
      setValidationResult('invalid')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveKey = () => {
    localStorage.removeItem('aegis_fred_api_key')
    setApiKey('')
    setValidationResult(null)
    apiService.clearCache()
  }

  const getApiKeyStatus = () => {
    return apiService.getApiKeyStatus()
  }

  const status = getApiKeyStatus()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">FRED API Key Manager</h2>
        <p className="text-gray-600">Configure your Federal Reserve Economic Data (FRED) API key for real-time economic data.</p>
      </div>

      {/* Current Status */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-600" />
          <span>Current API Key Status</span>
        </h3>

        <div className="flex items-center space-x-3 mb-4">
          {status.hasKey ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {status.hasKey ? 'API Key Configured' : 'No API Key Set'}
            </p>
            <p className="text-sm text-gray-600">
              {status.hasKey 
                ? `Source: ${status.source === 'user' ? 'User Input' : status.source === 'env' ? 'Environment Variable' : 'Demo Key'}`
                : 'Using demo key (limited functionality)'
              }
            </p>
          </div>
        </div>

        {!status.hasKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Demo Mode</h4>
                <p className="text-yellow-800 text-sm mt-1">
                  You&apos;re currently using a demo API key with limited functionality. 
                  To access real-time Federal Reserve data, please enter your FRED API key below.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Key Input */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Set FRED API Key</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FRED API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your FRED API key"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aegis-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveKey}
              disabled={isValidating || !apiKey.trim()}
              className="aegis-button flex items-center space-x-2"
            >
              {isValidating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{isValidating ? 'Validating...' : 'Save & Validate Key'}</span>
            </button>

            {status.hasKey && (
              <button
                onClick={handleRemoveKey}
                className="aegis-button-secondary"
              >
                Remove Key
              </button>
            )}
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-3 rounded-lg ${
              validationResult === 'valid' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {validationResult === 'valid' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  validationResult === 'valid' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult === 'valid' 
                    ? 'API key is valid and has been saved!' 
                    : 'Invalid API key. Please check your key and try again.'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="aegis-card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Get Your FRED API Key</h3>
        
        <div className="space-y-3 text-blue-800 text-sm">
          <div className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>Visit the <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">FRED API key registration page</a></span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Fill out the registration form with your application details</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>You will receive an API key via email</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Enter your API key above and click &quot;Save & Validate Key&quot;</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-blue-800 text-sm">
              <p className="font-medium">Privacy & Security</p>
              <p>Your API key is stored locally in your browser and is never transmitted to our servers. 
              The key is used only to make direct API calls to the Federal Reserve Economic Data service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Use */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-3">FRED API Terms of Use</h3>
        <p className="text-gray-600 text-sm mb-3">
          By using the FRED API, you agree to comply with the Federal Reserve Bank of St. Louis terms of use.
        </p>
        <a
          href="https://fred.stlouisfed.org/docs/api/terms_of_use.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-aegis-600 hover:text-aegis-700 text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View FRED API Terms of Use</span>
        </a>
      </div>
    </div>
  )
} 
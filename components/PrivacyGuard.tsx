'use client'

import React, { useState } from 'react'
import { Shield, Lock, Eye, EyeOff, Database, Server, Smartphone, Globe } from 'lucide-react'

interface PrivacyFeature {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'inactive'
}

export default function PrivacyGuard() {
  const [showDataDetails, setShowDataDetails] = useState(false)

  const privacyFeatures: PrivacyFeature[] = [
    {
      title: 'Local Data Storage',
      description: 'All your data is stored locally on your device using encrypted storage',
      icon: Smartphone,
      status: 'active'
    },
    {
      title: 'No Cloud Sync',
      description: 'Your data never leaves your device or gets uploaded to external servers',
      icon: Server,
      status: 'active'
    },
    {
      title: 'Local AI Processing',
      description: 'All AI analysis is performed on your device using local algorithms',
      icon: Database,
      status: 'active'
    },
    {
      title: 'No Data Mining',
      description: 'We do not collect, analyze, or sell any of your personal information',
      icon: EyeOff,
      status: 'active'
    }
  ]

  const dataTypes = [
    { type: 'Financial Transactions', stored: 'Locally', encrypted: true },
    { type: 'Spending Patterns', stored: 'Locally', encrypted: true },
    { type: 'AI Insights', stored: 'Locally', encrypted: true },
    { type: 'User Preferences', stored: 'Locally', encrypted: true },
    { type: 'Analytics Data', stored: 'None', encrypted: false },
    { type: 'Personal Information', stored: 'None', encrypted: false }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Security</h2>
        <p className="text-gray-600">
          Your data sovereignty is fundamental to Aingen. Learn how we protect your privacy.
        </p>
      </div>

      {/* Privacy Status */}
      <div className="aegis-card">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Privacy Status: Secure</h3>
            <p className="text-sm text-gray-600">
              All data processing happens locally on your device. No data is transmitted to external servers.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">100% Private</div>
            <div className="text-xs text-gray-500">No external access</div>
          </div>
        </div>
      </div>

      {/* Privacy Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {privacyFeatures.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="aegis-card">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  feature.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    feature.status === 'active' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feature.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data Handling */}
      <div className="aegis-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Database className="h-5 w-5 text-aegis-600" />
            <span>Data Handling</span>
          </h3>
          <button
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="aegis-button-secondary text-sm"
          >
            {showDataDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDataDetails && (
          <div className="space-y-3">
            {dataTypes.map((dataType, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{dataType.type}</div>
                  <div className="text-sm text-gray-600">
                    Stored: {dataType.stored}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {dataType.encrypted ? (
                      <Lock className="h-4 w-4 text-green-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      dataType.encrypted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {dataType.encrypted ? 'Encrypted' : 'Not Stored'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Principles */}
      <div className="aegis-card">
        <h3 className="text-lg font-semibold mb-4">Our Privacy Principles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Data Sovereignty</h4>
                <p className="text-sm text-gray-600">
                  You own your data completely. We provide tools to help you manage it, but never claim ownership.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Local Processing</h4>
                <p className="text-sm text-gray-600">
                  All AI analysis and data processing happens on your device, ensuring complete privacy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <EyeOff className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">No Surveillance</h4>
                <p className="text-sm text-gray-600">
                  We don&apos;t track your behavior, collect analytics, or build profiles of your activities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-liberty-100 rounded-lg">
                <Globe className="h-5 w-5 text-liberty-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Transparency</h4>
                <p className="text-sm text-gray-600">
                  Open source code and clear documentation of how your data is handled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Commitment */}
      <div className="aegis-card bg-gradient-to-r from-aegis-50 to-liberty-50 border-aegis-200">
        <div className="text-center">
          <Shield className="h-12 w-12 text-aegis-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Our Commitment to You</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aingen is built on the principle that technology should serve human flourishing, 
            not extract value from human attention. Your privacy is not a feature—it&apos;s the foundation 
            of everything we build.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            &quot;We hold these truths to be self-evident, that all people are endowed with certain unalienable rights...&quot;
          </div>
        </div>
      </div>
    </div>
  )
} 
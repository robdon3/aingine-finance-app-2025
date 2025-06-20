'use client'

import React, { useState, useEffect } from 'react'
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Server, Database, GitBranch, Clock, TrendingUp } from 'lucide-react'

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown'
  lastCheck: string | null
  details: any
}

interface HealthReport {
  timestamp: string
  overall: string
  services: {
    vercel: HealthStatus
    redis: HealthStatus
    github: HealthStatus
  }
  summary: {
    healthy: number
    warning: number
    error: number
    unknown: number
  }
}

export default function MonitoringDashboard() {
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchHealthReport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        setHealthReport(data)
        setLastRefresh(new Date())
      } else {
        throw new Error('Failed to fetch health report')
      }
    } catch (error) {
      console.error('Failed to fetch health report:', error)
      // Fallback to mock data if API fails
      const mockReport: HealthReport = {
        timestamp: new Date().toISOString(),
        overall: 'unknown',
        services: {
          vercel: {
            status: 'unknown',
            lastCheck: null,
            details: {}
          },
          redis: {
            status: 'unknown',
            lastCheck: null,
            details: {}
          },
          github: {
            status: 'unknown',
            lastCheck: null,
            details: {}
          }
        },
        summary: {
          healthy: 0,
          warning: 0,
          error: 0,
          unknown: 3
        }
      }
      setHealthReport(mockReport)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthReport()
    const interval = setInterval(fetchHealthReport, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700'
      case 'error':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  if (loading && !healthReport) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-aegis-600 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading monitoring data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">System Monitoring</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time health status of your infrastructure</p>
        </div>
        <div className="flex items-center space-x-3">
          {lastRefresh && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          )}
          <button
            onClick={fetchHealthReport}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {healthReport && (
        <div className={`p-6 rounded-lg border ${getStatusBgColor(healthReport.overall)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(healthReport.overall)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Overall System Status: {healthReport.overall.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date(healthReport.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {healthReport.summary.healthy}/{healthReport.summary.healthy + healthReport.summary.warning + healthReport.summary.error}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Services Healthy</div>
            </div>
          </div>
        </div>
      )}

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vercel Status */}
        <div className={`p-6 rounded-lg border ${getStatusBgColor(healthReport?.services.vercel.status || 'unknown')}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-aegis-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Vercel</h3>
            </div>
            {getStatusIcon(healthReport?.services.vercel.status || 'unknown')}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(healthReport?.services.vercel.status || 'unknown')}`}>
                {healthReport?.services.vercel.status || 'Unknown'}
              </span>
            </div>
            
            {healthReport?.services.vercel.details && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Latest Deployment:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.vercel.details.latestDeployment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Deployments:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.vercel.details.totalDeployments}
                  </span>
                </div>
              </>
            )}
            
            {healthReport?.services.vercel.lastCheck && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last check: {new Date(healthReport.services.vercel.lastCheck).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Redis Status */}
        <div className={`p-6 rounded-lg border ${getStatusBgColor(healthReport?.services.redis.status || 'unknown')}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-aegis-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upstash Redis</h3>
            </div>
            {getStatusIcon(healthReport?.services.redis.status || 'unknown')}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(healthReport?.services.redis.status || 'unknown')}`}>
                {healthReport?.services.redis.status || 'Unknown'}
              </span>
            </div>
            
            {healthReport?.services.redis.details && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Connection:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.redis.details.connection}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Operations:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.redis.details.operations}
                  </span>
                </div>
              </>
            )}
            
            {healthReport?.services.redis.lastCheck && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last check: {new Date(healthReport.services.redis.lastCheck).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* GitHub Status */}
        <div className={`p-6 rounded-lg border ${getStatusBgColor(healthReport?.services.github.status || 'unknown')}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-aegis-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">GitHub</h3>
            </div>
            {getStatusIcon(healthReport?.services.github.status || 'unknown')}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(healthReport?.services.github.status || 'unknown')}`}>
                {healthReport?.services.github.status || 'Unknown'}
              </span>
            </div>
            
            {healthReport?.services.github.details && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Repository:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.github.details.repository}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Visibility:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {healthReport.services.github.details.visibility}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Last commit: {healthReport.services.github.details.lastCommit}
                </div>
              </>
            )}
            
            {healthReport?.services.github.lastCheck && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last check: {new Date(healthReport.services.github.lastCheck).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-aegis-600" />
          <span>Performance Metrics</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {healthReport?.summary.healthy || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Healthy Services</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {healthReport?.summary.warning || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {healthReport?.summary.error || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {healthReport?.summary.unknown || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unknown</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
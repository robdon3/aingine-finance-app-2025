'use client'

import { 
  Database, 
  Shield,
  CheckCircle,
  Info
} from 'lucide-react'

export default function CensusDataInfo() {
  return (
    <div className="aegis-card">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Census Bureau Data Information</h3>
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-700 font-medium">Using Public Census Data</span>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">About Census Data</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• <strong>Data Source:</strong> Public U.S. Census Bureau data (2020 Census & ACS Estimates)</li>
                <li>• <strong>No API Key Required:</strong> Using publicly available datasets</li>
                <li>• <strong>Data Includes:</strong> Population, median income, poverty rates, housing units</li>
                <li>• <strong>Coverage:</strong> All 50 states plus District of Columbia</li>
                <li>• <strong>Reliability:</strong> Official government data from Census Bureau</li>
                <li>• <strong>Updates:</strong> Data reflects 2020 Census and recent ACS estimates</li>
              </ul>
              <p className="text-blue-800 text-sm mt-2">
                <strong>Note:</strong> This data is sourced from publicly available Census Bureau datasets and does not require API authentication.
              </p>
              <p className="text-blue-800 text-sm mt-2">
                <strong>Data Sources:</strong> 
                <a href="https://www.census.gov/data.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-1">
                  Census Bureau Data Portal
                </a> and 
                <a href="https://www.census.gov/programs-surveys/acs/data.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-1">
                  American Community Survey
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Attribution</h4>
              <p className="text-gray-700 text-sm">
                This product uses publicly available U.S. Census Bureau data. The Census Bureau provides this data as a public service to support research, planning, and decision-making.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Source:</strong> U.S. Census Bureau Public Data (2020 Census & ACS Estimates)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
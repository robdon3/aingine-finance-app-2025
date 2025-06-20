import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const healthReportPath = path.join(process.cwd(), 'logs', 'health-report.json')
    
    // Check if health report exists
    if (!fs.existsSync(healthReportPath)) {
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        overall: 'unknown',
        services: {
          vercel: { status: 'unknown', lastCheck: null, details: {} },
          redis: { status: 'unknown', lastCheck: null, details: {} },
          github: { status: 'unknown', lastCheck: null, details: {} }
        },
        summary: { healthy: 0, warning: 0, error: 0, unknown: 3 }
      })
    }

    // Read and parse health report
    const healthReportData = fs.readFileSync(healthReportPath, 'utf-8')
    const healthReport = JSON.parse(healthReportData)

    return NextResponse.json(healthReport)
  } catch (error) {
    console.error('Error reading health report:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: 'error',
      services: {
        vercel: { status: 'error', lastCheck: null, details: { error: 'Failed to read health report' } },
        redis: { status: 'error', lastCheck: null, details: { error: 'Failed to read health report' } },
        github: { status: 'error', lastCheck: null, details: { error: 'Failed to read health report' } }
      },
      summary: { healthy: 0, warning: 0, error: 3, unknown: 0 }
    }, { status: 500 })
  }
} 
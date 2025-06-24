import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seriesId = searchParams.get('series_id')
    const apiKey = searchParams.get('api_key')
    const fileType = searchParams.get('file_type') || 'json'

    if (!seriesId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: series_id and api_key' },
        { status: 400 }
      )
    }

    // Construct FRED API URL for series info
    const fredUrl = `https://api.stlouisfed.org/fred/series?series_id=${seriesId}&api_key=${apiKey}&file_type=${fileType}`

    console.log('Making FRED API series info request:', fredUrl)

    // Make request to FRED API from server side (no CORS issues)
    const response = await fetch(fredUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProjectAegis/1.0 (Financial Planning Application)'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FRED API series info error:', response.status, errorText)
      return NextResponse.json(
        { error: `FRED API returned ${response.status}: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Return the FRED API response with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Proxy series info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

// Removed unused POST function 
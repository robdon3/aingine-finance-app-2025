import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchText = searchParams.get('search_text')
    const apiKey = searchParams.get('api_key')
    const fileType = searchParams.get('file_type') || 'json'
    const limit = searchParams.get('limit') || '10'

    if (!searchText || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters: search_text and api_key' },
        { status: 400 }
      )
    }

    // Construct FRED API URL for search
    const fredUrl = `https://api.stlouisfed.org/fred/series/search?search_text=${encodeURIComponent(searchText)}&api_key=${apiKey}&file_type=${fileType}&limit=${limit}`

    console.log('Making FRED API search request:', fredUrl)

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
      console.error('FRED API search error:', response.status, errorText)
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
    console.error('Proxy search error:', error)
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
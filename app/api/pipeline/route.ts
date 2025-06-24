import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('Pipeline GET request received:', {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  })

  return NextResponse.json({
    message: 'Pipeline endpoint is not implemented',
    status: 'not_found',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: 'GET',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  }, { status: 404 })
}

export async function POST(request: NextRequest) {
  console.log('Pipeline POST request received:', {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  })

  return NextResponse.json({
    message: 'Pipeline endpoint is not implemented',
    status: 'not_found',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: 'POST',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  }, { status: 404 })
}

export async function PUT(request: NextRequest) {
  console.log('Pipeline PUT request received:', {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  })

  return NextResponse.json({
    message: 'Pipeline endpoint is not implemented',
    status: 'not_found',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: 'PUT',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  }, { status: 404 })
}

export async function DELETE(request: NextRequest) {
  console.log('Pipeline DELETE request received:', {
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  })

  return NextResponse.json({
    message: 'Pipeline endpoint is not implemented',
    status: 'not_found',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: 'DELETE',
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    }
  }, { status: 404 })
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
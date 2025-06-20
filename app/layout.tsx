import React from 'react'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Aegis - Engine for the People',
  description: 'Personal agency through data and AI. Privacy-first tools for wealth generation and informed decision making.',
  keywords: ['personal finance', 'AI', 'privacy', 'agency', 'wealth generation', 'time value'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 
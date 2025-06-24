import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Aingen - Engine for the People',
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
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 
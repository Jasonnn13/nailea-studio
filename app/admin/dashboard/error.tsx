'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4">
      <Card className="p-8 max-w-md text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl text-foreground mb-2">Dashboard Error</h2>
        <p className="text-foreground/60 text-sm mb-6">
          There was a problem loading the dashboard. This could be a temporary issue.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="sm">
            Retry
          </Button>
          <Button onClick={() => window.location.href = '/admin/dashboard'} variant="outline" size="sm">
            Refresh page
          </Button>
        </div>
      </Card>
    </div>
  )
}

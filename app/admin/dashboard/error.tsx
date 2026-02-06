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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/15 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="relative z-10 p-8 max-w-md text-center border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl text-foreground mb-2 tracking-wider">Dashboard Error</h2>
        <p className="text-foreground/40 text-sm mb-6">
          There was a problem loading the dashboard. This could be a temporary issue.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="sm" className="rounded-full px-6">
            Retry
          </Button>
          <Button onClick={() => window.location.href = '/admin/dashboard'} variant="outline" size="sm" className="rounded-full px-6 border-foreground/10 text-foreground/60 hover:bg-foreground/5">
            Refresh page
          </Button>
        </div>
      </Card>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/60 backdrop-blur-xl">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/admin/dashboard" className="group flex items-center space-x-2">
            <div className="text-center">
              <div className="font-script text-3xl text-primary drop-shadow-[0_0_12px_var(--color-primary)] group-hover:drop-shadow-[0_0_20px_var(--color-primary)] transition-all duration-300">Nailea</div>
              <div className="text-[10px] tracking-[0.3em] font-semibold text-foreground/50 uppercase">Studio Admin</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Status dot */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-foreground/50 font-medium">Online</span>
            </div>

            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-foreground/10 text-foreground/60 hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20 bg-transparent rounded-full px-5 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

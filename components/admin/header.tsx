'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="text-center">
              <div className="font-script text-3xl text-primary">Nailea</div>
              <div className="text-xs tracking-widest font-semibold text-foreground">ADMIN</div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-foreground/60">Admin</span>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

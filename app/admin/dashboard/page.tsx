'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { AdminHeader } from '@/components/admin/header'
import { StatsCard } from '@/components/admin/stats-card'

type TabType = 'overview' | 'services' | 'bookings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="font-heading text-4xl text-foreground mb-2 tracking-wider">DASHBOARD</h1>
          <p className="text-foreground/60">Manage your studio operations and bookings</p>
        </div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard title="Total Services" value="20" icon="💅" />
            <StatsCard title="Bookings Today" value="12" icon="📅" />
            <StatsCard title="Revenue This Month" value="Rp 2.5M" icon="💰" />
            <StatsCard title="Customer Rating" value="4.8/5" icon="⭐" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-accent/20 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm tracking-wide transition-all ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary -mb-4'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium text-sm tracking-wide transition-all ${
              activeTab === 'services'
                ? 'text-primary border-b-2 border-primary -mb-4'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            SERVICES
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium text-sm tracking-wide transition-all ${
              activeTab === 'bookings'
                ? 'text-primary border-b-2 border-primary -mb-4'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            BOOKINGS
          </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'overview' && (
            <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-8">
              <h2 className="font-heading text-2xl text-foreground mb-6 tracking-wider">RECENT BOOKINGS</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-accent/10">
                    <div>
                      <p className="font-medium text-foreground">Booking #{1000 + item}</p>
                      <p className="text-sm text-foreground/60">Standard Manicure + Art Design</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">Rp 100.000</p>
                      <p className="text-sm text-foreground/60">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'bookings' && <BookingsManager />}
        </div>
      </main>
    </div>
  )
}

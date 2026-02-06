'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Dropdown } from '@/components/ui/dropdown'
import { AdminHeader } from '@/components/admin/header'
import { JasaManager } from '@/components/admin/jasa-manager'
import { ItemManager } from '@/components/admin/item-manager'
import { CustomerManager } from '@/components/admin/customer-manager'
import { StaffManager } from '@/components/admin/staff-manager'
import { TransaksiJasaManager } from '@/components/admin/transaksi-jasa-manager'
import { TransaksiItemManager } from '@/components/admin/transaksi-item-manager'
import { authFetch } from '@/lib/api'
import { DataCacheProvider } from '@/lib/dataCache'
import gsap from 'gsap'

type TabType = 'overview' | 'jasa' | 'item' | 'customer' | 'staff' | 'transaksi-jasa' | 'transaksi-item'

type PaymentType = 'CASH' | 'TRANSFER' | 'QRIS'

type TransaksiJasa = {
  uid: string
  tanggal: string
  total: number
  status: string
  payment: PaymentType
  customer: { nama: string }
  detail: { jasa: { nama: string } }[]
}

type TransaksiItem = {
  uid: string
  tanggal: string
  total: number
  status: string
  payment: PaymentType
  customer: { nama: string }
  detail: { item: { nama: string } }[]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return

    // Animate out → swap → animate in
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setActiveTab(newTab)
          if (contentRef.current) {
            gsap.fromTo(contentRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.35, ease: 'power2.out' }
            )
          }
        }
      })
    } else {
      setActiveTab(newTab)
    }
  }

  // GSAP entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
        )
      }
      if (tabsRef.current) {
        gsap.fromTo(tabsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.25 }
        )
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.4 }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('authToken')
    router.push('/')
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'transaksi-jasa', label: 'Service Transaction' },
    { id: 'transaksi-item', label: 'Product Transaction' },
    { id: 'customer', label: 'Customer' },
    { id: 'jasa', label: 'Service' },
    { id: 'item', label: 'Product' },
    { id: 'staff', label: 'Staff' },
  ]

  return (
    <DataCacheProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/15 relative overflow-hidden">
        {/* Ambient background orbs */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary/8 blur-3xl animate-float-delayed" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-3xl animate-float" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10">
          <AdminHeader onLogout={handleLogout} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div ref={headerRef} className="mb-6 md:mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary/70 tracking-wide">Control Panel</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2 tracking-wider">Dashboard</h1>
              <p className="text-foreground/40 text-sm md:text-base">Manage your studio operations and bookings</p>
            </div>

            {/* Mobile Navigation - Dropdown */}
            <div ref={tabsRef} className="md:hidden mb-6">
              <Dropdown
                value={activeTab}
                onChange={(value) => handleTabChange(value as TabType)}
                options={tabs.map(tab => ({
                  value: tab.id,
                  label: tab.label
                }))}
                placeholder="Select a section"
              />
            </div>

            {/* Desktop Navigation - Pill Tabs */}
            <div ref={tabsRef} className="hidden md:flex gap-1 mb-8 p-1.5 rounded-2xl bg-foreground/[0.02] border border-foreground/5 backdrop-blur-sm w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div ref={contentRef} className="min-h-[60vh]">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'transaksi-jasa' && <TransaksiJasaManager />}
              {activeTab === 'transaksi-item' && <TransaksiItemManager />}
              {activeTab === 'customer' && <CustomerManager />}
              {activeTab === 'staff' && <StaffManager />}
              {activeTab === 'jasa' && <JasaManager />}
              {activeTab === 'item' && <ItemManager />}
            </div>
          </main>
        </div>
      </div>
    </DataCacheProvider>
  )
}

type TransaksiData = {
  type: 'jasa' | 'item'
  uid: string
  customer: string
  detail: string
  total: number
  status: string
  tanggal: string
  payment: PaymentType
}

function OverviewTab() {
  const [allTransaksi, setAllTransaksi] = useState<TransaksiData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [showAmounts, setShowAmounts] = useState(false)
  const overviewRef = useRef<HTMLDivElement>(null)

  // GSAP stagger animation for overview sections
  useEffect(() => {
    if (loading || !overviewRef.current) return
    const items = overviewRef.current.querySelectorAll('[data-animate="item"]')
    if (items.length === 0) return

    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    )
  }, [loading])

  const formatAmount = (amount: number) => {
    return showAmounts ? `Rp ${amount.toLocaleString()}` : '••••••••'
  }

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const [jasaRes, itemRes] = await Promise.all([
          authFetch('/api/admin/transaksi-jasa'),
          authFetch('/api/admin/transaksi-item')
        ])

        const combined: TransaksiData[] = []

        if (jasaRes.ok) {
          const jasaData = await jasaRes.json()
          console.log('Jasa Data:', jasaData)
          jasaData.forEach((t: TransaksiJasa) => {
            combined.push({
              type: 'jasa',
              uid: t.uid,
              customer: t.customer.nama,
              detail: t.detail.map(d => d.jasa.nama).join(', '),
              total: Number(t.total),
              status: t.status,
              tanggal: t.tanggal,
              payment: t.payment || 'CASH'
            })
          })
        }

        if (itemRes.ok) {
          const itemData = await itemRes.json()
          console.log('Item Data:', itemData)
          itemData.forEach((t: TransaksiItem) => {
            combined.push({
              type: 'item',
              uid: t.uid,
              customer: t.customer.nama,
              detail: t.detail.map(d => d.item.nama).join(', '),
              total: Number(t.total),
              status: t.status,
              tanggal: t.tanggal,
              payment: t.payment || 'CASH'
            })
          })
        }

        combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
        console.log('Combined Data:', combined)
        console.log('Total transactions:', combined.length)
        setAllTransaksi(combined)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllTransactions()
  }, [])

  // Filter by period
  const getFilteredByPeriod = () => {
    const now = new Date()
    return allTransaksi.filter(t => {
      const date = new Date(t.tanggal)
      if (selectedPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return date >= weekAgo
      } else if (selectedPeriod === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      } else {
        return date.getFullYear() === now.getFullYear()
      }
    })
  }

  const filteredTransaksi = getFilteredByPeriod()
  const completedTransaksi = filteredTransaksi.filter(t => t.status === 'SELESAI')
  const pendingTransaksi = filteredTransaksi.filter(t => t.status === 'PENDING')
  const cancelledTransaksi = filteredTransaksi.filter(t => t.status === 'BATAL')

  // Calculate totals
  const totalRevenue = completedTransaksi.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = completedTransaksi.length
  const serviceTransactions = completedTransaksi.filter(t => t.type === 'jasa').length
  const productTransactions = completedTransaksi.filter(t => t.type === 'item').length

  // Payment breakdown (only completed)
  const paymentBreakdown = {
    CASH: completedTransaksi.filter(t => t.payment === 'CASH').reduce((sum, t) => sum + t.total, 0),
    TRANSFER: completedTransaksi.filter(t => t.payment === 'TRANSFER').reduce((sum, t) => sum + t.total, 0),
    QRIS: completedTransaksi.filter(t => t.payment === 'QRIS').reduce((sum, t) => sum + t.total, 0)
  }

  // Transaction count by payment
  const paymentCount = {
    CASH: completedTransaksi.filter(t => t.payment === 'CASH').length,
    TRANSFER: completedTransaksi.filter(t => t.payment === 'TRANSFER').length,
    QRIS: completedTransaksi.filter(t => t.payment === 'QRIS').length
  }

  // Type breakdown (only completed)
  const typeBreakdown = {
    jasa: completedTransaksi.filter(t => t.type === 'jasa').reduce((sum, t) => sum + t.total, 0),
    item: completedTransaksi.filter(t => t.type === 'item').reduce((sum, t) => sum + t.total, 0)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/5 blur-xl" />
        </div>
        <p className="text-foreground/30 text-sm tracking-wide">Loading overview...</p>
      </div>
    )
  }

  const periodLabels = {
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
  }

  return (
    <div ref={overviewRef} className="space-y-6">
      {/* Period Selector & Privacy Toggle */}
      <div className="flex flex-wrap justify-between items-center gap-4" data-animate="item">
        <div className="flex gap-1 p-1 rounded-xl bg-foreground/[0.02] border border-foreground/5">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-foreground/40 hover:text-foreground/60 border border-transparent'
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAmounts(!showAmounts)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/[0.02] border border-foreground/5 text-foreground/40 hover:text-foreground/60 hover:border-foreground/10 transition-all duration-300"
        >
          {showAmounts ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
          <span className="text-sm">{showAmounts ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-animate="item">
        <Card className="group border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/10 group-hover:border-green-500/20 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400 mt-0.5">{formatAmount(totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="group border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/10 group-hover:border-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">Transactions</p>
              <p className="text-2xl font-bold text-blue-400 mt-0.5">{totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="group border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-500/10 group-hover:border-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">Services</p>
              <p className="text-2xl font-bold text-purple-400 mt-0.5">{serviceTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="group border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/10 group-hover:border-orange-500/20 transition-colors">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">Products</p>
              <p className="text-2xl font-bold text-orange-400 mt-0.5">{productTransactions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-animate="item">
        {/* Revenue by Payment Method */}
        <Card className="border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Revenue by Payment Method</h3>
          <div className="space-y-5">
            {[
              { key: 'CASH', label: 'Cash', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgLight: 'bg-emerald-500/10' },
              { key: 'TRANSFER', label: 'Transfer Bank', color: 'bg-blue-500', textColor: 'text-blue-400', bgLight: 'bg-blue-500/10' },
              { key: 'QRIS', label: 'QRIS', color: 'bg-violet-500', textColor: 'text-violet-400', bgLight: 'bg-violet-500/10' }
            ].map(({ key, label, color, textColor, bgLight }) => {
              const amount = paymentBreakdown[key as PaymentType]
              const count = paymentCount[key as PaymentType]
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-foreground/70 text-sm">{label}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium text-sm ${textColor}`}>{formatAmount(amount)}</span>
                      <span className="text-foreground/30 text-xs ml-2">({count})</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-foreground/5">
            <div className="flex justify-between">
              <span className="text-foreground/50 text-sm">Total</span>
              <span className="font-bold text-primary">{formatAmount(totalRevenue)}</span>
            </div>
          </div>
        </Card>

        {/* Revenue by Type & Status */}
        <Card className="border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Transaction Summary</h3>
          
          {/* By Type */}
          <div className="mb-6">
            <h4 className="text-xs text-foreground/30 mb-3 tracking-wide uppercase">Revenue by Type</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-purple-400/70 text-xs uppercase tracking-wide">Services</p>
                <p className="text-xl font-bold text-purple-400 mt-1">{formatAmount(typeBreakdown.jasa)}</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-orange-400/70 text-xs uppercase tracking-wide">Products</p>
                <p className="text-xl font-bold text-orange-400 mt-1">{formatAmount(typeBreakdown.item)}</p>
              </div>
            </div>
          </div>

          {/* By Status */}
          <div>
            <h4 className="text-xs text-foreground/30 mb-3 tracking-wide uppercase">Status</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                <p className="text-2xl font-bold text-green-400">{completedTransaksi.length}</p>
                <p className="text-green-400/60 text-[10px] uppercase tracking-wider mt-1">Completed</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                <p className="text-2xl font-bold text-yellow-400">{pendingTransaksi.length}</p>
                <p className="text-yellow-400/60 text-[10px] uppercase tracking-wider mt-1">Pending</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                <p className="text-2xl font-bold text-red-400">{cancelledTransaksi.length}</p>
                <p className="text-red-400/60 text-[10px] uppercase tracking-wider mt-1">Cancelled</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-foreground/5 bg-background/40 backdrop-blur-xl rounded-2xl p-6" data-animate="item">
        <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Recent Transactions</h3>
        <div className="space-y-2">
          {allTransaksi.slice(0, 8).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-foreground/30 text-sm">No recent transactions</p>
            </div>
          ) : (
            allTransaksi.slice(0, 8).map((t) => (
              <div key={t.uid} className="group flex items-start justify-between p-4 rounded-xl bg-foreground/[0.01] border border-foreground/5 hover:bg-foreground/[0.03] hover:border-foreground/10 transition-all duration-300 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-sm text-foreground/70">#{t.uid.slice(0, 8)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium whitespace-nowrap ${
                      t.type === 'jasa' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' : 'bg-orange-500/10 text-orange-400 border border-orange-500/10'
                    }`}>
                      {t.type === 'jasa' ? 'Service' : 'Product'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium whitespace-nowrap ${
                      t.payment === 'CASH' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                      t.payment === 'TRANSFER' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                      'bg-violet-500/10 text-violet-400 border border-violet-500/10'
                    }`}>
                      {t.payment}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/50 truncate mt-1">{t.customer} &middot; {t.detail}</p>
                  <p className="text-[11px] text-foreground/25 mt-1">{new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-primary whitespace-nowrap">{formatAmount(t.total)}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${
                    t.status === 'SELESAI' ? 'text-green-400' :
                    t.status === 'BATAL' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

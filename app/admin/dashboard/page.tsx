'use client'

import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 md:mb-10">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2 tracking-wider">Dashboard</h1>
          <p className="text-foreground/60 text-sm md:text-base">Manage your studio operations and bookings</p>
        </div>

        {/* Mobile Navigation - Dropdown */}
        <div className="md:hidden mb-6">
          <Dropdown
            value={activeTab}
            onChange={(value) => setActiveTab(value as TabType)}
            options={tabs.map(tab => ({
              value: tab.id,
              label: tab.label
            }))}
            placeholder="Select a section"
          />
        </div>

        {/* Desktop Navigation - Tabs */}
        <div className="hidden md:flex gap-2 mb-8 border-b border-accent/20 pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary -mb-4'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-300">
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
  const totalTransactions = filteredTransaksi.length
  const serviceTransactions = filteredTransaksi.filter(t => t.type === 'jasa').length
  const productTransactions = filteredTransaksi.filter(t => t.type === 'item').length

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
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  const periodLabels = {
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
  }

  return (
    <div className="space-y-6">
      {/* Period Selector & Privacy Toggle */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/50 text-foreground/60 hover:bg-accent/20'
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAmounts(!showAmounts)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 text-foreground/60 hover:bg-accent/20 transition-all"
        >
          {showAmounts ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
          <span className="text-sm">{showAmounts ? 'Hide' : 'Show'} Amounts</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">{formatAmount(totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-400">{totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Services</p>
              <p className="text-2xl font-bold text-purple-400">{serviceTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-500/20">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Products</p>
              <p className="text-2xl font-bold text-orange-400">{productTransactions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Payment Method */}
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Revenue by Payment Method</h3>
          <div className="space-y-4">
            {[
              { key: 'CASH', label: 'Cash', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
              { key: 'TRANSFER', label: 'Transfer Bank', color: 'bg-blue-500', textColor: 'text-blue-400' },
              { key: 'QRIS', label: 'QRIS', color: 'bg-violet-500', textColor: 'text-violet-400' }
            ].map(({ key, label, color, textColor }) => {
              const amount = paymentBreakdown[key as PaymentType]
              const count = paymentCount[key as PaymentType]
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">{label}</span>
                    <div className="text-right">
                      <span className={`font-medium ${textColor}`}>{formatAmount(amount)}</span>
                      <span className="text-foreground/40 text-sm ml-2">({count} transaksi)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-accent/20">
            <div className="flex justify-between">
              <span className="text-foreground font-medium">Total</span>
              <span className="font-bold text-primary">{formatAmount(totalRevenue)}</span>
            </div>
          </div>
        </Card>

        {/* Revenue by Type & Status */}
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Transaction Summary</h3>
          
          {/* By Type */}
          <div className="mb-6">
            <h4 className="text-sm text-foreground/60 mb-3">Revenue by Type</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 text-sm">Services</p>
                <p className="text-xl font-bold text-purple-400">{formatAmount(typeBreakdown.jasa)}</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-orange-400 text-sm">Products</p>
                <p className="text-xl font-bold text-orange-400">{formatAmount(typeBreakdown.item)}</p>
              </div>
            </div>
          </div>

          {/* By Status */}
          <div>
            <h4 className="text-sm text-foreground/60 mb-3">Transaction Status</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-2xl font-bold text-green-400">{completedTransaksi.length}</p>
                <p className="text-green-400 text-xs">Completed</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                <p className="text-2xl font-bold text-yellow-400">{pendingTransaksi.length}</p>
                <p className="text-yellow-400 text-xs">Pending</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-2xl font-bold text-red-400">{cancelledTransaksi.length}</p>
                <p className="text-red-400 text-xs">Cancelled</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="font-heading text-xl text-foreground mb-6 tracking-wider">Recent Transactions</h3>
        <div className="space-y-3">
          {allTransaksi.slice(0, 8).length === 0 ? (
            <p className="text-foreground/60 text-center py-8">No recent transactions</p>
          ) : (
            allTransaksi.slice(0, 8).map((t) => (
              <div key={t.uid} className="flex items-start justify-between p-4 rounded-lg bg-background/30 border border-accent/10 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">#{t.uid.slice(0, 8)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                      t.type === 'jasa' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {t.type === 'jasa' ? 'Service' : 'Product'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                      t.payment === 'CASH' ? 'bg-emerald-500/20 text-emerald-400' :
                      t.payment === 'TRANSFER' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-violet-500/20 text-violet-400'
                    }`}>
                      {t.payment}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60 truncate mt-1">{t.customer} • {t.detail}</p>
                  <p className="text-xs text-foreground/40 mt-1">{new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-primary whitespace-nowrap">{formatAmount(t.total)}</p>
                  <span className={`text-xs ${
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

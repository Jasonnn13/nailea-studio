'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminHeader } from '@/components/admin/header'
import QRCode from 'qrcode'
import Barcode from 'react-barcode'

// Helper to get auth headers for API calls
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Helper for fetch with credentials (sends httpOnly cookie)
const authFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })
}

type TabType = 'overview' | 'jasa' | 'item' | 'transaksi-jasa' | 'transaksi-item'

type Jasa = {
  id: number
  uid: string
  nama: string
  deskripsi: string | null
  harga: number
  durasi: number | null
  kategori: string | null
  aktif: boolean
}

type Item = {
  id: number
  uid: string
  nama: string
  deskripsi: string | null
  harga: number
  stok: number
  kategori: string | null
  aktif: boolean
}

type Customer = {
  id: number
  uid: string
  nama: string
  email: string | null
  telepon: string | null
}

type TransaksiJasa = {
  id: number
  uid: string
  customerId: number
  userId: number
  tanggal: string
  total: number
  status: 'PENDING' | 'SELESAI' | 'BATAL'
  catatan: string | null
  customer: Customer
  detail: { jasa: Jasa; jumlah: number; harga: number }[]
}

type TransaksiItem = {
  id: number
  uid: string
  customerId: number
  userId: number
  tanggal: string
  total: number
  status: 'PENDING' | 'SELESAI' | 'BATAL'
  catatan: string | null
  customer: Customer
  detail: { item: Item; jumlah: number; harga: number }[]
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
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'transaksi-jasa', label: 'TRANSAKSI JASA' },
    { id: 'transaksi-item', label: 'TRANSAKSI ITEM' },
    { id: 'jasa', label: 'JASA' },
    { id: 'item', label: 'ITEM' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="font-heading text-4xl text-foreground mb-2 tracking-wider">DASHBOARD</h1>
          <p className="text-foreground/60">Manage your studio operations and bookings</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-accent/20 pb-4 overflow-x-auto">
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
          {activeTab === 'jasa' && <JasaManager />}
          {activeTab === 'item' && <ItemManager />}
        </div>
      </main>
    </div>
  )
}

function OverviewTab() {
  const [recentTransaksi, setRecentTransaksi] = useState<{
    type: 'jasa' | 'item'
    uid: string
    customer: string
    detail: string
    total: number
    status: string
    tanggal: string
  }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const [jasaRes, itemRes] = await Promise.all([
          authFetch('/api/admin/transaksi-jasa'),
          authFetch('/api/admin/transaksi-item')
        ])

        const combined: typeof recentTransaksi = []

        if (jasaRes.ok) {
          const jasaData = await jasaRes.json()
          jasaData.forEach((t: TransaksiJasa) => {
            combined.push({
              type: 'jasa',
              uid: t.uid,
              customer: t.customer.nama,
              detail: t.detail.map(d => d.jasa.nama).join(', '),
              total: Number(t.total),
              status: t.status,
              tanggal: t.tanggal
            })
          })
        }

        if (itemRes.ok) {
          const itemData = await itemRes.json()
          itemData.forEach((t: TransaksiItem) => {
            combined.push({
              type: 'item',
              uid: t.uid,
              customer: t.customer.nama,
              detail: t.detail.map(d => d.item.nama).join(', '),
              total: Number(t.total),
              status: t.status,
              tanggal: t.tanggal
            })
          })
        }

        // Sort by date descending and take top 10
        combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
        setRecentTransaksi(combined.slice(0, 10))
      } catch (error) {
        console.error('Failed to fetch recent transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentTransactions()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  return (
    <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-8">
      <h2 className="font-heading text-2xl text-foreground mb-6 tracking-wider">RECENT ACTIVITY</h2>
      <div className="space-y-4">
        {recentTransaksi.length === 0 ? (
          <p className="text-foreground/60 text-center py-8">No recent transactions</p>
        ) : (
          recentTransaksi.map((t) => (
            <div key={t.uid} className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-accent/10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">#{t.uid.slice(0, 8)}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    t.type === 'jasa' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {t.type === 'jasa' ? 'Service' : 'Product'}
                  </span>
                </div>
                <p className="text-sm text-foreground/60 truncate">{t.customer} • {t.detail}</p>
              </div>
              <div className="text-right ml-4">
                <p className="font-medium text-primary">Rp {t.total.toLocaleString()}</p>
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
  )
}

function JasaManager() {
  const [jasaList, setJasaList] = useState<Jasa[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJasa, setEditingJasa] = useState<Jasa | null>(null)

  const fetchJasa = async () => {
    try {
      const res = await authFetch('/api/admin/jasa')
      if (res.ok) {
        const data = await res.json()
        setJasaList(data)
      }
    } catch (error) {
      console.error('Failed to fetch jasa:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJasa()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      nama: formData.get('nama'),
      deskripsi: formData.get('deskripsi'),
      harga: parseFloat(formData.get('harga') as string),
      durasi: formData.get('durasi'),
      kategori: formData.get('kategori'),
      aktif: editingJasa ? editingJasa.aktif : true
    }

    try {
      const res = await authFetch(
        editingJasa ? `/api/admin/jasa/${editingJasa.uid}` : '/api/admin/jasa',
        {
          method: editingJasa ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      )

      if (res.ok) {
        fetchJasa()
        setShowForm(false)
        setEditingJasa(null)
      }
    } catch (error) {
      console.error('Failed to save jasa:', error)
    }
  }

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const res = await authFetch(`/api/admin/jasa/${uid}`, { 
        method: 'DELETE'
      })
      if (res.ok) {
        fetchJasa()
      }
    } catch (error) {
      console.error('Failed to delete jasa:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">MANAGE JASA</h2>
        <Button onClick={() => { setShowForm(true); setEditingJasa(null) }}>+ Add Jasa</Button>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">{editingJasa ? 'Edit' : 'Add'} Jasa</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Nama Jasa" defaultValue={editingJasa?.nama} required />
              <Input name="harga" type="number" placeholder="Harga" defaultValue={editingJasa?.harga} required />
              <Input name="durasi" type="number" placeholder="Durasi (menit)" defaultValue={editingJasa?.durasi || ''} />
              <Input name="kategori" placeholder="Kategori" defaultValue={editingJasa?.kategori || ''} />
            </div>
            <textarea
              name="deskripsi"
              placeholder="Deskripsi"
              defaultValue={editingJasa?.deskripsi || ''}
              className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit">{editingJasa ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingJasa(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Kategori</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Harga</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Durasi</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jasaList.map((jasa) => (
                <tr key={jasa.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground">{jasa.nama}</td>
                  <td className="py-3 px-4 text-foreground/60">{jasa.kategori || '-'}</td>
                  <td className="py-3 px-4 text-primary font-medium">Rp {Number(jasa.harga).toLocaleString()}</td>
                  <td className="py-3 px-4 text-foreground/60">{jasa.durasi ? `${jasa.durasi} min` : '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${jasa.aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {jasa.aktif ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingJasa(jasa); setShowForm(true) }}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(jasa.uid)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function ItemManager() {
  const [itemList, setItemList] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showBarcode, setShowBarcode] = useState<Item | null>(null)

  const fetchItems = async () => {
    try {
      const res = await authFetch('/api/admin/item')
      if (res.ok) {
        const data = await res.json()
        setItemList(data)
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      nama: formData.get('nama'),
      deskripsi: formData.get('deskripsi'),
      harga: parseFloat(formData.get('harga') as string),
      stok: formData.get('stok'),
      kategori: formData.get('kategori'),
      aktif: editingItem ? editingItem.aktif : true
    }

    try {
      const res = await authFetch(
        editingItem ? `/api/admin/item/${editingItem.uid}` : '/api/admin/item',
        {
          method: editingItem ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      )

      if (res.ok) {
        fetchItems()
        setShowForm(false)
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await authFetch(`/api/admin/item/${uid}`, { 
        method: 'DELETE'
      })
      if (res.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">MANAGE ITEMS</h2>
        <Button onClick={() => { setShowForm(true); setEditingItem(null) }}>+ Add Item</Button>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">{editingItem ? 'Edit' : 'Add'} Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Nama Item" defaultValue={editingItem?.nama} required />
              <Input name="harga" type="number" placeholder="Harga" defaultValue={editingItem?.harga} required />
              <Input name="stok" type="number" placeholder="Stok" defaultValue={editingItem?.stok || 0} />
              <Input name="kategori" placeholder="Kategori" defaultValue={editingItem?.kategori || ''} />
            </div>
            <textarea
              name="deskripsi"
              placeholder="Deskripsi"
              defaultValue={editingItem?.deskripsi || ''}
              className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {showBarcode && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading text-xl text-foreground mb-2">Barcode: {showBarcode.nama}</h3>
              <p className="text-foreground/60 mb-4">Item UID: {showBarcode.uid}</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <Barcode value={showBarcode.uid} width={2} height={80} fontSize={12} />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowBarcode(null)}>Close</Button>
          </div>
        </Card>
      )}

      <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Kategori</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Harga</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Stok</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((item) => (
                <tr key={item.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground">{item.nama}</td>
                  <td className="py-3 px-4 text-foreground/60">{item.kategori || '-'}</td>
                  <td className="py-3 px-4 text-primary font-medium">Rp {Number(item.harga).toLocaleString()}</td>
                  <td className="py-3 px-4 text-foreground/60">{item.stok}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.aktif ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowBarcode(item)}>Barcode</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingItem(item); setShowForm(true) }}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.uid)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function TransaksiJasaManager() {
  const [transaksiList, setTransaksiList] = useState<TransaksiJasa[]>([])
  const [jasaList, setJasaList] = useState<Jasa[]>([])
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [selectedTransaksi, setSelectedTransaksi] = useState<TransaksiJasa | null>(null)
  const [cart, setCart] = useState<{ jasaId: number; jumlah: number }[]>([])
  const [showReceipt, setShowReceipt] = useState<TransaksiJasa | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    try {
      const [transRes, jasaRes, custRes] = await Promise.all([
        authFetch('/api/admin/transaksi-jasa'),
        authFetch('/api/admin/jasa'),
        authFetch('/api/admin/customer')
      ])
      
      if (transRes.ok) setTransaksiList(await transRes.json())
      if (jasaRes.ok) setJasaList(await jasaRes.json())
      if (custRes.ok) setCustomerList(await custRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      customerId: parseInt(formData.get('customerId') as string),
      catatan: formData.get('catatan'),
      detail: cart
    }

    try {
      const res = await authFetch('/api/admin/transaksi-jasa', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (res.ok) {
        fetchData()
        setShowForm(false)
        setCart([])
      }
    } catch (error) {
      console.error('Failed to create transaksi:', error)
    }
  }

  const updateStatus = async (uid: string, status: string) => {
    try {
      const res = await authFetch(`/api/admin/transaksi-jasa/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const generateQRCode = async (transaksi: TransaksiJasa) => {
    try {
      const qrData = JSON.stringify({
        type: 'transaksi-jasa',
        uid: transaksi.uid,
        customer: transaksi.customer.nama,
        total: transaksi.total,
        status: transaksi.status
      })
      const url = await QRCode.toDataURL(qrData, { width: 256, margin: 2 })
      setQrCodeUrl(url)
      setSelectedTransaksi(transaksi)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const addToCart = (jasaId: number) => {
    const existing = cart.find(c => c.jasaId === jasaId)
    if (existing) {
      setCart(cart.map(c => c.jasaId === jasaId ? { ...c, jumlah: c.jumlah + 1 } : c))
    } else {
      setCart([...cart, { jasaId, jumlah: 1 }])
    }
  }

  const removeFromCart = (jasaId: number) => {
    setCart(cart.filter(c => c.jasaId !== jasaId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const jasa = jasaList.find(j => j.id === item.jasaId)
      return total + (jasa ? Number(jasa.harga) * item.jumlah : 0)
    }, 0)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">TRANSAKSI JASA</h2>
        <Button onClick={() => setShowForm(true)}>+ New Transaction</Button>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">New Transaksi Jasa</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Customer</label>
                <select name="customerId" required className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground">
                  <option value="">Select Customer</option>
                  {customerList.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Add Service</label>
                <select 
                  onChange={(e) => { if (e.target.value) addToCart(parseInt(e.target.value)); e.target.value = '' }}
                  className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
                >
                  <option value="">Select Service to Add</option>
                  {jasaList.filter(j => j.aktif).map(j => (
                    <option key={j.id} value={j.id}>{j.nama} - Rp {Number(j.harga).toLocaleString()}</option>
                  ))}
                </select>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="bg-background/30 rounded-lg p-4">
                <h4 className="text-foreground font-medium mb-3">Cart Items</h4>
                {cart.map(item => {
                  const jasa = jasaList.find(j => j.id === item.jasaId)
                  return jasa ? (
                    <div key={item.jasaId} className="flex justify-between items-center py-2 border-b border-accent/10">
                      <span className="text-foreground">{jasa.nama} x {item.jumlah}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-primary">Rp {(Number(jasa.harga) * item.jumlah).toLocaleString()}</span>
                        <Button type="button" size="sm" variant="outline" onClick={() => removeFromCart(item.jasaId)}>Remove</Button>
                      </div>
                    </div>
                  ) : null
                })}
                <div className="flex justify-between mt-4 pt-2 border-t border-accent/20">
                  <span className="font-medium text-foreground">Total:</span>
                  <span className="font-bold text-primary">Rp {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <textarea
              name="catatan"
              placeholder="Notes (optional)"
              className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={cart.length === 0}>Create Transaction</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setCart([]) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {qrCodeUrl && selectedTransaksi && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading text-xl text-foreground mb-2">Transaction QR: #{selectedTransaksi.uid.slice(0, 8)}</h3>
              <p className="text-foreground/60 mb-4">Customer: {selectedTransaksi.customer.nama}</p>
              <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
              <div className="mt-4">
                <a href={qrCodeUrl} download={`transaction-${selectedTransaksi.uid}.png`}>
                  <Button variant="outline">Download QR</Button>
                </a>
              </div>
            </div>
            <Button variant="outline" onClick={() => { setQrCodeUrl(null); setSelectedTransaksi(null) }}>Close</Button>
          </div>
        </Card>
      )}

      <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Services</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transaksiList.map((t) => (
                <tr key={t.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{t.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{t.customer.nama}</td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">
                    {t.detail.map(d => d.jasa.nama).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium">Rp {Number(t.total).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'SELESAI' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'BATAL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">{new Date(t.tanggal).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowReceipt(t)}>Receipt</Button>
                      <Button size="sm" variant="outline" onClick={() => generateQRCode(t)}>QR</Button>
                      {t.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(t.uid, 'SELESAI')}>Complete</Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(t.uid, 'BATAL')}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal for Jasa */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-2xl">
            <div ref={receiptRef} className="p-6 text-black">
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h2 className="text-xl font-bold">NAILEA STUDIO</h2>
                <p className="text-sm text-gray-600">Beauty & Nail Care</p>
                <p className="text-xs text-gray-500 mt-1">Jl. Example Street No. 123</p>
              </div>
              
              <div className="text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">No. Transaksi:</span>
                  <span className="font-mono">#{showReceipt.uid.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span>{new Date(showReceipt.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span>{showReceipt.customer.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={showReceipt.status === 'SELESAI' ? 'text-green-600' : showReceipt.status === 'BATAL' ? 'text-red-600' : 'text-yellow-600'}>
                    {showReceipt.status}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
                <h3 className="font-semibold mb-2">Detail Layanan:</h3>
                {showReceipt.detail.map((d, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{d.jasa.nama} x{d.jumlah}</span>
                    <span>Rp {(Number(d.harga) * d.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>Rp {Number(showReceipt.total).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {showReceipt.catatan && (
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">Catatan:</span> {showReceipt.catatan}
                </div>
              )}

              <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600">Terima kasih atas kunjungan Anda!</p>
                <p className="text-xs text-gray-500">www.naileastudio.com</p>
              </div>
            </div>
            
            <div className="flex gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
              <Button 
                className="flex-1"
                onClick={() => {
                  const printContent = receiptRef.current?.innerHTML
                  const printWindow = window.open('', '', 'width=400,height=600')
                  if (printWindow && printContent) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Receipt - ${showReceipt.uid.slice(0, 8)}</title>
                          <style>
                            body { font-family: 'Courier New', monospace; padding: 20px; }
                            .text-center { text-align: center; }
                            .flex { display: flex; }
                            .justify-between { justify-content: space-between; }
                            .font-bold { font-weight: bold; }
                            .text-sm { font-size: 0.875rem; }
                            .text-xs { font-size: 0.75rem; }
                            .text-lg { font-size: 1.125rem; }
                            .text-xl { font-size: 1.25rem; }
                            .text-gray-600 { color: #666; }
                            .text-gray-500 { color: #888; }
                            .text-green-600 { color: #16a34a; }
                            .text-red-600 { color: #dc2626; }
                            .text-yellow-600 { color: #ca8a04; }
                            .border-dashed { border-style: dashed; }
                            .border-t-2, .border-b-2 { border-width: 2px; border-color: #ccc; }
                            .pt-4, .pb-4 { padding-top: 1rem; padding-bottom: 1rem; }
                            .mt-4, .mb-4 { margin-top: 1rem; margin-bottom: 1rem; }
                            .mt-6 { margin-top: 1.5rem; }
                            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                            .mb-2 { margin-bottom: 0.5rem; }
                            .mt-1 { margin-top: 0.25rem; }
                            .font-mono { font-family: monospace; }
                            .font-semibold { font-weight: 600; }
                          </style>
                        </head>
                        <body>${printContent}</body>
                      </html>
                    `)
                    printWindow.document.close()
                    printWindow.print()
                  }
                }}
              >
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => setShowReceipt(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TransaksiItemManager() {
  const [transaksiList, setTransaksiList] = useState<TransaksiItem[]>([])
  const [itemList, setItemList] = useState<Item[]>([])
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [cart, setCart] = useState<{ itemId: number; jumlah: number }[]>([])
  const [showReceipt, setShowReceipt] = useState<TransaksiItem | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    try {
      const [transRes, itemRes, custRes] = await Promise.all([
        authFetch('/api/admin/transaksi-item'),
        authFetch('/api/admin/item'),
        authFetch('/api/admin/customer')
      ])
      
      if (transRes.ok) setTransaksiList(await transRes.json())
      if (itemRes.ok) setItemList(await itemRes.json())
      if (custRes.ok) setCustomerList(await custRes.json())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      customerId: parseInt(formData.get('customerId') as string),
      catatan: formData.get('catatan'),
      detail: cart
    }

    try {
      const res = await authFetch('/api/admin/transaksi-item', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (res.ok) {
        fetchData()
        setShowForm(false)
        setCart([])
      }
    } catch (error) {
      console.error('Failed to create transaksi:', error)
    }
  }

  const updateStatus = async (uid: string, status: string) => {
    try {
      const res = await authFetch(`/api/admin/transaksi-item/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const addToCart = (itemId: number) => {
    const item = itemList.find(i => i.id === itemId)
    if (!item || item.stok <= 0) return

    const existing = cart.find(c => c.itemId === itemId)
    if (existing) {
      if (existing.jumlah < item.stok) {
        setCart(cart.map(c => c.itemId === itemId ? { ...c, jumlah: c.jumlah + 1 } : c))
      }
    } else {
      setCart([...cart, { itemId, jumlah: 1 }])
    }
  }

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(c => c.itemId !== itemId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const item = itemList.find(i => i.id === cartItem.itemId)
      return total + (item ? Number(item.harga) * cartItem.jumlah : 0)
    }, 0)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">TRANSAKSI ITEM</h2>
        <Button onClick={() => setShowForm(true)}>+ New Transaction</Button>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">New Transaksi Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Customer</label>
                <select name="customerId" required className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground">
                  <option value="">Select Customer</option>
                  {customerList.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Add Item</label>
                <select 
                  onChange={(e) => { if (e.target.value) addToCart(parseInt(e.target.value)); e.target.value = '' }}
                  className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
                >
                  <option value="">Select Item to Add</option>
                  {itemList.filter(i => i.aktif && i.stok > 0).map(i => (
                    <option key={i.id} value={i.id}>{i.nama} - Rp {Number(i.harga).toLocaleString()} (Stock: {i.stok})</option>
                  ))}
                </select>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="bg-background/30 rounded-lg p-4">
                <h4 className="text-foreground font-medium mb-3">Cart Items</h4>
                {cart.map(cartItem => {
                  const item = itemList.find(i => i.id === cartItem.itemId)
                  return item ? (
                    <div key={cartItem.itemId} className="flex justify-between items-center py-2 border-b border-accent/10">
                      <span className="text-foreground">{item.nama} x {cartItem.jumlah}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-primary">Rp {(Number(item.harga) * cartItem.jumlah).toLocaleString()}</span>
                        <Button type="button" size="sm" variant="outline" onClick={() => removeFromCart(cartItem.itemId)}>Remove</Button>
                      </div>
                    </div>
                  ) : null
                })}
                <div className="flex justify-between mt-4 pt-2 border-t border-accent/20">
                  <span className="font-medium text-foreground">Total:</span>
                  <span className="font-bold text-primary">Rp {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <textarea
              name="catatan"
              placeholder="Notes (optional)"
              className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={cart.length === 0}>Create Transaction</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setCart([]) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Items</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transaksiList.map((t) => (
                <tr key={t.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{t.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{t.customer.nama}</td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">
                    {t.detail.map(d => d.item.nama).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium">Rp {Number(t.total).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'SELESAI' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'BATAL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">{new Date(t.tanggal).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowReceipt(t)}>Receipt</Button>
                      {t.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(t.uid, 'SELESAI')}>Complete</Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(t.uid, 'BATAL')}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Modal for Item */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-2xl">
            <div ref={receiptRef} className="p-6 text-black">
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h2 className="text-xl font-bold">NAILEA STUDIO</h2>
                <p className="text-sm text-gray-600">Beauty & Nail Care</p>
                <p className="text-xs text-gray-500 mt-1">Jl. Example Street No. 123</p>
              </div>
              
              <div className="text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">No. Transaksi:</span>
                  <span className="font-mono">#{showReceipt.uid.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span>{new Date(showReceipt.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span>{showReceipt.customer.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={showReceipt.status === 'SELESAI' ? 'text-green-600' : showReceipt.status === 'BATAL' ? 'text-red-600' : 'text-yellow-600'}>
                    {showReceipt.status}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
                <h3 className="font-semibold mb-2">Detail Produk:</h3>
                {showReceipt.detail.map((d, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{d.item.nama} x{d.jumlah}</span>
                    <span>Rp {(Number(d.harga) * d.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>Rp {Number(showReceipt.total).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {showReceipt.catatan && (
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">Catatan:</span> {showReceipt.catatan}
                </div>
              )}

              <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600">Terima kasih atas kunjungan Anda!</p>
                <p className="text-xs text-gray-500">www.naileastudio.com</p>
              </div>
            </div>
            
            <div className="flex gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
              <Button 
                className="flex-1"
                onClick={() => {
                  const printContent = receiptRef.current?.innerHTML
                  const printWindow = window.open('', '', 'width=400,height=600')
                  if (printWindow && printContent) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Receipt - ${showReceipt.uid.slice(0, 8)}</title>
                          <style>
                            body { font-family: 'Courier New', monospace; padding: 20px; }
                            .text-center { text-align: center; }
                            .flex { display: flex; }
                            .justify-between { justify-content: space-between; }
                            .font-bold { font-weight: bold; }
                            .text-sm { font-size: 0.875rem; }
                            .text-xs { font-size: 0.75rem; }
                            .text-lg { font-size: 1.125rem; }
                            .text-xl { font-size: 1.25rem; }
                            .text-gray-600 { color: #666; }
                            .text-gray-500 { color: #888; }
                            .text-green-600 { color: #16a34a; }
                            .text-red-600 { color: #dc2626; }
                            .text-yellow-600 { color: #ca8a04; }
                            .border-dashed { border-style: dashed; }
                            .border-t-2, .border-b-2 { border-width: 2px; border-color: #ccc; }
                            .pt-4, .pb-4 { padding-top: 1rem; padding-bottom: 1rem; }
                            .mt-4, .mb-4 { margin-top: 1rem; margin-bottom: 1rem; }
                            .mt-6 { margin-top: 1.5rem; }
                            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                            .mb-2 { margin-bottom: 0.5rem; }
                            .mt-1 { margin-top: 0.25rem; }
                            .font-mono { font-family: monospace; }
                            .font-semibold { font-weight: 600; }
                          </style>
                        </head>
                        <body>${printContent}</body>
                      </html>
                    `)
                    printWindow.document.close()
                    printWindow.print()
                  }
                }}
              >
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => setShowReceipt(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

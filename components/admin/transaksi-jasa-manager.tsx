'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authFetch } from '@/lib/api'
import { Receipt } from '@/components/admin/receipt'
import { SearchBar } from '@/components/admin/search-bar'
import QRCode from 'qrcode'

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

type Customer = {
  id: number
  uid: string
  nama: string
  email: string | null
  telepon: string | null
}

type PaymentType = 'CASH' | 'TRANSFER' | 'QRIS'

type TransaksiJasa = {
  id: number
  uid: string
  customerId: number
  userId: number
  tanggal: string
  total: number
  status: 'PENDING' | 'SELESAI' | 'BATAL'
  payment: PaymentType
  catatan: string | null
  customer: Customer
  detail: { jasa: Jasa; jumlah: number; harga: number }[]
}

export function TransaksiJasaManager() {
  const [transaksiList, setTransaksiList] = useState<TransaksiJasa[]>([])
  const [jasaList, setJasaList] = useState<Jasa[]>([])
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [selectedTransaksi, setSelectedTransaksi] = useState<TransaksiJasa | null>(null)
  const [cart, setCart] = useState<{ jasaId: number; jumlah: number }[]>([])
  const [showReceipt, setShowReceipt] = useState<TransaksiJasa | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTransaksi = transaksiList.filter(t =>
    t.customer.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.detail.some(d => d.jasa.nama.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
      payment: formData.get('payment'),
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Transaksi Service</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search transactions..."
          />
          <Button onClick={() => setShowForm(true)}>+ New Transaction</Button>
        </div>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">New Transaksi Service</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Customer</label>
                <select name="customerId" required className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground">
                  <option value="">Select Customer</option>
                  {customerList.map(c => (
                    <option key={c.id} value={c.id}>{c.nama} - {c.telepon || 'No phone'}</option>
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

            <div>
              <label className="block text-sm text-foreground/60 mb-2">Payment Method</label>
              <select name="payment" required className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground">
                <option value="CASH">Cash</option>
                <option value="TRANSFER">Transfer Bank</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>

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
              {filteredTransaksi.map((t) => (
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
        <Receipt
          type="jasa"
          transactionId={showReceipt.uid}
          tanggal={showReceipt.tanggal}
          customerName={showReceipt.customer.nama}
          customerId={showReceipt.customer.uid}
          status={showReceipt.status}
          payment={showReceipt.payment || 'CASH'}
          items={showReceipt.detail.map(d => ({
            nama: d.jasa.nama,
            jumlah: d.jumlah,
            harga: d.harga
          }))}
          total={showReceipt.total}
          catatan={showReceipt.catatan}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  )
}

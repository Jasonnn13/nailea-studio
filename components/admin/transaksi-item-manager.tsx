'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { authFetch } from '@/lib/api'
import { Receipt } from '@/components/admin/receipt'
import { SearchBar } from '@/components/admin/search-bar'

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

type PaymentType = 'CASH' | 'TRANSFER' | 'QRIS'

type TransaksiItem = {
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
  detail: { item: Item; jumlah: number; harga: number }[]
}

export function TransaksiItemManager() {
  const [transaksiList, setTransaksiList] = useState<TransaksiItem[]>([])
  const [itemList, setItemList] = useState<Item[]>([])
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [cart, setCart] = useState<{ itemId: number; jumlah: number }[]>([])
  const [showReceipt, setShowReceipt] = useState<TransaksiItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customerQuery, setCustomerQuery] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [customerFocused, setCustomerFocused] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string>('CASH')
  const [selectedItem, setSelectedItem] = useState<string | number>('')
  const blurTimeoutRef = useRef<number | null>(null)

  const filteredTransaksi = transaksiList.filter(t =>
    t.customer.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.detail.some(d => d.item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
    if (!selectedCustomerId) {
      alert('Please select a customer')
      return
    }
    const formData = new FormData(e.currentTarget)
    const data = {
      customerId: selectedCustomerId,
      catatan: formData.get('catatan'),
      payment: selectedPayment,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Product Transactions</h2>
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
          <h3 className="font-heading text-xl text-foreground mb-4">New Product Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm text-foreground/60 mb-2">Customer</label>
                <input
                  type="text"
                  value={customerQuery}
                  onChange={(e) => { setCustomerQuery(e.target.value); setSelectedCustomerId(null) }}
                  onFocus={() => { setCustomerFocused(true); if (blurTimeoutRef.current) { window.clearTimeout(blurTimeoutRef.current); blurTimeoutRef.current = null } }}
                  onBlur={() => { blurTimeoutRef.current = window.setTimeout(() => setCustomerFocused(false), 150) }}
                  placeholder="Search customer by name, phone or uid..."
                  autoComplete="off"
                  className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground"
                />
                <input type="hidden" name="customerId" value={selectedCustomerId ?? ''} />
                {(customerQuery || customerFocused) && selectedCustomerId === null && (
                  <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-auto bg-card border border-accent/20 rounded-md">
                    {customerList
                      .filter(c =>
                        c.nama.toLowerCase().includes(customerQuery.toLowerCase()) ||
                        (c.telepon || '').toLowerCase().includes(customerQuery.toLowerCase()) ||
                        c.uid.toLowerCase().includes(customerQuery.toLowerCase())
                      )
                      .slice(0, 10)
                      .map(c => (
                        <li
                          key={c.id}
                          onMouseDown={(ev) => ev.preventDefault()}
                          onClick={() => {
                            setSelectedCustomerId(c.id); setCustomerQuery(c.nama); setCustomerFocused(false)
                            if (blurTimeoutRef.current) { window.clearTimeout(blurTimeoutRef.current); blurTimeoutRef.current = null }
                          }}
                          className="p-2 hover:bg-accent/5 cursor-pointer text-foreground"
                        >
                          <div className="font-medium">{c.nama}</div>
                          <div className="text-sm text-foreground/60">{c.telepon || c.uid}</div>
                        </li>
                      ))
                    }
                    {customerList.filter(c =>
                      c.nama.toLowerCase().includes(customerQuery.toLowerCase()) ||
                      (c.telepon || '').toLowerCase().includes(customerQuery.toLowerCase()) ||
                      c.uid.toLowerCase().includes(customerQuery.toLowerCase())
                    ).length === 0 && (
                      <li className="p-2 text-foreground/60">No customers found</li>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <Dropdown
                  value={selectedItem}
                  onChange={(value) => {
                    if (value) {
                      addToCart(parseInt(value as string))
                      setSelectedItem('')
                    }
                  }}
                  label="Add Item"
                  placeholder="Select Item to Add"
                  options={itemList
                    .filter(i => i.aktif && i.stok > 0)
                    .map(i => ({
                      value: i.id,
                      label: `${i.nama} - Rp ${Number(i.harga).toLocaleString()} (Stock: ${i.stok})`
                    }))}
                />
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

            <div>
              <Dropdown
                value={selectedPayment}
                onChange={(value) => setSelectedPayment(value as string)}
                label="Payment Method"
                options={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'TRANSFER', label: 'Transfer Bank' },
                  { value: 'QRIS', label: 'QRIS' }
                ]}
              />
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredTransaksi.map((t) => (
          <Card key={t.uid} className="border border-accent/20 bg-card/50 backdrop-blur-sm p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground font-mono text-sm">#{t.uid.slice(0, 8)}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === 'SELESAI' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'BATAL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status === 'SELESAI' ? 'Completed' : t.status === 'BATAL' ? 'Cancelled' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{t.customer.nama}</p>
                  <p className="text-xs text-foreground/60 truncate mt-1">{t.detail.map(d => d.item.nama).join(', ')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-primary font-medium">Rp {Number(t.total).toLocaleString()}</span>
                    <span className="text-xs text-foreground/40">
                      {new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-accent/10">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowReceipt(t)}>Receipt</Button>
              {t.status === 'PENDING' && (
                <>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus(t.uid, 'SELESAI')}>Complete</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus(t.uid, 'BATAL')}>Cancel</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-20">ID</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-32">Customer</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-40">Items</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-28">Total</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-24">Status</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-28">Date</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaksi.map((t) => (
                <tr key={t.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground font-mono text-sm w-20">#{t.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground w-32">{t.customer.nama}</td>
                  <td className="py-3 px-4 text-foreground/60 text-sm truncate max-w-xs w-40">
                    {t.detail.map(d => d.item.nama).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium w-28">Rp {Number(t.total).toLocaleString()}</td>
                  <td className="py-3 px-4 w-24">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'SELESAI' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'BATAL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status === 'SELESAI' ? 'Completed' : t.status === 'BATAL' ? 'Cancelled' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground/60 text-sm w-28">{new Date(t.tanggal).toLocaleDateString()}</td>
                  <td className="py-3 px-4 w-36">
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
        <Receipt
          type="item"
          transactionId={showReceipt.uid}
          tanggal={showReceipt.tanggal}
          customerName={showReceipt.customer.nama}
          customerId={showReceipt.customer.uid}
          status={showReceipt.status}
          payment={showReceipt.payment || 'CASH'}
          items={showReceipt.detail.map(d => ({
            nama: d.item.nama,
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

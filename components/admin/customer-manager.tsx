'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { authFetch } from '@/lib/api'
import { SearchBar } from '@/components/admin/search-bar'
import { useDataCache } from '@/lib/dataCache'

type Customer = {
  id: number
  uid: string
  nama: string
  email: string | null
  telepon: string | null
  tanggalLahir: string | null
  createdAt: string
}

export function CustomerManager() {
  const { user } = useAuth(false)
  const { getCachedData, setCachedData, invalidateCache } = useDataCache()
  const isAdmin = user?.role === 'admin'
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const filteredCustomers = customerList.filter(customer =>
    customer.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (customer.telepon?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const fetchCustomers = async () => {
    try {
      const cached = getCachedData('customer')
      if (cached) {
        setCustomerList(cached)
        setLoading(false)
        return
      }

      const res = await authFetch('/api/admin/customer')
      if (res.ok) {
        const data = await res.json()
        setCustomerList(data)
        setCachedData('customer', data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      nama: formData.get('nama'),
      email: formData.get('email') || null,
      telepon: formData.get('telepon') || null,
      tanggalLahir: formData.get('tanggalLahir') || null
    }

    try {
      const res = await authFetch(
        editingCustomer ? `/api/admin/customer/${editingCustomer.uid}` : '/api/admin/customer',
        {
          method: editingCustomer ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      )

      if (res.ok) {
        invalidateCache('customer')
        fetchCustomers()
        setShowForm(false)
        setEditingCustomer(null)
      }
    } catch (error) {
      console.error('Failed to save customer:', error)
    }
  }

  const handleDelete = async (uid: string) => {
    setConfirmTarget(uid)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!confirmTarget) return
    try {
      const res = await authFetch(`/api/admin/customer/${confirmTarget}`, { method: 'DELETE' })
      if (res.ok) {
        invalidateCache('customer')
        fetchCustomers()
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
    } finally {
      setConfirmOpen(false)
      setConfirmTarget(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Manage Customers</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers..."
          />
          <Button onClick={() => { setShowForm(true); setEditingCustomer(null) }}>+ Add Customer</Button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="border border-foreground/5 bg-background/80 backdrop-blur-xl p-6 w-full max-w-2xl">
            <h3 className="font-heading text-xl text-foreground mb-4">{editingCustomer ? 'Edit' : 'Add'} Customer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Customer Name" defaultValue={editingCustomer?.nama} required />
              <Input name="email" type="email" placeholder="Email" defaultValue={editingCustomer?.email || ''} />
              <Input name="telepon" placeholder="Phone" defaultValue={editingCustomer?.telepon || ''} />
              <Input 
                name="tanggalLahir" 
                type="date" 
                placeholder="Date of Birth" 
                  defaultValue={editingCustomer?.tanggalLahir ? new Date(editingCustomer.tanggalLahir).toISOString().split('T')[0] : ''} 
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingCustomer ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCustomer(null) }}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.uid} className="border border-foreground/5 bg-background/40 backdrop-blur-xl p-4 hover:bg-foreground/[0.03] hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{customer.nama}</h3>
                  <p className="text-sm text-foreground/40 truncate">{customer.email || customer.telepon || `ID: ${customer.uid.slice(0, 8)}`}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customer.tanggalLahir && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        🎂 {new Date(customer.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                      Member since {new Date(customer.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-foreground/5">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingCustomer(customer); setShowForm(true) }}>Edit</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDelete(customer.uid)}>Delete</Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border border-foreground/5 bg-background/40 backdrop-blur-xl p-6 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Date of Birth</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Member Since</th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 text-foreground/40 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.uid} className="border-b border-foreground/5 hover:bg-foreground/[0.03]">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{customer.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{customer.nama}</td>
                  <td className="py-3 px-4 text-foreground/40">{customer.email || '-'}</td>
                  <td className="py-3 px-4 text-foreground/40">{customer.telepon || '-'}</td>
                  <td className="py-3 px-4 text-foreground/40">
                    {customer.tanggalLahir 
                      ? new Date(customer.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-foreground/40 text-sm">
                    {new Date(customer.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingCustomer(customer); setShowForm(true) }}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(customer.uid)}>Delete</Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Customer"
        description="This will permanently delete the customer. Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null) }}
      />
    </div>
  )
}

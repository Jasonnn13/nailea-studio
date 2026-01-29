'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { authFetch } from '@/lib/api'
import { SearchBar } from '@/components/admin/search-bar'

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
      const res = await authFetch('/api/admin/customer')
      if (res.ok) {
        const data = await res.json()
        setCustomerList(data)
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
      if (res.ok) fetchCustomers()
    } catch (error) {
      console.error('Failed to delete customer:', error)
    } finally {
      setConfirmOpen(false)
      setConfirmTarget(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
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
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">{editingCustomer ? 'Edit' : 'Add'} Customer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Nama Customer" defaultValue={editingCustomer?.nama} required />
              <Input name="email" type="email" placeholder="Email" defaultValue={editingCustomer?.email || ''} />
              <Input name="telepon" placeholder="Telepon" defaultValue={editingCustomer?.telepon || ''} />
              <Input 
                name="tanggalLahir" 
                type="date" 
                placeholder="Tanggal Lahir" 
                defaultValue={editingCustomer?.tanggalLahir ? new Date(editingCustomer.tanggalLahir).toISOString().split('T')[0] : ''} 
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingCustomer ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCustomer(null) }}>Cancel</Button>
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
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Telepon</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Tanggal Lahir</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Member Since</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{customer.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{customer.nama}</td>
                  <td className="py-3 px-4 text-foreground/60">{customer.email || '-'}</td>
                  <td className="py-3 px-4 text-foreground/60">{customer.telepon || '-'}</td>
                  <td className="py-3 px-4 text-foreground/60">
                    {customer.tanggalLahir 
                      ? new Date(customer.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">
                    {new Date(customer.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingCustomer(customer); setShowForm(true) }}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(customer.uid)}>Delete</Button>
                    </div>
                  </td>
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

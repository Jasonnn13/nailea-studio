 'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { authFetch } from '@/lib/api'
import { SearchBar } from '@/components/admin/search-bar'

type Staff = {
  id: number
  uid: string
  nama: string
  email: string | null
  role: string
  aktif: boolean
  createdAt: string
}

export function StaffManager() {
  const { user } = useAuth(false)
  const isAdmin = user?.role === 'admin'
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const filteredStaff = staffList.filter(s =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchStaff = async () => {
    try {
      const res = await authFetch('/api/admin/staff')
      if (res.ok) {
        const data = await res.json()
        setStaffList(data)
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = {
      nama: formData.get('nama'),
      email: formData.get('email') || null,
      aktif: formData.get('aktif') === 'on'
    }
    const pw = formData.get('password')
    if (pw) data.password = pw

    try {
      const res = await authFetch(
        editingStaff ? `/api/admin/staff/${editingStaff.uid}` : '/api/admin/staff',
        {
          method: editingStaff ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      )

      if (res.ok) {
        fetchStaff()
        setShowForm(false)
        setEditingStaff(null)
      }
    } catch (error) {
      console.error('Failed to save staff:', error)
    }
  }

  const handleDelete = async (uid: string) => {
    setConfirmTarget(uid)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!confirmTarget) return
    try {
      const res = await authFetch(`/api/admin/staff/${confirmTarget}`, { method: 'DELETE' })
      if (res.ok) fetchStaff()
    } catch (error) {
      console.error('Failed to delete staff:', error)
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
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Manage Staff</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staff..."
          />
          {isAdmin && <Button onClick={() => { setShowForm(true); setEditingStaff(null) }}>+ Add Staff</Button>}
        </div>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">{editingStaff ? 'Edit' : 'Add'} Staff</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Nama Staff" defaultValue={editingStaff?.nama} required />
              <Input name="email" type="email" placeholder="Email" defaultValue={editingStaff?.email || ''} />
              <Input name="password" type="password" placeholder="Password (leave blank to keep)" />
              <label className="flex items-center gap-2">
                <input name="aktif" type="checkbox" defaultChecked={editingStaff?.aktif ?? true} />
                <span className="text-sm text-foreground/60">Active</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingStaff ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingStaff(null) }}>Cancel</Button>
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
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Active</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Since</th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => (
                <tr key={s.uid} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{s.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{s.nama}</td>
                  <td className="py-3 px-4 text-foreground/60">{s.email || '-'}</td>
                  <td className="py-3 px-4 text-foreground/60">{s.role}</td>
                  <td className="py-3 px-4 text-foreground/60">{s.aktif ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-foreground/60 text-sm">{
                    (() => {
                      const d = s.createdAt ? new Date(s.createdAt) : null
                      return d && !isNaN(d.getTime())
                        ? d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '-'
                    })()
                  }</td>
                  {isAdmin && (
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingStaff(s); setShowForm(true) }}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(s.uid)}>Delete</Button>
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
        title="Delete Staff"
        description="This will permanently delete the staff user. Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null) }}
      />
    </div>
  )
}

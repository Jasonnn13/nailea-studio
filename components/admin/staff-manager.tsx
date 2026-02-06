 'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDataCache } from '@/lib/dataCache'
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
  const { getCachedData, setCachedData, invalidateCache } = useDataCache()
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
    const cached = getCachedData('staff')
    if (cached) {
      setStaffList(cached)
      setLoading(false)
      return
    }
    
    try {
      const res = await authFetch('/api/admin/staff')
      if (res.ok) {
        const data = await res.json()
        setStaffList(data)
        setCachedData('staff', data)
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
        invalidateCache('staff')
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
      if (res.ok) {
        invalidateCache('staff')
        fetchStaff()
      }
    } catch (error) {
      console.error('Failed to delete staff:', error)
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="border border-foreground/5 bg-background/80 backdrop-blur-xl p-6 w-full max-w-2xl">
            <h3 className="font-heading text-xl text-foreground mb-4">{editingStaff ? 'Edit' : 'Add'} Staff</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="nama" placeholder="Staff Name" defaultValue={editingStaff?.nama} required />
                <Input name="email" type="email" placeholder="Email" defaultValue={editingStaff?.email || ''} />
                <Input name="password" type="password" placeholder="Password (leave blank to keep)" />
                <label className="flex items-center gap-2">
                  <input name="aktif" type="checkbox" defaultChecked={editingStaff?.aktif ?? true} />
                  <span className="text-sm text-foreground/40">Active</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingStaff ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingStaff(null) }}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredStaff.map((s) => (
          <Card key={s.uid} className="border border-foreground/5 bg-background/40 backdrop-blur-xl p-4 hover:bg-foreground/[0.03] hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{s.nama}</h3>
                  <p className="text-sm text-foreground/40 truncate">{s.email || `ID: ${s.uid.slice(0, 8)}`}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {s.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${s.aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {s.aktif ? 'Active' : 'Inactive'}
                    </span>
                    {s.createdAt && (() => {
                      const d = new Date(s.createdAt)
                      return !isNaN(d.getTime()) && (
                        <span className="text-xs text-foreground/40">
                          Since {d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-foreground/5">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingStaff(s); setShowForm(true) }}>Edit</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDelete(s.uid)}>Delete</Button>
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
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Active</th>
                <th className="text-left py-3 px-4 text-foreground/40 font-medium">Since</th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 text-foreground/40 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => (
                <tr key={s.uid} className="border-b border-foreground/5 hover:bg-foreground/[0.03]">
                  <td className="py-3 px-4 text-foreground font-mono text-sm">#{s.uid.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-foreground">{s.nama}</td>
                  <td className="py-3 px-4 text-foreground/40">{s.email || '-'}</td>
                  <td className="py-3 px-4 text-foreground/40">{s.role}</td>
                  <td className="py-3 px-4 text-foreground/40">{s.aktif ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-foreground/40 text-sm">{
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

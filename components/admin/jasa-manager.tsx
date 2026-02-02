'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { authFetch } from '@/lib/api'
import { SearchBar } from '@/components/admin/search-bar'

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

export function JasaManager() {
  const { user } = useAuth(false)
  const isAdmin = user?.role === 'admin'
  const [jasaList, setJasaList] = useState<Jasa[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJasa, setEditingJasa] = useState<Jasa | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate'>('deactivate')

  const filteredJasa = jasaList.filter(jasa =>
    jasa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (jasa.kategori?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

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

  const handleToggle = async (uid: string, action: 'activate' | 'deactivate') => {
    setConfirmTarget(uid)
    setConfirmAction(action)
    setConfirmOpen(true)
  }

  const confirmToggle = async () => {
    if (!confirmTarget) return
    try {
      const aktif = confirmAction === 'activate'
      const res = await authFetch(`/api/admin/jasa/${confirmTarget}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aktif })
      })
      if (res.ok) fetchJasa()
    } catch (error) {
      console.error('Failed to update jasa aktif:', error)
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
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Manage Services</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search services..."
          />
          {isAdmin && (
            <Button onClick={() => { setShowForm(true); setEditingJasa(null) }}>+ Add Service</Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border border-accent/20 bg-card/90 backdrop-blur-sm p-6 w-full max-w-2xl">
            <h3 className="font-heading text-xl text-foreground mb-4">{editingJasa ? 'Edit' : 'Add'} Service</h3>
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
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredJasa.map((jasa) => (
          <Card key={jasa.uid} className="border border-accent/20 bg-card/50 backdrop-blur-sm p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{jasa.nama}</h3>
                  <p className="text-sm text-foreground/60">{jasa.kategori || 'Uncategorized'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-primary font-medium">Rp {Number(jasa.harga).toLocaleString()}</span>
                    {jasa.durasi && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        {jasa.durasi} min
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${jasa.aktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {jasa.aktif ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-accent/10">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingJasa(jasa); setShowForm(true) }}>Edit</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleToggle(jasa.uid, jasa.aktif ? 'deactivate' : 'activate')}>
                  {jasa.aktif ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Kategori</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Harga</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Durasi</th>
                <th className="text-left py-3 px-4 text-foreground/60 font-medium">Status</th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 text-foreground/60 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredJasa.map((jasa) => (
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
                  {isAdmin && (
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingJasa(jasa); setShowForm(true) }}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleToggle(jasa.uid, jasa.aktif ? 'deactivate' : 'activate')}>
                          {jasa.aktif ? 'Deactivate' : 'Activate'}
                        </Button>
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
        title={confirmAction === 'activate' ? 'Activate Service' : 'Deactivate Service'}
        description={confirmAction === 'activate'
          ? 'This will activate the service. Proceed?'
          : 'This will deactivate the service but keep historical transactions. Proceed?'}
        confirmLabel={confirmAction === 'activate' ? 'Activate' : 'Deactivate'}
        cancelLabel="Cancel"
        onConfirm={confirmToggle}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null) }}
      />
    </div>
  )
}

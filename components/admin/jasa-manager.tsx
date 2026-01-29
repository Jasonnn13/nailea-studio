'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const [jasaList, setJasaList] = useState<Jasa[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJasa, setEditingJasa] = useState<Jasa | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Manage Services</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search services..."
          />
          <Button onClick={() => { setShowForm(true); setEditingJasa(null) }}>+ Add Service</Button>
        </div>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
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

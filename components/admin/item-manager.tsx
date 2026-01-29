'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authFetch } from '@/lib/api'
import { SearchBar } from '@/components/admin/search-bar'
import Barcode from 'react-barcode'

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

export function ItemManager() {
  const [itemList, setItemList] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showBarcode, setShowBarcode] = useState<Item | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = itemList.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.kategori?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-2xl text-foreground tracking-wider">Manage Products</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search items..."
          />
          <Button onClick={() => { setShowForm(true); setEditingItem(null) }}>+ Add Product</Button>
        </div>
      </div>

      {showForm && (
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-heading text-xl text-foreground mb-4">{editingItem ? 'Edit' : 'Add'} Product</h3>
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
              {filteredItems.map((item) => (
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

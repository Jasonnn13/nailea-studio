import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { uid } = await params
    const item = await prisma.item.findUnique({
      where: { uid }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to fetch item:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// PUT update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const { uid } = await params
    const body = await request.json()
    const { nama, deskripsi, harga, stok, kategori, aktif } = body

    const item = await prisma.item.update({
      where: { uid },
      data: {
        nama,
        deskripsi,
        harga,
        stok: stok ? parseInt(stok) : 0,
        kategori,
        aktif
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to update item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const { uid } = await params
    await prisma.item.delete({
      where: { uid }
    })

    return NextResponse.json({ message: 'Item deleted' })
  } catch (error) {
    console.error('Failed to delete item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

// PATCH partial update (e.g., deactivate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const { uid } = await params
    const body = await request.json()
    const { nama, deskripsi, harga, stok, kategori, aktif } = body

    const data: any = {}
    if (nama !== undefined) data.nama = nama
    if (deskripsi !== undefined) data.deskripsi = deskripsi
    if (harga !== undefined) data.harga = Number(harga)
    if (stok !== undefined) data.stok = stok ? parseInt(stok) : 0
    if (kategori !== undefined) data.kategori = kategori
    if (aktif !== undefined) data.aktif = Boolean(aktif)

    const item = await prisma.item.update({
      where: { uid },
      data
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to patch item:', error)
    return NextResponse.json({ error: 'Failed to patch item' }, { status: 500 })
  }
}

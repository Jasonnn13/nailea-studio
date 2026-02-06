import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest } from '@/lib/auth'
import { invalidateServiceCache } from '@/lib/serviceCache'

export const runtime = 'nodejs'

// GET single jasa
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
    const jasa = await prisma.jasa.findUnique({
      where: { uid }
    })

    if (!jasa) {
      return NextResponse.json({ error: 'Jasa not found' }, { status: 404 })
    }

    return NextResponse.json(jasa)
  } catch (error) {
    console.error('Failed to fetch jasa:', error)
    return NextResponse.json({ error: 'Failed to fetch jasa' }, { status: 500 })
  }
}

// PUT update jasa
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
    const { nama, deskripsi, harga, durasi, kategori, aktif } = body

    const jasa = await prisma.jasa.update({
      where: { uid },
      data: {
        nama,
        deskripsi,
        harga,
        durasi: durasi ? parseInt(durasi) : null,
        kategori,
        aktif
      }
    })

    // Invalidate services cache after updating
    invalidateServiceCache()

    return NextResponse.json(jasa)
  } catch (error) {
    console.error('Failed to update jasa:', error)
    return NextResponse.json({ error: 'Failed to update jasa' }, { status: 500 })
  }
}

// DELETE jasa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const { uid } = await params
    await prisma.jasa.delete({
      where: { uid }
    })

    // Invalidate services cache after deleting
    invalidateServiceCache()

    return NextResponse.json({ message: 'Jasa deleted' })
  } catch (error) {
    console.error('Failed to delete jasa:', error)
    return NextResponse.json({ error: 'Failed to delete jasa' }, { status: 500 })
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
    const { nama, deskripsi, harga, durasi, kategori, aktif } = body

    const data: any = {}
    if (nama !== undefined) data.nama = nama
    if (deskripsi !== undefined) data.deskripsi = deskripsi
    if (harga !== undefined) data.harga = Number(harga)
    if (durasi !== undefined) data.durasi = durasi ? parseInt(durasi) : null
    if (kategori !== undefined) data.kategori = kategori
    if (aktif !== undefined) data.aktif = Boolean(aktif)

    const jasa = await prisma.jasa.update({
      where: { uid },
      data
    })

    // Invalidate services cache after patching
    invalidateServiceCache()

    return NextResponse.json(jasa)
  } catch (error) {
    console.error('Failed to patch jasa:', error)
    return NextResponse.json({ error: 'Failed to patch jasa' }, { status: 500 })
  }
}

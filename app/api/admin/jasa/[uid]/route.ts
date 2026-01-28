import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest } from '@/lib/auth'

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
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { uid } = await params
    await prisma.jasa.delete({
      where: { uid }
    })

    return NextResponse.json({ message: 'Jasa deleted' })
  } catch (error) {
    console.error('Failed to delete jasa:', error)
    return NextResponse.json({ error: 'Failed to delete jasa' }, { status: 500 })
  }
}

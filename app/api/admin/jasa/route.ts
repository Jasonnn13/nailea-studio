import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all jasa
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // allow any authenticated user to list jasa; creation is restricted in POST

  try {
    const jasa = await prisma.jasa.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(jasa)
  } catch (error) {
    console.error('Failed to fetch jasa:', error)
    return NextResponse.json({ error: 'Failed to fetch jasa' }, { status: 500 })
  }
}

// POST create new jasa
export async function POST(request: NextRequest) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const body = await request.json()
    const { nama, deskripsi, harga, durasi, kategori } = body

    const jasa = await prisma.jasa.create({
      data: {
        nama,
        deskripsi,
        harga,
        durasi: durasi ? parseInt(durasi) : null,
        kategori,
        aktif: true
      }
    })

    return NextResponse.json(jasa, { status: 201 })
  } catch (error) {
    console.error('Failed to create jasa:', error)
    return NextResponse.json({ error: 'Failed to create jasa' }, { status: 500 })
  }
}

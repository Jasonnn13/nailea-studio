import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all items
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nama, deskripsi, harga, stok, kategori } = body

    const item = await prisma.item.create({
      data: {
        nama,
        deskripsi,
        harga,
        stok: stok ? parseInt(stok) : 0,
        kategori,
        aktif: true
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Failed to create item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

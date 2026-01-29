import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET single transaksi item
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
    const transaksi = await prisma.transaksiItem.findUnique({
      where: { uid },
      include: {
        customer: true,
        user: true,
        detail: {
          include: {
            item: true
          }
        }
      }
    })

    if (!transaksi) {
      return NextResponse.json({ error: 'Transaksi not found' }, { status: 404 })
    }

    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Failed to fetch transaksi:', error)
    return NextResponse.json({ error: 'Failed to fetch transaksi' }, { status: 500 })
  }
}

// PUT update transaksi status
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
    const { status, catatan } = body

    // Fetch current transaksi with details and items
    const current = await prisma.transaksiItem.findUnique({
      where: { uid },
      include: { detail: { include: { item: true } } }
    })

    if (!current) {
      return NextResponse.json({ error: 'Transaksi not found' }, { status: 404 })
    }

    // If moving to SELESAI from a non-SELESAI state, decrement stock
    if (status === 'SELESAI' && current.status !== 'SELESAI') {
      // Validate stock availability
      for (const d of current.detail) {
        const item = await prisma.item.findUnique({ where: { id: d.itemId } })
        if (!item) {
          return NextResponse.json({ error: `Item not found: ${d.itemId}` }, { status: 400 })
        }
        if (item.stok < d.jumlah) {
          return NextResponse.json({ error: `Insufficient stock for item ${item.nama}` }, { status: 400 })
        }
      }

      // Perform stock decrements and update transaksi in a transaction
      const ops: any[] = []
      for (const d of current.detail) {
        ops.push(prisma.item.update({ where: { id: d.itemId }, data: { stok: { decrement: d.jumlah } } }))
      }
      ops.push(prisma.transaksiItem.update({
        where: { uid },
        data: { status, catatan },
        include: {
          customer: true,
          user: true,
          detail: { include: { item: true } }
        }
      }))

      const results = await prisma.$transaction(ops)
      const updatedTransaksi = results[results.length - 1]
      return NextResponse.json(updatedTransaksi)
    }

    // If moving from SELESAI to another status (e.g., BATAL), restore stock
    if (current.status === 'SELESAI' && status !== 'SELESAI') {
      const ops: any[] = []
      for (const d of current.detail) {
        ops.push(prisma.item.update({ where: { id: d.itemId }, data: { stok: { increment: d.jumlah } } }))
      }
      ops.push(prisma.transaksiItem.update({ where: { uid }, data: { status, catatan }, include: { customer: true, user: true, detail: { include: { item: true } } } }))
      const results = await prisma.$transaction(ops)
      const updatedTransaksi = results[results.length - 1]
      return NextResponse.json(updatedTransaksi)
    }

    // Default: simple update
    const transaksi = await prisma.transaksiItem.update({
      where: { uid },
      data: { status, catatan },
      include: { customer: true, user: true, detail: { include: { item: true } } }
    })

    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Failed to update transaksi:', error)
    return NextResponse.json({ error: 'Failed to update transaksi' }, { status: 500 })
  }
}

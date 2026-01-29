import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all transaksi item
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const transaksi = await prisma.transaksiItem.findMany({
      include: {
        customer: true,
        user: true,
        detail: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Failed to fetch transaksi item:', error)
    return NextResponse.json({ error: 'Failed to fetch transaksi item' }, { status: 500 })
  }
}

// POST create new transaksi item
export async function POST(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { customerId, detail, catatan, payment } = body
    
    // Use userId from authenticated user
    const userId = user.userId

    // Calculate total and update stock
    let total = 0
    for (const d of detail) {
      const item = await prisma.item.findUnique({ where: { id: d.itemId } })
      if (item) {
        total += Number(item.harga) * d.jumlah
        // Update stock
        await prisma.item.update({
          where: { id: d.itemId },
          data: { stok: item.stok - d.jumlah }
        })
      }
    }

    const transaksi = await prisma.transaksiItem.create({
      data: {
        customerId,
        userId,
        total,
        catatan,
        payment: payment || 'CASH',
        status: 'PENDING',
        detail: {
          create: await Promise.all(detail.map(async (d: { itemId: number; jumlah: number }) => {
            const item = await prisma.item.findUnique({ where: { id: d.itemId } })
            return {
              itemId: d.itemId,
              jumlah: d.jumlah,
              harga: item?.harga || 0
            }
          }))
        }
      },
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

    return NextResponse.json(transaksi, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaksi item:', error)
    return NextResponse.json({ error: 'Failed to create transaksi item' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all transaksi jasa
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const transaksi = await prisma.transaksiJasa.findMany({
      include: {
        customer: true,
        user: true,
        detail: {
          include: {
            jasa: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Failed to fetch transaksi jasa:', error)
    return NextResponse.json({ error: 'Failed to fetch transaksi jasa' }, { status: 500 })
  }
}

// POST create new transaksi jasa
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

    // Calculate total from detail items
    let total = 0
    for (const d of detail) {
      const jasa = await prisma.jasa.findUnique({ where: { id: d.jasaId } })
      if (jasa) {
        total += Number(jasa.harga) * d.jumlah
      }
    }

    const transaksi = await prisma.transaksiJasa.create({
      data: {
        customerId,
        userId,
        total,
        catatan,
        payment: payment || 'CASH',
        status: 'PENDING',
        detail: {
          create: await Promise.all(detail.map(async (d: { jasaId: number; jumlah: number }) => {
            const jasa = await prisma.jasa.findUnique({ where: { id: d.jasaId } })
            return {
              jasaId: d.jasaId,
              jumlah: d.jumlah,
              harga: jasa?.harga || 0
            }
          }))
        }
      },
      include: {
        customer: true,
        user: true,
        detail: {
          include: {
            jasa: true
          }
        }
      }
    })

    return NextResponse.json(transaksi, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaksi jasa:', error)
    return NextResponse.json({ error: 'Failed to create transaksi jasa' }, { status: 500 })
  }
}

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

    const transaksi = await prisma.transaksiItem.update({
      where: { uid },
      data: {
        status,
        catatan
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

    return NextResponse.json(transaksi)
  } catch (error) {
    console.error('Failed to update transaksi:', error)
    return NextResponse.json({ error: 'Failed to update transaksi' }, { status: 500 })
  }
}

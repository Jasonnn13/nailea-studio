import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET single customer
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
    const customer = await prisma.customer.findUnique({
      where: { uid },
      include: {
        transaksiItem: {
          include: { detail: { include: { item: true } } },
          orderBy: { tanggal: 'desc' },
          take: 10
        },
        transaksiJasa: {
          include: { detail: { include: { jasa: true } } },
          orderBy: { tanggal: 'desc' },
          take: 10
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Failed to fetch customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PUT update customer
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
    const { nama, email, telepon, tanggalLahir } = body

    const customer = await prisma.customer.update({
      where: { uid },
      data: {
        nama,
        email: email || null,
        telepon: telepon || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Failed to update customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

// DELETE customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const { uid } = await params
    
    // Check if customer has transactions
    const customer = await prisma.customer.findUnique({
      where: { uid },
      include: {
        _count: {
          select: { transaksiItem: true, transaksiJasa: true }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    if (customer._count.transaksiItem > 0 || customer._count.transaksiJasa > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing transactions' },
        { status: 400 }
      )
    }

    await prisma.customer.delete({ where: { uid } })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Failed to delete customer:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}

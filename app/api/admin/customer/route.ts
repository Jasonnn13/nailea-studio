import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all customers
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // allow any authenticated user to list customers; creation is restricted in POST

  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// POST create new customer
export async function POST(request: NextRequest) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe
  const user = maybe

  try {
    const body = await request.json()
    const { nama, email, telepon, tanggalLahir } = body

    const customer = await prisma.customer.create({
      data: {
        nama,
        email: email || null,
        telepon: telepon || null,
        tanggalLahir: new Date(tanggalLahir)
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Failed to create customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

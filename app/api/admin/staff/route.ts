import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest, hashPassword, sanitizeUser } from '@/lib/auth'

export const runtime = 'nodejs'

// GET all staff users
export async function GET(request: NextRequest) {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'admin' } },
      orderBy: { createdAt: 'desc' }
    })
    // sanitize before returning (include createdAt)
    const safe = users.map(u => sanitizeUser(u as any))
    return NextResponse.json(safe)
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

// POST create new staff user
export async function POST(request: NextRequest) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe

  try {
    const body = await request.json()
    const { nama, email, aktif = true, password } = body

    const plain = password || 'ChangeMe123!'
    const hashed = await hashPassword(plain)

    const user = await prisma.user.create({
      data: {
        nama,
        email: email || null,
        password: hashed,
        role: 'staff',
        aktif: aktif === false ? false : true
      }
    })

    return NextResponse.json(sanitizeUser(user as any), { status: 201 })
  } catch (error) {
    console.error('Failed to create staff:', error)
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }
}

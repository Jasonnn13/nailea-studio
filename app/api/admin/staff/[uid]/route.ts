import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthFromRequest, requireAdminFromRequest, hashPassword, sanitizeUser } from '@/lib/auth'

export const runtime = 'nodejs'

// GET single staff user
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
    const staff = await prisma.user.findUnique({ where: { uid } })
    if (!staff) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(sanitizeUser(staff as any))
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

// PUT update staff user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe

  try {
    const { uid } = await params
    const body = await request.json()
    const { nama, email, aktif, password } = body

    const data: any = {
      nama,
      email: email || null,
      aktif: typeof aktif === 'boolean' ? aktif : undefined
    }

    if (password) {
      data.password = await hashPassword(password)
    }

    const updated = await prisma.user.update({ where: { uid }, data })
    return NextResponse.json(sanitizeUser(updated as any))
  } catch (error) {
    console.error('Failed to update staff:', error)
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 })
  }
}

// DELETE staff user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const maybe = requireAdminFromRequest(request)
  if (maybe instanceof NextResponse) return maybe

  try {
    const { uid } = await params

    const user = await prisma.user.findUnique({
      where: { uid },
      include: {
        _count: { select: { transaksiItem: true, transaksiJasa: true } }
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user._count.transaksiItem > 0 || user._count.transaksiJasa > 0) {
      return NextResponse.json({ error: 'Cannot delete user with existing transactions' }, { status: 400 })
    }

    await prisma.user.delete({ where: { uid } })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Failed to delete staff:', error)
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 })
  }
}

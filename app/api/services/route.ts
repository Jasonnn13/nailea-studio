import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const services = await prisma.jasa.findMany({
      where: { aktif: true },
      orderBy: [
        { kategori: 'asc' },
        { harga: 'asc' }
      ],
      select: {
        uid: true,
        nama: true,
        deskripsi: true,
        harga: true,
        durasi: true,
        kategori: true,
      }
    })

    // Group services by category
    const grouped = services.reduce((acc, service) => {
      const category = service.kategori || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        uid: service.uid,
        name: service.nama,
        description: service.deskripsi,
        price: Number(service.harga),
        duration: service.durasi,
      })
      return acc
    }, {} as Record<string, Array<{ uid: string; name: string; description: string | null; price: number; duration: number | null }>>)

    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCachedServices, setCachedServices } from '@/lib/serviceCache'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Check cache first
    const cached = getCachedServices()
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' }
      })
    }

    // Fetch from database
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

    // Cache the result
    setCachedServices(grouped)

    return NextResponse.json(grouped, {
      headers: { 'X-Cache': 'MISS' }
    })
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

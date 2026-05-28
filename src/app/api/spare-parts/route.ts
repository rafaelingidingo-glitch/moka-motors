import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const compatibility = searchParams.get('compatibility')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'newest'

    const where: Record<string, unknown> = {}

    if (type) {
      const types = type.split(',')
      where.type = { in: types }
    }
    if (brand) {
      const brands = brand.split(',')
      where.brand = { in: brands }
    }
    if (compatibility) {
      where.compatibility = { contains: compatibility }
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice)
    }
    if (inStock === 'true') {
      where.inStock = true
    }
    if (featured === 'true') {
      where.featured = true
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }

    const spareParts = await db.sparePart.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(spareParts)
  } catch (error) {
    console.error('Error fetching spare parts:', error)
    return NextResponse.json({ error: 'Failed to fetch spare parts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sparePart = await db.sparePart.create({
      data: {
        name: body.name,
        type: body.type,
        brand: body.brand,
        compatibility: body.compatibility,
        price: parseFloat(body.price),
        description: body.description,
        imageUrl: body.imageUrl,
        inStock: body.inStock !== undefined ? body.inStock : true,
        featured: body.featured || false,
      },
    })
    return NextResponse.json(sparePart, { status: 201 })
  } catch (error) {
    console.error('Error creating spare part:', error)
    return NextResponse.json({ error: 'Failed to create spare part' }, { status: 500 })
  }
}

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const year = searchParams.get('year')
    const engineSize = searchParams.get('engineSize')
    const featured = searchParams.get('featured')
    const isNewStock = searchParams.get('isNewStock')
    const sort = searchParams.get('sort') || 'newest'

    const where: Record<string, unknown> = {}

    if (brand) {
      const brands = brand.split(',')
      where.brand = { in: brands }
    }
    if (category) {
      const categories = category.split(',')
      where.category = { in: categories }
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice)
    }
    if (year) {
      const years = year.split(',').map(Number)
      where.year = { in: years }
    }
    if (engineSize) {
      where.engineSize = { contains: engineSize }
    }
    if (featured === 'true') {
      where.featured = true
    }
    if (isNewStock === 'true') {
      where.isNewStock = true
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'year-desc') orderBy = { year: 'desc' }
    if (sort === 'year-asc') orderBy = { year: 'asc' }

    const motorbikes = await db.motorbike.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(motorbikes)
  } catch (error) {
    console.error('Error fetching motorbikes:', error)
    return NextResponse.json({ error: 'Failed to fetch motorbikes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const images = Array.isArray(body.images) ? JSON.stringify(body.images) : (typeof body.images === 'string' ? body.images : '[]')

    const motorbike = await db.motorbike.create({
      data: {
        name: body.name,
        brand: body.brand,
        category: body.category,
        price: parseFloat(body.price),
        year: parseInt(body.year),
        engineSize: body.engineSize,
        mileage: body.mileage || null,
        color: body.color || null,
        description: body.description,
        images,
        featured: body.featured || false,
        isNewStock: body.isNewStock || false,
      },
    })
    return NextResponse.json(motorbike, { status: 201 })
  } catch (error) {
    console.error('Error creating motorbike:', error)
    return NextResponse.json({ error: 'Failed to create motorbike' }, { status: 500 })
  }
}

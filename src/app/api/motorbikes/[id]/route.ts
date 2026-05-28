import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const motorbike = await db.motorbike.update({
      where: { id },
      data: {
        name: body.name,
        brand: body.brand,
        category: body.category,
        price: body.price !== undefined ? parseFloat(String(body.price)) : undefined,
        year: body.year !== undefined ? parseInt(String(body.year)) : undefined,
        engineSize: body.engineSize,
        mileage: body.mileage,
        color: body.color,
        description: body.description,
        imageUrl: body.imageUrl,
        featured: body.featured,
        isNewStock: body.isNewStock,
      },
    })
    return NextResponse.json(motorbike)
  } catch (error) {
    console.error('Error updating motorbike:', error)
    return NextResponse.json({ error: 'Failed to update motorbike' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.motorbike.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting motorbike:', error)
    return NextResponse.json({ error: 'Failed to delete motorbike' }, { status: 500 })
  }
}

import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const sparePart = await db.sparePart.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        brand: body.brand,
        compatibility: body.compatibility,
        price: body.price !== undefined ? parseFloat(String(body.price)) : undefined,
        description: body.description,
        imageUrl: body.imageUrl,
        inStock: body.inStock,
        featured: body.featured,
      },
    })
    return NextResponse.json(sparePart)
  } catch (error) {
    console.error('Error updating spare part:', error)
    return NextResponse.json({ error: 'Failed to update spare part' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.sparePart.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting spare part:', error)
    return NextResponse.json({ error: 'Failed to delete spare part' }, { status: 500 })
  }
}

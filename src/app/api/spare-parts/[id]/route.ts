import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()

    const data: Record<string, unknown> = {}

    if (body.name !== undefined) data.name = body.name
    if (body.type !== undefined) data.type = body.type
    if (body.brand !== undefined) data.brand = body.brand
    if (body.compatibility !== undefined) data.compatibility = body.compatibility
    if (body.price !== undefined) data.price = parseFloat(String(body.price))
    if (body.description !== undefined) data.description = body.description
    if (body.images !== undefined) {
      data.images = Array.isArray(body.images) ? JSON.stringify(body.images) : body.images
    }
    if (body.inStock !== undefined) data.inStock = body.inStock
    if (body.featured !== undefined) data.featured = body.featured

    const sparePart = await db.sparePart.update({
      where: { id },
      data,
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
  // Auth check
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    await db.sparePart.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting spare part:', error)
    return NextResponse.json({ error: 'Failed to delete spare part' }, { status: 500 })
  }
}

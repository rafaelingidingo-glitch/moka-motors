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
    if (body.brand !== undefined) data.brand = body.brand
    if (body.category !== undefined) data.category = body.category
    if (body.price !== undefined) data.price = parseFloat(String(body.price))
    if (body.year !== undefined) data.year = parseInt(String(body.year))
    if (body.engineSize !== undefined) data.engineSize = body.engineSize
    if (body.mileage !== undefined) data.mileage = body.mileage
    if (body.color !== undefined) data.color = body.color
    if (body.description !== undefined) data.description = body.description
    if (body.images !== undefined) {
      data.images = Array.isArray(body.images) ? JSON.stringify(body.images) : body.images
    }
    if (body.featured !== undefined) data.featured = body.featured
    if (body.isNewStock !== undefined) data.isNewStock = body.isNewStock

    const motorbike = await db.motorbike.update({
      where: { id },
      data,
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
  // Auth check
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await params
    await db.motorbike.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting motorbike:', error)
    return NextResponse.json({ error: 'Failed to delete motorbike' }, { status: 500 })
  }
}

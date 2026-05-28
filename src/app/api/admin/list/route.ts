import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Only super admins can list all admins
    const authError = await requireSuperAdmin(request)
    if (authError) return authError

    const admins = await db.admin.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Error listing admins:', error)
    return NextResponse.json({ error: 'Failed to list admins' }, { status: 500 })
  }
}

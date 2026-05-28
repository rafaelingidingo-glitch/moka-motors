import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin, getCurrentAdmin } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    // Only super admins can delete admins
    const authError = await requireSuperAdmin(request)
    if (authError) return authError

    const currentAdmin = await getCurrentAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('id')

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Find the admin to delete
    const targetAdmin = await db.admin.findUnique({
      where: { id: adminId },
    })

    if (!targetAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Prevent deleting yourself
    if (targetAdmin.id === currentAdmin.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Prevent deleting the last super admin
    if (targetAdmin.role === 'super_admin') {
      const superAdminCount = await db.admin.count({
        where: { role: 'super_admin' },
      })
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last super admin' },
          { status: 400 }
        )
      }
    }

    await db.admin.delete({
      where: { id: adminId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Validates that the request comes from an authenticated admin.
 * Checks for an admin session cookie containing the username.
 * Returns null if authenticated, or a NextResponse error if not.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  // Check for admin auth cookie (contains username)
  const adminCookie = request.cookies.get('admin_user')
  if (adminCookie?.value) {
    // Verify the admin still exists in the database
    const admin = await db.admin.findUnique({
      where: { username: adminCookie.value },
    })
    if (admin) {
      return null
    }
  }

  // Check for admin token header (for API clients)
  const adminToken = request.headers.get('x-admin-auth')
  if (adminToken === 'mokamotors-admin-2024') {
    return null
  }

  // Not authenticated
  return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
}

/**
 * Gets the current authenticated admin from the request.
 * Returns the admin object or null if not authenticated.
 */
export async function getCurrentAdmin(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_user')
  if (adminCookie?.value) {
    const admin = await db.admin.findUnique({
      where: { username: adminCookie.value },
    })
    if (admin) {
      return admin
    }
  }
  return null
}

/**
 * Validates that the request comes from a super admin.
 * Returns null if authenticated as super admin, or a NextResponse error if not.
 */
export async function requireSuperAdmin(request: NextRequest): Promise<NextResponse | null> {
  const admin = await getCurrentAdmin(request)

  if (!admin) {
    // Check for admin token header fallback
    const adminToken = request.headers.get('x-admin-auth')
    if (adminToken === 'mokamotors-admin-2024') {
      return null
    }
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
  }

  if (admin.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden. Super admin access required.' }, { status: 403 })
  }

  return null
}

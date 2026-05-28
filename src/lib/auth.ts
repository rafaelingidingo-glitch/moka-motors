import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Validates that the request comes from an authenticated admin.
 * Checks for an admin session cookie or falls back to checking
 * the x-admin-token header (for API-based admin clients).
 * Returns null if authenticated, or a NextResponse error if not.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  // Check for admin auth cookie
  const adminCookie = request.cookies.get('admin_logged_in')
  if (adminCookie?.value === 'true') {
    return null
  }

  // Check for admin token header (for API clients)
  const adminToken = request.headers.get('x-admin-auth')
  if (adminToken === 'mokamotors-admin-2024') {
    return null
  }

  // Not authenticated
  return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
}

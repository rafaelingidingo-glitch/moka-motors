import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { requireAdmin } from '@/lib/auth'

// Allowed file extensions (lowercase, no dots)
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

export async function POST(request: NextRequest) {
  // Auth check — only admins can upload files
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename with sanitized extension
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize extension: extract and validate against allowed list
    const rawExt = path.extname(file.name).toLowerCase().replace(/^\./, '')
    const ext = ALLOWED_EXTENSIONS.includes(rawExt) ? rawExt : file.type.split('/')[1] || 'jpg'
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : 'jpg'

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`

    // ✅ PASTE THIS INSTEAD:
// Convert the file bytes into a browser-readable Base64 data string
const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

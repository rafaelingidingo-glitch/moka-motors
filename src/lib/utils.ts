import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse the JSON-encoded images string from the database.
 * Returns an empty array if parsing fails or the result is not a non-empty array.
 */
export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return []
  } catch {
    return []
  }
}

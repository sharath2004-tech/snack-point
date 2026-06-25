/**
 * Construct full image URL for menu item images.
 * Supports full URLs and relative upload paths in both dev and production.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null

  const rawPath = String(imagePath).trim()

  // If already a full URL, return as-is.
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath
  }

  // Normalize separators from Windows-style stored paths.
  const normalized = rawPath.replace(/\\/g, '/')

  // Prefer configured API URL. In production fallback to Render backend.
  const fallbackApiBase = import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://snack-point.onrender.com/api'
  const apiBase = import.meta.env.VITE_API_URL || fallbackApiBase
  const serverBase = apiBase.replace(/\/api\/?$/, '')

  let path = normalized.startsWith('/') ? normalized : `/${normalized}`

  // Handle paths accidentally stored with /api prefix.
  if (path.startsWith('/api/uploads/')) {
    path = path.replace(/^\/api/, '')
  }

  return `${serverBase}${path}`
}

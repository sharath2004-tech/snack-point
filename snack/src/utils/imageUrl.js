/**
 * Construct full image URL for menu item images
 * Handles both relative paths and full URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // If already a full URL (http:// or https://), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Get API base URL from environment or default to /api
  const apiBase = import.meta.env.VITE_API_URL || '/api'
  
  // Remove /api from the end to get server base URL
  const serverBase = apiBase.replace(/\/api\/?$/, '')
  
  // Ensure imagePath starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  
  // Construct full URL
  return `${serverBase}${path}`
}

import axios from 'axios'

const FALLBACK_API_BASE = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://snack-point.onrender.com/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || FALLBACK_API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

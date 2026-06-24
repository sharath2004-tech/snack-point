import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (role && user?.role !== role) {
    const redirectMap = { admin: '/admin', cook: '/cook', customer: '/' }
    return <Navigate to={redirectMap[user?.role] || '/'} replace />
  }

  return children
}

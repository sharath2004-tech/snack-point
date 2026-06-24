import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Login from "./pages/Login"
import Register from "./pages/Register"
import OrderStatus from "./pages/OrderStatus"
import OrderHistory from "./pages/OrderHistory"
import CookDashboard from "./pages/cook/CookDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#141414",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/menu" element={<><Navbar /><Menu /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-status" element={
              <ProtectedRoute role="customer">
                <><Navbar /><OrderStatus /></>
              </ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute role="customer">
                <><Navbar /><OrderHistory /></>
              </ProtectedRoute>
            } />
            <Route path="/cook" element={
              <ProtectedRoute role="cook">
                <CookDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

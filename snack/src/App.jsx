import { Toaster } from "react-hot-toast"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CartSidebar from "./components/CartSidebar"
import FloatingCartBar from "./components/FloatingCartBar"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Menu from "./pages/Menu"
import OrderHistory from "./pages/OrderHistory"
import OrderStatus from "./pages/OrderStatus"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CookDashboard from "./pages/cook/CookDashboard"

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
          <CartSidebar />
          <FloatingCartBar />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

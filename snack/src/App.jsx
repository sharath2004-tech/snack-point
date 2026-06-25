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
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{
              bottom: 80,
            }}
            toastOptions={{
              duration: 3000,
              className: 'react-hot-toast-slide',
              style: {
                background: "#141414",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
                padding: "12px 16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                maxWidth: "400px",
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
                style: {
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
                style: {
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                },
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

import { AnimatePresence, motion } from 'framer-motion'
import { ChefHat, Flame, LayoutDashboard, LogOut, Menu, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    ...(isAuthenticated && user?.role === 'customer'
      ? [
          { href: '/order-status', label: 'Track Order' },
          { href: '/order-history', label: 'My Orders' },
        ]
      : []),
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-xl border-b border-blue-100 shadow-md shadow-blue-100/60'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F07B25] to-[#FF9A50] flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <Flame size={18} className="text-white" />
              </div>
              <span className="font-black text-xl tracking-tight">
                <span style={{ backgroundImage: 'linear-gradient(135deg,#F07B25,#FF9A50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Snack</span>
                <span className="text-[#00AEEF]"> Point</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-bold transition-all hover:text-[#F07B25] relative group ${
                    location.pathname === link.href ? 'text-[#F07B25]' : 'text-[#1C1C2E]'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F07B25] rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {(!isAuthenticated || user?.role === 'customer') && (
                <button onClick={() => setIsOpen(true)} className="relative p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all group">
                  <ShoppingCart size={20} className="text-[#00AEEF] transition-colors" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F07B25] rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg"
                      >
                        {totalItems > 9 ? '9+' : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {user?.role === 'cook' && (
                    <Link to="/cook" className="hidden sm:flex items-center gap-1.5 text-sm text-[#00AEEF] hover:text-[#F07B25] font-bold transition-colors">
                      <ChefHat size={16} /> Kitchen
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-sm text-[#00AEEF] hover:text-[#F07B25] font-bold transition-colors">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F07B25] to-[#FF9A50] flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-[#1C1C2E] font-semibold hidden sm:block">{user?.name?.split(' ')[0]}</span>
                  </div>
                  <button onClick={handleLogout} title="Logout" className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                    <LogOut size={17} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="text-sm text-[#1C1C2E] hover:text-[#F07B25] font-semibold transition-colors">Sign In</Link>
                  <Link to="/register" className="bg-gradient-to-r from-[#F07B25] to-[#FF9A50] hover:opacity-90 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-orange-200">
                    Get Started
                  </Link>
                </div>
              )}

              <button
                className="md:hidden p-2 text-[#1C1C2E] hover:text-[#F07B25]"
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white backdrop-blur-xl border-t border-blue-100 shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      location.pathname === link.href ? 'bg-blue-50 text-[#00AEEF]' : 'text-[#1C1C2E] hover:text-[#F07B25] hover:bg-blue-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="pt-2 flex gap-2">
                    <Link to="/login" className="flex-1 text-center py-2 border border-blue-200 rounded-lg text-sm text-[#1C1C2E] font-semibold" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link to="/register" className="flex-1 text-center py-2 bg-[#F07B25] rounded-lg text-sm text-white font-bold" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </div>
                )}
                {isAuthenticated && (
                  <>
                    {user?.role === 'cook' && <Link to="/cook" className="block px-3 py-2.5 text-sm text-[#00AEEF] font-bold" onClick={() => setMobileOpen(false)}>🍳 Kitchen</Link>}
                    {user?.role === 'admin' && <Link to="/admin" className="block px-3 py-2.5 text-sm text-[#00AEEF] font-bold" onClick={() => setMobileOpen(false)}>📊 Dashboard</Link>}
                    <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="w-full text-left px-3 py-2.5 text-sm text-red-400">Sign Out</button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

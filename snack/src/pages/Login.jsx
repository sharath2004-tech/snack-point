import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Flame, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'cook') navigate('/cook')
      else navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      admin: { email: 'admin@snackpoint.com', password: 'admin123' },
      cook: { email: 'cook@snackpoint.com', password: 'cook123' },
      customer: { email: 'customer@snackpoint.com', password: 'customer123' },
    }
    setForm(demos[role])
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#FF4500' }} />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#FFB800' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF4500] to-[#FFB800] flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Flame size={22} className="text-white" />
            </div>
            <span className="font-black text-2xl">
              <span style={{ backgroundImage: 'linear-gradient(135deg,#FF4500,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Snack</span>
              <span className="text-white"> Point</span>
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to your Snack Point account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 focus:bg-white/8 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 4px 20px rgba(255,69,0,0.35)' }}
            >
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-3 text-center">Demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[['customer', '🛒'], ['cook', '👨‍🍳'], ['admin', '📊']].map(([role, emoji]) => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="py-2 px-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all capitalize"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {emoji} {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-5">
            New to Snack Point?{' '}
            <Link to="/register" className="text-[#FF4500] hover:text-[#FF6B35] font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

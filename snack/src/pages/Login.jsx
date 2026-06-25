import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Flame } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <div className="min-h-screen bg-[#E8F5FE] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,150,200,0.08),transparent)]" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#00AEEF' }} />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#F07B25' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F07B25] to-[#FF9A50] flex items-center justify-center shadow-xl shadow-orange-200">
              <Flame size={22} className="text-white" />
            </div>
            <span className="font-black text-2xl">
              <span style={{ backgroundImage: 'linear-gradient(135deg,#F07B25,#FF9A50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Snack</span>
              <span className="text-[#00AEEF]"> Point</span>
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-white" style={{ border: '1px solid rgba(0,150,200,0.2)', boxShadow: '0 8px 40px rgba(0,150,200,0.12)' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#1C1C2E] mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm font-semibold">Sign in to your Snack Point account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#1C1C2E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 pr-11 text-sm text-[#1C1C2E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F07B25]">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #F07B25, #FF9A50)', boxShadow: '0 4px 20px rgba(240,123,37,0.35)' }}
            >
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 pt-5 border-t border-blue-100">
            <p className="text-xs text-gray-500 mb-3 text-center font-semibold">Demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[['customer', '🛒'], ['cook', '👨‍🍳'], ['admin', '📊']].map(([role, emoji]) => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="py-2 px-2 rounded-lg text-xs font-bold text-[#1C1C2E] hover:text-[#00AEEF] transition-all capitalize"
                  style={{ background: '#EBF5FB', border: '1px solid rgba(0,150,200,0.2)' }}>
                  {emoji} {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-5">
            New to Snack Point?{' '}
            <Link to="/register" className="text-[#F07B25] hover:text-[#FF9A50] font-bold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

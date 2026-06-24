import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Flame, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const passwordStrength = form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : form.password.length > 0 ? 'weak' : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,184,0,0.1),transparent)]" />
      <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#FF4500' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
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
            <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
            <p className="text-gray-400 text-sm">Join thousands of food lovers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all"
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
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex gap-1 mt-2">
                  {['weak', 'medium', 'strong'].map((level, i) => (
                    <div key={level} className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background: passwordStrength === 'strong' ? '#10B981'
                          : passwordStrength === 'medium' ? (i <= 1 ? '#FFB800' : '#333')
                          : (i === 0 ? '#EF4444' : '#333'),
                      }} />
                  ))}
                  <span className="text-xs ml-1 capitalize" style={{
                    color: passwordStrength === 'strong' ? '#10B981' : passwordStrength === 'medium' ? '#FFB800' : '#EF4444'
                  }}>{passwordStrength}</span>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="py-3 px-4 rounded-xl bg-white/3 border border-white/5">
              {['Free account — no payment info needed', 'Real-time order tracking with token system', 'Order history & status updates'].map(b => (
                <div key={b} className="flex items-center gap-2 text-xs text-gray-400 py-1">
                  <Check size={12} className="text-green-400 flex-shrink-0" /> {b}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 4px 20px rgba(255,69,0,0.35)' }}
            >
              {loading ? 'Creating Account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF4500] hover:text-[#FF6B35] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

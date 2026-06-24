import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, CheckCircle, Clock, ChefHat, Package, Ticket } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { label: 'Order Received', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: Clock, step: 1 },
  preparing: { label: 'Preparing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', icon: ChefHat, step: 2 },
  ready: { label: 'Ready to Collect!', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle, step: 3 },
  completed: { label: 'Completed', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', icon: Package, step: 4 },
}

const STEPS = [
  { key: 'pending', label: 'Received', icon: '📋' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready', icon: '✅' },
  { key: 'completed', label: 'Collected', icon: '🎉' },
]

export default function OrderStatus() {
  const [tokenInput, setTokenInput] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const pollRef = useRef(null)

  const fetchOrder = async (token) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await api.get(`/orders/status/${token}`)
      setOrder(res.data)
      // Start polling if not completed
      if (res.data.status !== 'completed') {
        startPolling(token)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order not found')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (token) => {
    setPolling(true)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/orders/status/${token}`)
        setOrder(prev => {
          if (prev?.status !== res.data.status) {
            const config = STATUS_CONFIG[res.data.status]
            toast.success(`Status updated: ${config.label}`, { icon: '🔔' })
          }
          return res.data
        })
        if (res.data.status === 'completed') {
          clearInterval(pollRef.current)
          setPolling(false)
        }
      } catch {}
    }, 5000)
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!tokenInput.trim()) return toast.error('Enter a token number')
    if (pollRef.current) clearInterval(pollRef.current)
    fetchOrder(tokenInput.trim())
  }

  const config = order ? STATUS_CONFIG[order.status] : null
  const StatusIcon = config?.icon

  return (
    <div className="min-h-screen bg-[#050505] pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4500] to-[#FFB800] justify-center mx-auto mb-4">
              <Ticket size={26} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Track Your Order</h1>
            <p className="text-gray-400">Enter your token number to see real-time status</p>
          </div>

          {/* Token search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="number"
                min="1"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter token number (e.g. 42)"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all text-sm"
              />
            </div>
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 4px 15px rgba(255,69,0,0.3)' }}>
              {loading ? '...' : 'Track'}
            </button>
          </form>

          {/* Order card */}
          {order && config && (
            <motion.div key={order._id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              {/* Status banner */}
              <div className="p-5 rounded-2xl text-center relative overflow-hidden"
                style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                {polling && order.status !== 'completed' && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </div>
                )}
                <div className="text-5xl mb-3">
                  {order.status === 'pending' ? '⏳' : order.status === 'preparing' ? '👨‍🍳' : order.status === 'ready' ? '🎉' : '✅'}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: config.color }}>
                  Token #{order.tokenNumber}
                </div>
                <div className="text-2xl font-black text-white mb-1">{config.label}</div>
                {order.status === 'ready' && (
                  <p className="text-green-300 text-sm mt-2 font-medium">🔔 Your order is ready! Head to the counter to collect.</p>
                )}
              </div>

              {/* Progress steps */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/10" />
                  {STEPS.map((step, i) => {
                    const currentStep = STATUS_CONFIG[order.status]?.step || 0
                    const isDone = i + 1 <= currentStep
                    const isCurrent = i + 1 === currentStep
                    return (
                      <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                        <motion.div
                          animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                          transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            background: isDone ? config.color : 'rgba(255,255,255,0.05)',
                            border: isCurrent ? `2px solid ${config.color}` : '2px solid rgba(255,255,255,0.1)',
                            boxShadow: isCurrent ? `0 0 20px ${config.color}50` : 'none',
                          }}
                        >
                          {step.icon}
                        </motion.div>
                        <span className="text-xs font-medium" style={{ color: isDone ? '#fff' : '#6B7280' }}>{step.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order details */}
              <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white text-sm">Order Details</h3>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                    <span className="text-white font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-black text-[#FFB800] text-base">₹{order.totalAmount}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Placed at: {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ChefHat, CheckCircle, Package, History } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Pending' },
  preparing: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'Preparing' },
  ready: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Ready!' },
  completed: { color: '#6B7280', bg: 'rgba(107,114,128,0.08)', label: 'Completed' },
}

const STATUS_ICONS = { pending: Clock, preparing: ChefHat, ready: CheckCircle, completed: Package }

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF4500] to-[#FFB800] flex items-center justify-center">
            <History size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Order History</h1>
            <p className="text-gray-400 text-sm">Your recent orders</p>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm">Your order history will appear here</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, i) => {
            const statusCfg = STATUS_COLORS[order.status]
            const StatusIcon = STATUS_ICONS[order.status]
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#FF4500] font-black text-lg">#{order.tokenNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
                        style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.color}40` }}>
                        <StatusIcon size={11} />
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {order.items.map((item, j) => (
                        <span key={j} className="text-xs bg-white/5 border border-white/8 text-gray-300 px-2.5 py-1 rounded-lg">
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[#FFB800] font-black text-lg">₹{order.totalAmount}</div>
                    <div className="text-xs text-gray-500">{order.items.reduce((s, i) => s + i.quantity, 0)} items</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../utils/api'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalAmount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setIsOpen(false)
      navigate('/login')
      return
    }
    setPlacing(true)
    try {
      const orderItems = items.map(item => ({
        menuItemId: item._id,
        name: item.name,
        quantity: item.quantity,
      }))
      const res = await api.post('/orders', { items: orderItems })
      const order = res.data
      clearCart()
      setIsOpen(false)
      toast.success(`Order placed! Token #${order.tokenNumber}`, { duration: 5000, icon: '🎉' })
      navigate(`/order-status?token=${order.tokenNumber}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-[70] flex flex-col"
            style={{ background: '#F0F8FF', borderLeft: '1px solid rgba(0,150,200,0.2)', boxShadow: '-4px 0 30px rgba(0,150,200,0.1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#00AEEF]" />
                <h2 className="font-black text-lg text-[#1C1C2E]">Your Order</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#F07B25] rounded-full text-xs font-bold text-white">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Clear cart">
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <X size={18} className="text-[#1C1C2E]" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4 py-16">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">🍔</div>
                    <p className="text-gray-500 text-sm font-semibold">Your cart is empty</p>
                    <button onClick={() => { setIsOpen(false); navigate('/menu') }}
                      className="px-5 py-2 bg-[#F07B25] rounded-full text-sm font-bold text-white hover:bg-[#FF9A50] transition-colors">
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.15)' }}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1C1C2E] truncate">{item.name}</p>
                        <p className="text-xs text-[#F07B25] font-black mt-0.5">₹{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-blue-100 hover:bg-[#00AEEF]/20 flex items-center justify-center transition-colors text-[#00AEEF]">
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-black w-4 text-center text-[#1C1C2E]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-blue-100 hover:bg-[#00AEEF]/20 flex items-center justify-center transition-colors text-[#00AEEF]">
                            <Plus size={10} />
                          </button>
                          <button onClick={() => removeItem(item._id)} className="ml-auto text-gray-600 hover:text-red-400 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-black text-[#1C1C2E] self-start">
                        ₹{item.price * item.quantity}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-blue-100 space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span className="text-[#1C1C2E] font-bold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes & Fees</span><span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-black text-[#1C1C2E] border-t border-blue-100 pt-3">
                  <span>Total</span><span className="text-[#F07B25] text-lg">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: placing ? '#ccc' : 'linear-gradient(135deg, #F07B25, #FF9A50)', boxShadow: '0 4px 20px rgba(240,123,37,0.35)' }}
                >
                  {placing ? 'Placing Order...' : `Place Order · ₹${totalAmount}`}
                </button>
                <p className="text-xs text-gray-500 text-center">You'll receive a token number after placing</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

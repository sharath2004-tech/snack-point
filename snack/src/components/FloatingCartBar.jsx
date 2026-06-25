import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function FloatingCartBar() {
  const { items, totalItems, totalAmount, setIsOpen } = useCart()

  if (totalItems === 0) return null

  // Count unique items
  const uniqueCount = items.length
  const firstName = items[0]?.name ?? ''
  const label =
    uniqueCount === 1
      ? firstName.length > 18 ? firstName.slice(0, 18) + '…' : firstName
      : `${uniqueCount} items added`

  return (
    <AnimatePresence>
      <motion.div
        key="floating-cart"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed bottom-5 left-1/2 z-50 w-full max-w-sm sm:max-w-md"
        style={{ transform: 'translateX(-50%)' }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-white"
          style={{
            background: 'linear-gradient(135deg, #F07B25 0%, #FF9A50 100%)',
            boxShadow: '0 8px 32px rgba(240,123,37,0.55), 0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          {/* Left: icon + label */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag size={22} className="text-white" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-[#F07B25] text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/80 font-semibold leading-none mb-0.5">{label}</p>
              <p className="text-sm font-black leading-none">View Cart</p>
            </div>
          </div>

          {/* Right: total + chevron */}
          <div className="flex items-center gap-2">
            <span className="text-base font-black">₹{totalAmount}</span>
            <ChevronUp size={18} className="opacity-80" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

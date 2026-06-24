import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Minus, Plus, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CATEGORY_EMOJI = {
  Burgers: '🍔', Wraps: '🌯', Fries: '🍟', Drinks: '🥤', Snacks: '🧆', Desserts: '🍨',
}

export default function MenuCard({ item }) {
  const { addItem, updateQuantity, removeItem, items } = useCart()
  const cartItem = items.find(i => i._id === item._id)
  const qty = cartItem?.quantity ?? 0

  const handleDecrease = () => {
    if (qty === 1) removeItem(item._id)
    else updateQuantity(item._id, qty - 1)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#111]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-[#111]">
            {CATEGORY_EMOJI[item.category] || '🍽️'}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {item.isBestseller && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FFB800] text-black text-xs font-bold rounded-full">
              <Star size={10} fill="black" /> Bestseller
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.isVeg ? 'bg-green-500 text-white' : 'bg-red-600 text-white'}`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Category */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 text-gray-200 text-xs rounded-full">
          {CATEGORY_EMOJI[item.category]} {item.category}
        </span>

        {/* Low stock */}
        {item.quantity <= 10 && item.quantity > 0 && (
          <span className="absolute bottom-2 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-orange-500/80 text-white text-xs font-bold rounded-full">
            <Flame size={10} /> Only {item.quantity} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-1">{item.name}</h3>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[#FFB800] font-black text-xl">₹{item.price}</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {item.quantity === 0 ? (
              <motion.span key="soldout"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 bg-white/5">
                Sold Out
              </motion.span>
            ) : qty === 0 ? (
              <motion.button key="add"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => addItem(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 3px 12px rgba(255,69,0,0.3)' }}
              >
                <Plus size={14} /> Add
              </motion.button>
            ) : (
              <motion.div key="stepper"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center gap-0.5 rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,69,0,0.5)', background: 'rgba(255,69,0,0.08)' }}
              >
                <motion.button whileTap={{ scale: 0.85 }} onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center text-[#FF4500] hover:bg-[#FF4500]/20 transition-colors">
                  <Minus size={14} />
                </motion.button>
                <motion.span key={qty}
                  initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="w-6 text-center text-sm font-black text-white select-none">
                  {qty}
                </motion.span>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => addItem(item)}
                  className="w-8 h-8 flex items-center justify-center text-[#FF4500] hover:bg-[#FF4500]/20 transition-colors">
                  <Plus size={14} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

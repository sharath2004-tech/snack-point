import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CATEGORY_EMOJI = {
  Burgers: '🍔', Wraps: '🌯', Fries: '🍟', Drinks: '🥤', Snacks: '🧆', Desserts: '🍨',
}

export default function MenuCard({ item }) {
  const { addItem, updateQuantity, removeItem, items, setIsOpen } = useCart()
  const cartItem = items.find(i => i._id === item._id)
  const qty = cartItem?.quantity ?? 0

  const handleDecrease = () => {
    if (qty === 1) removeItem(item._id)
    else updateQuantity(item._id, qty - 1)
  }

  const AddControl = () => (
    <AnimatePresence mode="wait" initial={false}>
      {item.quantity === 0 ? (
        <motion.span key="soldout"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200">
          Sold Out
        </motion.span>
      ) : qty === 0 ? (
        <motion.button key="add"
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => addItem(item)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6BCB77, #4CAF50)', boxShadow: '0 3px 12px rgba(107,203,119,0.4)' }}
        >
          <Plus size={14} /> Add
        </motion.button>
      ) : (
        <motion.div key="stepper"
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-0.5 rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(107,203,119,0.6)', background: 'rgba(107,203,119,0.12)' }}
        >
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
            <Minus size={14} />
          </motion.button>
          <motion.span key={qty}
            initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-6 text-center text-sm font-black text-[#1C1C2E] select-none">
            {qty}
          </motion.span>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => addItem(item)}
            className="w-8 h-8 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
            <Plus size={14} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  /* ── Order Now action row — shown when qty > 0 ── */
  const CartActions = () => (
    <AnimatePresence>
      {qty > 0 && (
        <motion.div
          key="cart-actions"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-2">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F07B25, #FF9A50)', boxShadow: '0 3px 10px rgba(240,123,37,0.35)' }}
            >
              <ShoppingCart size={12} /> Order Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl"
      style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.1)' }}
    >
      {/* ── Mobile: horizontal layout ── */}
      <div className="flex sm:hidden items-stretch">
        {/* Left: small image */}
        <div className="relative w-28 flex-shrink-0 overflow-hidden bg-blue-50">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full min-h-[110px] flex items-center justify-center text-4xl bg-blue-100">
              {CATEGORY_EMOJI[item.category] || '🍽️'}
            </div>
          )}
          {/* Veg badge on image */}
          <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Right: content */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-extrabold text-[#1C1C2E] text-sm leading-tight line-clamp-1">{item.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
          </div>

          {/* Price + Add side by side */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-[#F07B25] font-black text-lg">₹{item.price}</span>
            <AddControl />
          </div>
          <CartActions />
        </div>
      </div>

      {/* ── Desktop: vertical card layout ── */}
      <div className="hidden sm:flex flex-col">
        {/* Image */}
          <div className="relative h-44 overflow-hidden bg-blue-50">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-blue-100">
              {CATEGORY_EMOJI[item.category] || '🍽️'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Veg / Non-Veg only */}
          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-bold ${item.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="font-extrabold text-[#1C1C2E] text-base leading-tight line-clamp-1">{item.name}</h3>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#F07B25] font-black text-xl">₹{item.price}</span>
            <AddControl />
          </div>
          <CartActions />
        </div>
      </div>
    </motion.div>
    </>
  )
}

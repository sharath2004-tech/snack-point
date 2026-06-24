import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/MenuCard'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Burgers', 'Wraps', 'Fries', 'Drinks', 'Snacks', 'Desserts']

const CATEGORY_EMOJI = {
  All: '🍽️', Burgers: '🍔', Wraps: '🌯', Fries: '🍟', Drinks: '🥤', Snacks: '🧆', Desserts: '🍨',
}

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const { setIsOpen, totalItems } = useCart()

  const fetchMenu = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeCategory !== 'All') params.category = activeCategory
      if (search) params.search = search
      const res = await api.get('/menu', { params })
      setItems(res.data)
    } catch (err) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search])

  useEffect(() => {
    const debounce = setTimeout(fetchMenu, 300)
    return () => clearTimeout(debounce)
  }, [fetchMenu])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    if (cat !== 'All') setSearchParams({ category: cat })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search for burgers, fries, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4500]/60 focus:bg-white/8 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#FF4500] text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{CATEGORY_EMOJI[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">
              {activeCategory === 'All' ? "Today's Menu" : `${CATEGORY_EMOJI[activeCategory]} ${activeCategory}`}
            </h1>
            {!loading && (
              <p className="text-gray-500 text-sm mt-0.5">
                {items.length} item{items.length !== 1 ? 's' : ''} available
                {search && ` for "${search}"`}
              </p>
            )}
          </div>
          {totalItems > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 4px 15px rgba(255,69,0,0.3)' }}
            >
              🛒 View Cart ({totalItems})
            </motion.button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        )}

        {/* Menu grid */}
        {!loading && items.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {items.map(item => <MenuCard key={item._id} item={item} />)}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-bold text-white">No items found</h3>
            <p className="text-gray-400 text-sm text-center max-w-xs">
              {search ? `No results for "${search}". Try a different search.` : 'No items available in this category today.'}
            </p>
            {(search || activeCategory !== 'All') && (
              <button onClick={() => { setSearch(''); setActiveCategory('All'); setSearchParams({}) }}
                className="px-5 py-2 bg-[#FF4500] rounded-full text-sm font-semibold text-white hover:bg-[#FF6B35] transition-colors">
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

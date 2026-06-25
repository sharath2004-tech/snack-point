import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import MenuCard from '../components/MenuCard'
import { useCart } from '../context/CartContext'
import api from '../utils/api'

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
    <div className="min-h-screen bg-[#E8F5FE] pt-20">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white/90 backdrop-blur-xl sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for burgers, fries, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-blue-50 border border-blue-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1C1C2E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F07B25]">
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
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#F07B25] text-white shadow-md shadow-orange-200'
                      : 'bg-blue-50 text-[#1C1C2E] hover:bg-blue-100 border border-blue-200'
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
            <h1 className="text-xl font-black text-[#1C1C2E]">
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
              style={{ background: 'linear-gradient(135deg, #F07B25, #FF9A50)', boxShadow: '0 4px 15px rgba(240,123,37,0.35)' }}
            >
              🛒 View Cart ({totalItems})
            </motion.button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-72 rounded-2xl animate-pulse bg-blue-100" />
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
            <h3 className="text-xl font-black text-[#1C1C2E]">No items found</h3>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              {search ? `No results for "${search}". Try a different search.` : 'No items available in this category today.'}
            </p>
            {(search || activeCategory !== 'All') && (
              <button onClick={() => { setSearch(''); setActiveCategory('All'); setSearchParams({}) }}
                className="px-5 py-2 bg-[#F07B25] rounded-full text-sm font-bold text-white hover:bg-[#FF9A50] transition-colors">
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

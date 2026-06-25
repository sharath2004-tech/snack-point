import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Clock, Search, Shield, Star, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import MenuCard from '../components/MenuCard'
import { useCart } from '../context/CartContext'
import api from '../utils/api'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['All', 'Burgers', 'Wraps', 'Fries', 'Drinks', 'Snacks', 'Desserts']
const CATEGORY_EMOJI = { All: '🍽️', Burgers: '🍔', Wraps: '🌯', Fries: '🍟', Drinks: '🥤', Snacks: '🧆', Desserts: '🍨' }



export default function Home() {
  const heroTextRef = useRef()
  const menuRef = useRef()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [vegFilter, setVegFilter] = useState('all') // 'all' | 'veg' | 'nonveg'
  const { } = useCart()

  const fetchMenu = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeCategory !== 'All') params.category = activeCategory
      if (search) params.search = search
      const res = await api.get('/menu', { params })
      setItems(res.data)
    } catch {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search])

  useEffect(() => {
    const t = setTimeout(fetchMenu, 300)
    return () => clearTimeout(t)
  }, [fetchMenu])

  const scrollToMenu = (filter) => {
    setVegFilter(filter)
    setActiveCategory('All')
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = items.filter(item => {
    if (vegFilter === 'veg') return item.isVeg === true
    if (vegFilter === 'nonveg') return item.isVeg === false
    return true
  })

  useEffect(() => {
    // Hero text animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-title span', {
        y: 80, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 0.3,
      })
      gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' })
      gsap.from('.hero-btns', { y: 20, opacity: 0, duration: 0.8, delay: 0.95, ease: 'power2.out' })
      gsap.from('.hero-stats', { y: 20, opacity: 0, duration: 0.8, delay: 1.1, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#E8F5FE] text-[#1C1C2E] overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* ── delicious-3d-burger-with-mountains-scenery — Full Page Background ── */}

        {/* Layer 1 — The actual image, Ken Burns slow zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/images/delicious-3d-burger-with-mountains-scenery.jpg"
            alt="Delicious 3D Burger with Mountains Scenery"
            initial={{ scale: 1.10 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 9, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.78) saturate(1.3) contrast(1.08)' }}
          />
        </div>

        {/* Layer 2 — Deep cinematic blue-teal tint (colour grade) */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(5, 14, 32, 0.28)' }} />

        {/* Layer 3 — Sky atmospheric glow — electric blue at top */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 130% 52% at 50% -6%, rgba(0,174,239,0.50) 0%, transparent 65%)' }} />

        {/* Layer 4 — Warm sunset / burger glow — right-centre */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 58% 68% at 76% 55%, rgba(240,123,37,0.42) 0%, rgba(200,40,10,0.15) 50%, transparent 72%)' }} />

        {/* Layer 5 — Cool blue accent on left edge */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 55% at 0% 60%, rgba(0,140,220,0.28) 0%, transparent 65%)' }} />

        {/* Layer 6 — Vignette — dark edges for cinematic focus */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 92% 82% at 50% 50%, transparent 32%, rgba(4,10,22,0.60) 100%)' }} />

        {/* Layer 7 — Left-to-right text readability gradient */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, rgba(4,10,22,0.96) 0%, rgba(4,10,22,0.82) 28%, rgba(4,10,22,0.50) 52%, rgba(4,10,22,0.12) 72%, transparent 88%)' }} />

        {/* Layer 8 — Bottom fade dissolves into pale-blue page */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #E8F5FE 0%, rgba(232,245,254,0.5) 60%, transparent 100%)' }} />

        {/* Hero Content */}
        <div ref={heroTextRef} className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-24 sm:pt-0 sm:pb-0">
          <div className="max-w-xl lg:max-w-2xl flex flex-col gap-5">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold self-start"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', color: '#FFD88A' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD88A] animate-pulse" />
              Now Open · Fresh Orders Daily
            </motion.div>

            {/* Heading */}
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              <span className="block overflow-hidden"><span className="block text-white drop-shadow-lg">Crave It.</span></span>
              <span className="block overflow-hidden">
                <span className="block" style={{ backgroundImage: 'linear-gradient(135deg,#F07B25,#FF9A50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Order It.
                </span>
              </span>
              <span className="block overflow-hidden"><span className="block text-[#7DD3FC] drop-shadow-lg">Love It.</span></span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub text-white/90 text-base sm:text-lg leading-relaxed max-w-md">
              Premium snacks crafted fresh on demand. Place your order, grab your token, and collect when it's hot — no waiting blindly.
            </p>

            {/* Divider */}
            <div className="w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#F07B25,transparent)' }} />

            {/* CTA Buttons */}
            <div className="hero-btns flex flex-wrap items-center gap-3">
              <Link to="/menu"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95 text-sm"
                style={{ background: 'linear-gradient(135deg, #F07B25, #FF9A50)', boxShadow: '0 6px 30px rgba(240,123,37,0.5)' }}
              >
                Order Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Snack category quick-access tags */}
            <div className="flex flex-wrap gap-2.5">
              <button onClick={() => scrollToMenu('nonveg')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #E65100, #FF8F00)', boxShadow: '0 4px 20px rgba(230,81,0,0.5)' }}
              >
                🥚 View Egg Snacks
              </button>
              <button onClick={() => scrollToMenu('veg')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1B5E20, #43A047)', boxShadow: '0 4px 20px rgba(27,94,32,0.5)' }}
              >
                🥗 View Veg Snacks
              </button>
            </div>

            {/* Quick stats */}
            <div className="hero-stats flex flex-wrap gap-4 sm:gap-6 pt-1">
              {[{ icon: Clock, text: 'Ready in 15 min' }, { icon: Star, text: '4.9 Rated' }, { icon: Shield, text: 'Always Fresh' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-white font-bold">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Icon size={13} className="text-[#FFD88A]" />
                  </div>
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-0.5 h-10 bg-gradient-to-b from-white/60 to-transparent rounded-full" />
          <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── Full Menu Section ── */}
      <section ref={menuRef} className="py-10 bg-[#E8F5FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C1C2E] mb-2">
              Our{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#F07B25,#FF9A50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Menu
              </span>
            </h2>
            <p className="text-gray-500 font-semibold text-sm">Fresh made to order · Every day</p>
          </div>

          {/* Filter bar */}
          <div className="sticky top-16 z-30 bg-[#E8F5FE]/95 backdrop-blur-md pb-3 pt-2 mb-6">
            {/* Veg / Non-Veg toggle */}
            <div className="flex gap-2 mb-3 justify-center">
              {[{ id: 'all', label: '🍽️ All Items' }, { id: 'veg', label: '🥗 Veg Only' }, { id: 'nonveg', label: '🥚 Egg / Non-Veg' }].map(f => (
                <button key={f.id} onClick={() => setVegFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    vegFilter === f.id
                      ? 'bg-[#F07B25] text-white shadow-md shadow-orange-200'
                      : 'bg-white text-[#1C1C2E] border border-blue-200 hover:border-[#F07B25]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search + Category row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#1C1C2E] placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F07B25]">
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? 'bg-[#F07B25] text-white shadow-sm'
                        : 'bg-white text-[#1C1C2E] border border-blue-200 hover:border-[#F07B25]'
                    }`}
                  >
                    <span>{CATEGORY_EMOJI[cat]}</span> {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white animate-pulse" style={{ height: 260, border: '1px solid rgba(0,150,200,0.12)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="font-bold text-lg">No items found</p>
              <p className="text-sm mt-1">Try a different filter or search term</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((item, i) => (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── removed: Stats, Categories, How It Works, Features, CTA ── */}

      <Footer />
    </div>
  )
}

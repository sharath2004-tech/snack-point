import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ChefHat, Clock, Shield, Star, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  { emoji: '🍔', label: 'Burgers', desc: 'Smash, Classic, Gourmet' },
  { emoji: '🌯', label: 'Wraps', desc: 'Crispy & Grilled' },
  { emoji: '🍟', label: 'Fries', desc: 'Loaded, Masala, Peri-Peri' },
  { emoji: '🥤', label: 'Drinks', desc: 'Shakes & Sodas' },
  { emoji: '🧆', label: 'Snacks', desc: 'Rings, Nuggets, Sticks' },
  { emoji: '🍨', label: 'Desserts', desc: 'Ice Cream & Brownies' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '🛒', title: 'Browse & Select', desc: 'Explore our mouth-watering menu and add your favorites to cart.' },
  { step: '02', icon: '🎫', title: 'Get Your Token', desc: 'Place your order and receive a unique token number instantly.' },
  { step: '03', icon: '👨‍🍳', title: 'We Prepare', desc: 'Our chefs craft your order fresh with premium ingredients.' },
  { step: '04', icon: '✅', title: 'Collect & Enjoy', desc: 'Your token turns green when ready — collect and enjoy!' },
]

const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Orders Daily' },
  { value: '4.9★', label: 'Rating' },
  { value: '<15min', label: 'Avg. Wait Time' },
]

export default function Home() {
  const heroTextRef = useRef()
  const sectionsRef = useRef([])
  const statsRef = useRef()

  useEffect(() => {
    // Hero text animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-title span', {
        y: 80, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 0.3,
      })
      gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' })
      gsap.from('.hero-btns', { y: 20, opacity: 0, duration: 0.8, delay: 0.95, ease: 'power2.out' })
      gsap.from('.hero-stats', { y: 20, opacity: 0, duration: 0.8, delay: 1.1, ease: 'power2.out' })

      // Scroll animations
      gsap.from('.category-card', {
        scrollTrigger: { trigger: '.categories-section', start: 'top 80%' },
        y: 50, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
      })
      gsap.from('.how-step', {
        scrollTrigger: { trigger: '.how-section', start: 'top 75%' },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out',
      })
      gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
        scale: 0.85, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Burger image background with Ken Burns zoom */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/images/hero-burger.jpg"
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="w-full h-full object-cover object-[65%_center]"
            style={{ filter: 'brightness(0.45) saturate(1.3)' }}
          />
        </div>

        {/* Left-to-right dark gradient so text is readable */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, rgba(5,5,5,0.96) 30%, rgba(5,5,5,0.55) 65%, rgba(5,5,5,0.15) 100%)' }} />
        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }} />
        {/* Subtle orange glow at center-right where burger sits */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 75% 50%, rgba(255,69,0,0.12) 0%, transparent 70%)' }} />

        {/* Hero Content */}
        <div ref={heroTextRef} className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-xl lg:max-w-2xl flex flex-col gap-6">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold self-start"
              style={{ background: 'rgba(255,69,0,0.15)', border: '1px solid rgba(255,69,0,0.35)', color: '#FF6B35' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
              Now Open · Fresh Orders Daily
            </motion.div>

            {/* Heading */}
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              <span className="block overflow-hidden"><span className="block text-white">Crave It.</span></span>
              <span className="block overflow-hidden">
                <span className="block" style={{ backgroundImage: 'linear-gradient(135deg,#FF4500,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Order It.
                </span>
              </span>
              <span className="block overflow-hidden"><span className="block text-white">Love It.</span></span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub text-gray-300 text-base sm:text-lg leading-relaxed max-w-md">
              Premium snacks crafted fresh on demand. Place your order, grab your token, and collect when it's hot — no waiting blindly.
            </p>

            {/* Divider */}
            <div className="w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#FF4500,transparent)' }} />

            {/* Buttons */}
            <div className="hero-btns flex flex-wrap items-center gap-3">
              <Link to="/menu"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95 text-sm"
                style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 6px 30px rgba(255,69,0,0.4)' }}
              >
                Order Now <ArrowRight size={16} />
              </Link>
              <Link to="/menu"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:bg-white/15 text-sm"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                View Menu
              </Link>
            </div>

            {/* Quick stats */}
            <div className="hero-stats flex flex-wrap gap-6 pt-2">
              {[{ icon: Clock, text: 'Ready in 15 min' }, { icon: Star, text: '4.9 Rated' }, { icon: Shield, text: 'Always Fresh' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,69,0,0.12)' }}>
                    <Icon size={13} className="text-[#FF4500]" />
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
            className="w-0.5 h-10 bg-gradient-to-b from-[#FF4500] to-transparent rounded-full" />
          <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="stats-section py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0505] to-[#050505]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat-card text-center p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-3xl font-black mb-1" style={{ backgroundImage: 'linear-gradient(135deg,#FF4500,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {value}
                </div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="categories-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              What Are You{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#FF4500,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Craving?
              </span>
            </h2>
            <p className="text-gray-400 text-base">Six categories, endless deliciousness</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(({ emoji, label, desc }) => (
              <Link key={label} to={`/menu?category=${label}`}
                className="category-card group p-5 rounded-2xl text-center transition-all hover:scale-105 hover:border-[#FF4500]/50 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{label}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_50%,rgba(255,69,0,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              How It{' '}
              <span style={{ backgroundImage: 'linear-gradient(135deg,#FF4500,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Works
              </span>
            </h2>
            <p className="text-gray-400">Order in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon, title, desc }, i) => (
              <div key={step} className="how-step relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 h-0.5 bg-gradient-to-r from-[#FF4500]/40 to-transparent z-10" />
                )}
                <div className="p-6 rounded-2xl h-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs font-black text-[#FF4500] mt-1">{step}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Real-time order tracking with token system. Know exactly when to collect.', color: '#FFB800' },
              { icon: ChefHat, title: 'Expert Chefs', desc: 'Every item made fresh to order by experienced culinary professionals.', color: '#FF4500' },
              { icon: Star, title: 'Premium Quality', desc: 'Only the finest ingredients used. No compromises on taste or freshness.', color: '#10B981' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.15), rgba(255,184,0,0.1))', border: '1px solid rgba(255,69,0,0.3)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,69,0,0.1),transparent_70%)]" />
            <div className="relative">
              <div className="text-5xl mb-4">🍔</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Eat Something Amazing?
              </h2>
              <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
                Join thousands of happy customers. Order now, get your token, and enjoy premium snacks made just for you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/menu"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-base transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 6px 30px rgba(255,69,0,0.4)' }}
                >
                  Start Ordering <ArrowRight size={18} />
                </Link>
                <Link to="/register"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-base transition-all hover:bg-white/15"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

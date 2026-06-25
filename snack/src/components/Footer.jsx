import { Flame } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-[#D1E8F7] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F07B25] to-[#FF9A50] flex items-center justify-center">
                <Flame size={18} className="text-white" />
              </div>
              <span className="font-black text-xl">
                <span style={{ backgroundImage: 'linear-gradient(135deg,#F07B25,#FF9A50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Snack</span>
                <span className="text-[#00AEEF]"> Point</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Premium snacks, crafted with love. Order fresh, receive fast. Your token is your ticket to deliciousness.
            </p>
            <div className="flex gap-3 mt-5">
              {['📸', '🐦', '👍'].map((emoji, i) => (
                <div key={i} className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-base hover:border-[#00AEEF] transition-all cursor-pointer">
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-[#F07B25] mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/order-status', 'Track Order'], ['/order-history', 'My Orders']].map(([href, label]) => (
                <li key={href}><Link to={href} className="text-gray-600 hover:text-[#F07B25] text-sm font-semibold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#00AEEF] mb-4 text-sm uppercase tracking-wide">Categories</h4>
            <ul className="space-y-2.5">
              {['🍔 Burgers', '🌯 Wraps', '🍟 Fries', '🥤 Drinks', '🧆 Snacks', '🍨 Desserts'].map(cat => (
                <li key={cat}><span className="text-gray-600 text-sm font-semibold">{cat}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs font-semibold">© 2024 Snack Point. All rights reserved.</p>
          <p className="text-gray-500 text-xs font-semibold">Built with ❤️ and 🍔</p>
        </div>
      </div>
    </footer>
  )
}

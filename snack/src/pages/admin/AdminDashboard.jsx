import { AnimatePresence, motion } from 'framer-motion'
import {
    Clock,
    Download,
    Flame,
    ImagePlus,
    LayoutDashboard,
    LogOut,
    Pencil,
    Plus,
    RefreshCw,
    ShoppingBag, Star,
    Trash2,
    TrendingUp,
    Users, UtensilsCrossed,
    X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const PIE_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#6B7280']

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-black text-[#1C1C2E] mb-0.5">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
    {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
  </div>
)

const customTooltipStyle = {
  contentStyle: { background: '#111', border: '1px solid rgba(0,150,200,0.18)', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: '#fff' },
  itemStyle: { color: '#ccc' },
}

const CATEGORIES = ['Burgers', 'Wraps', 'Fries', 'Drinks', 'Snacks', 'Desserts']
const BLANK_ITEM = { name: '', description: '', price: '', category: 'Burgers', quantity: 50, image: '', isVeg: false }

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderFilter, setOrderFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(BLANK_ITEM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, ordersRes, usersRes, menuRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/orders', { params: { limit: 30 } }),
        api.get('/admin/users'),
        api.get('/menu'),
      ])
      setAnalytics(analyticsRes.data)
      setOrders(ordersRes.data)
      setUsers(usersRes.data)
      setMenuItems(menuRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u))
      toast.success('Role updated')
    } catch { toast.error('Update failed') }
  }

  const toggleUserActive = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u))
      toast.success('User status updated')
    } catch { toast.error('Update failed') }
  }

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      toast.success('User deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  // ── Menu management ──
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      setUploading(true)
      const res = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm(f => ({ ...f, image: res.data.url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') } finally { setUploading(false) }
  }

  const openAddForm = () => { setForm(BLANK_ITEM); setEditItem(null); setShowForm(true) }
  const openEditForm = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, quantity: item.quantity, image: item.image || '', isVeg: item.isVeg })
    setEditItem(item)
    setShowForm(true)
  }
  const saveItem = async () => {
    if (!form.name || !form.description || !form.price) return toast.error('Fill required fields')
    try {
      setSaving(true)
      if (editItem) {
        const res = await api.put(`/cook/menu/${editItem._id}`, form)
        setMenuItems(prev => prev.map(i => i._id === editItem._id ? res.data : i))
        toast.success('Item updated')
      } else {
        const res = await api.post('/cook/menu', form)
        setMenuItems(prev => [...prev, res.data])
        toast.success('Item added')
      }
      setShowForm(false)
    } catch { toast.error('Save failed') } finally { setSaving(false) }
  }
  const deleteItem = async (id) => {
    if (!confirm('Delete this menu item?')) return
    try {
      await api.delete(`/cook/menu/${id}`)
      setMenuItems(prev => prev.filter(i => i._id !== id))
      toast.success('Item deleted')
    } catch { toast.error('Delete failed') }
  }

  const exportCSV = () => {
    if (!orders.length) return
    const rows = [
      ['Token', 'Customer', 'Items', 'Total', 'Status', 'Date'],
      ...orders.map(o => [
        o.tokenNumber,
        o.user?.name || 'Guest',
        o.items.map(i => `${i.name}x${i.quantity}`).join('; '),
        o.totalAmount,
        o.status,
        new Date(o.createdAt).toLocaleString(),
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snackpoint-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }

  const filteredOrders = orderFilter ? orders.filter(o => o.status === orderFilter) : orders

  const pieData = analytics ? [
    { name: 'Pending', value: analytics.statusBreakdown.pending },
    { name: 'Preparing', value: analytics.statusBreakdown.preparing },
    { name: 'Ready', value: analytics.statusBreakdown.ready },
    { name: 'Completed', value: analytics.statusBreakdown.completed },
  ].filter(d => d.value > 0) : []

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-[#E8F5FE] text-[#1C1C2E]">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-white/98 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#FFB800] flex items-center justify-center">
              <Flame size={15} className="text-[#1C1C2E]" />
            </div>
            <span className="font-bold text-sm">Admin Dashboard</span>
            <span className="text-xs text-gray-500">· {user?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} className="p-2 rounded-lg bg-white/5 hover:bg-blue-100 border border-white/10 transition-all" title="Refresh">
              <RefreshCw size={14} className="text-gray-400" />
            </button>
            <button onClick={exportCSV} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-gray-600 hover:text-[#1C1C2E] transition-all">
              <Download size={13} /> Export
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-px">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                tab === t.id ? 'border-[#FF4500] text-[#FF4500]' : 'border-transparent text-gray-500 hover:text-[#1C1C2E]'
              }`}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-28 rounded-2xl animate-pulse bg-white/4" />)}
          </div>
        )}

        {!loading && analytics && (
          <>
            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={ShoppingBag} label="Orders Today" value={analytics.ordersToday} color="#FF4500" />
                  <StatCard icon={TrendingUp} label="Revenue Today" value={`₹${analytics.revenueToday.toLocaleString()}`} color="#10B981" />
                  <StatCard icon={Users} label="Total Customers" value={analytics.totalUsers.toLocaleString()} color="#3B82F6" />
                  <StatCard icon={UtensilsCrossed} label="Menu Items" value={analytics.totalMenuItems} color="#FFB800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={TrendingUp} label="Weekly Revenue" value={`₹${analytics.revenueWeek.toLocaleString()}`} color="#8B5CF6" />
                  <StatCard icon={TrendingUp} label="Monthly Revenue" value={`₹${analytics.revenueMonth.toLocaleString()}`} color="#06B6D4" />
                  <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                    <h4 className="text-sm font-bold text-[#1C1C2E] mb-3 flex items-center gap-2"><Clock size={14} className="text-[#F59E0B]" /> Today's Status</h4>
                    {[
                      { label: 'Pending', val: analytics.statusBreakdown.pending, color: '#F59E0B' },
                      { label: 'Preparing', val: analytics.statusBreakdown.preparing, color: '#3B82F6' },
                      { label: 'Ready', val: analytics.statusBreakdown.ready, color: '#10B981' },
                      { label: 'Completed', val: analytics.statusBreakdown.completed, color: '#6B7280' },
                    ].map(s => (
                      <div key={s.label} className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{s.label}</span>
                        <span className="font-bold" style={{ color: s.color }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best sellers */}
                <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                  <h3 className="font-bold text-[#1C1C2E] mb-4 flex items-center gap-2"><Star size={16} className="text-[#FFB800]" /> Best Sellers</h3>
                  <div className="space-y-3">
                    {analytics.bestSellers.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#FFB800] flex items-center justify-center text-xs font-black text-[#1C1C2E]">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white font-medium">{item.name}</span>
                            <span className="text-gray-400">{item.count} sold</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / analytics.bestSellers[0].count) * 100}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #FF4500, #FFB800)' }} />
                          </div>
                        </div>
                        <span className="text-[#FFB800] text-xs font-bold">₹{item.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {tab === 'analytics' && (
              <div className="space-y-6">
                {/* Weekly revenue bar chart */}
                <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                  <h3 className="font-bold text-[#1C1C2E] mb-5">Weekly Revenue (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analytics.weeklyData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,150,200,0.12)" />
                      <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip {...customTooltipStyle} />
                      <Bar dataKey="revenue" name="Revenue (₹)" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF4500" />
                          <stop offset="100%" stopColor="#FFB800" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders line chart */}
                <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                  <h3 className="font-bold text-[#1C1C2E] mb-5">Orders Per Day (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={analytics.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,150,200,0.12)" />
                      <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip {...customTooltipStyle} />
                      <Line type="monotone" dataKey="orders" name="Orders" stroke="#FF4500" strokeWidth={2.5} dot={{ fill: '#FF4500', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                {pieData.length > 0 && (
                  <div className="p-5 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                    <h3 className="font-bold text-[#1C1C2E] mb-5">Today's Order Status Distribution</h3>
                    <div className="flex items-center gap-8">
                      <ResponsiveContainer width={180} height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(0,150,200,0.18)', borderRadius: 8, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {pieData.map((d, i) => (
                          <div key={d.name} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="text-gray-600">{d.name}</span>
                            <span className="text-white font-bold ml-auto">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-2">
                    {['', 'pending', 'preparing', 'ready', 'completed'].map(s => (
                      <button key={s} onClick={() => setOrderFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          orderFilter === s ? 'bg-[#F07B25] text-[#1C1C2E]' : 'bg-white text-[#1C1C2E] border border-blue-200'
                        }`}>
                        {s || 'All'}
                      </button>
                    ))}
                  </div>
                  <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 bg-blue-50 border border-blue-200 hover:text-[#1C1C2E] transition-all">
                    <Download size={12} /> Export CSV
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,150,200,0.18)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-100" style={{ background: '#FFFFFF' }}>
                          {['Token', 'Customer', 'Items', 'Total', 'Status', 'Time'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, i) => {
                          const statusColors = { pending: '#F59E0B', preparing: '#3B82F6', ready: '#10B981', completed: '#6B7280' }
                          const color = statusColors[order.status]
                          return (
                            <tr key={order._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3 font-black" style={{ color: '#FF4500' }}>#{order.tokenNumber}</td>
                              <td className="px-4 py-3 text-gray-600">{order.user?.name || 'Guest'}</td>
                              <td className="px-4 py-3">
                                <div className="text-gray-600 text-xs">
                                  {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-bold text-[#FFB800]">₹{order.totalAmount}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize" style={{ background: `${color}20`, color }}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                      <div className="py-12 text-center text-gray-500 text-sm">No orders found</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── MENU TAB ── */}
            {tab === 'menu' && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-400">{menuItems.length} items</p>
                  <button onClick={openAddForm}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#1C1C2E]"
                    style={{ background: 'linear-gradient(135deg,#FF4500,#FF6B35)' }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {menuItems.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: '#FFFFFF', border: '1px solid rgba(0,150,200,0.18)', boxShadow: '0 2px 12px rgba(0,150,200,0.08)' }}>
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#111]">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1C1C2E] text-sm truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category} · ₹{item.price}</div>
                        <div className={`text-xs mt-0.5 ${item.isVeg ? 'text-green-400' : 'text-red-400'}`}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button onClick={() => openEditForm(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-100 text-gray-400 hover:text-[#1C1C2E] transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteItem(item._id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-400">{users.length} total users</p>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,150,200,0.18)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-blue-100" style={{ background: '#FFFFFF' }}>
                          {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F07B25] to-[#FF9A50] flex items-center justify-center text-xs font-bold text-white">
                                  {u.name[0]}
                                </div>
                                <span className="text-[#1C1C2E] font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                            <td className="px-4 py-3">
                              <select value={u.role} onChange={e => updateUserRole(u._id, e.target.value)}
                                className="bg-white border border-blue-200 rounded-lg px-2 py-1 text-xs text-[#1C1C2E] focus:outline-none focus:border-[#F07B25] cursor-pointer">
                                <option value="customer">Customer</option>
                                <option value="cook">Cook</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => toggleUserActive(u._id, u.isActive)}
                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteUser(u._id)} className="text-gray-600 hover:text-red-400 transition-colors text-xs">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* \u2500\u2500 Menu Add/Edit Modal \u2500\u2500 */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[60] p-6 rounded-2xl"
              style={{ background: '#111', border: '1px solid rgba(0,150,200,0.18)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#1C1C2E]">{editItem ? 'Edit Item' : 'Add New Item'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-100 text-gray-400">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {[['name', 'Name *', 'text'], ['description', 'Description *', 'text']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-[#1C1C2E] focus:outline-none focus:border-[#FF4500]/60 transition-all" />
                  </div>
                ))}
                {/* Image Upload */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Item Image</label>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                  <div className="flex gap-2 items-start">
                    <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,150,200,0.18)' }}>
                      {form.image ? <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                        : <ImagePlus size={22} className="text-gray-600" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                        style={{ background: 'rgba(240,123,37,0.1)', border: '1px solid rgba(240,123,37,0.35)', color: '#F07B25' }}>
                        <ImagePlus size={14} />{uploading ? 'Uploading\u2026' : 'Upload Photo'}
                      </button>
                      <input type="url" placeholder="or paste image URL" value={form.image}
                        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                        className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-[#1C1C2E] placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all" />
                    </div>
                  </div>
                </div>
                {[['price', 'Price (\u20b9) *', 'number'], ['quantity', 'Quantity', 'number']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                    <input type="number" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: +e.target.value }))}
                      className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-[#1C1C2E] focus:outline-none focus:border-[#FF4500]/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-[#1C1C2E] focus:outline-none focus:border-[#F07B25]">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isVeg} onChange={e => setForm(f => ({ ...f, isVeg: e.target.checked }))}
                    className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-600">Vegetarian</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-blue-50 border border-blue-200">Cancel</button>
                <button onClick={saveItem} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#1C1C2E] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)' }}>
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Add Item'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}



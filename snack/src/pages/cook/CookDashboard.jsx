import { AnimatePresence, motion } from 'framer-motion'
import {
    Check,
    ChefHat,
    Flame, ImagePlus, LayoutGrid,
    LogOut,
    Package,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    UtensilsCrossed,
    X
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'preparing', label: 'Preparing', color: '#3B82F6' },
  { value: 'ready', label: 'Ready', color: '#10B981' },
  { value: 'completed', label: 'Completed', color: '#6B7280' },
]

const CATEGORIES = ['Burgers', 'Wraps', 'Fries', 'Drinks', 'Snacks', 'Desserts']
const BLANK_ITEM = { name: '', description: '', price: '', category: 'Burgers', quantity: 50, image: '', isVeg: false }

export default function CookDashboard() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('active')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(BLANK_ITEM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const fileInputRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/cook/orders')
      setOrders(res.data)
    } catch { }
  }, [])

  const fetchMenu = useCallback(async () => {
    try {
      const res = await api.get('/cook/menu')
      setMenuItems(res.data)
    } catch { }
  }, [])

  useEffect(() => {
    Promise.all([fetchOrders(), fetchMenu()]).finally(() => setLoading(false))
  }, [])

  // Auto-refresh orders every 15s
  useEffect(() => {
    if (!autoRefresh || tab !== 'orders') return
    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh, tab, fetchOrders])

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/cook/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success(`Order marked as ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  // Handle image file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      setUploading(true)
      const res = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(f => ({ ...f, image: res.data.url }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const openAddForm = () => {
    setForm(BLANK_ITEM)
    setEditItem(null)
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, quantity: item.quantity, image: item.image || '', isVeg: item.isVeg })
    setEditItem(item)
    setShowForm(true)
  }

  const saveItem = async () => {
    if (!form.name || !form.description || !form.price) return toast.error('Fill required fields')
    setSaving(true)
    try {
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Remove this item?')) return
    try {
      await api.delete(`/cook/menu/${id}`)
      setMenuItems(prev => prev.filter(i => i._id !== id))
      toast.success('Item removed')
    } catch {
      toast.error('Delete failed')
    }
  }

  const toggleAvailable = async (item) => {
    try {
      const res = await api.put(`/cook/menu/${item._id}`, { availableToday: !item.availableToday })
      setMenuItems(prev => prev.map(i => i._id === item._id ? res.data : i))
      toast.success(res.data.availableToday ? 'Item is now available' : 'Item marked unavailable')
    } catch { toast.error('Update failed') }
  }

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'active') return ['pending', 'preparing'].includes(o.status)
    if (statusFilter === 'ready') return o.status === 'ready'
    if (statusFilter === 'completed') return o.status === 'completed'
    return true
  })

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#FFB800] flex items-center justify-center">
              <Flame size={15} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Kitchen Dashboard</span>
              <span className="text-xs text-gray-500 ml-2">Welcome, {user?.name?.split(' ')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAutoRefresh(a => !a)}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all ${autoRefresh ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              Auto
            </button>
            <button onClick={fetchOrders} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <RefreshCw size={15} className="text-gray-400" />
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {[{ id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: pendingCount },
            { id: 'menu', label: 'Menu', icon: LayoutGrid, badge: null }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all relative ${
                tab === t.id ? 'text-white' : 'text-gray-400 hover:text-white bg-white/3 border border-white/10'
              }`}
              style={tab === t.id ? { background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 3px 12px rgba(255,69,0,0.3)' } : {}}>
              <t.icon size={15} />
              {t.label}
              {t.badge > 0 && (
                <span className="w-5 h-5 bg-white text-[#FF4500] text-xs font-black rounded-full flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {/* Status filter */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {[
                { key: 'active', label: `Active (${pendingCount + preparingCount})` },
                { key: 'ready', label: 'Ready' },
                { key: 'completed', label: 'Completed' },
                { key: 'all', label: 'All Today' },
              ].map(f => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === f.key ? 'bg-[#FF4500] text-white' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-40 rounded-2xl animate-pulse bg-white/4" />)}</div>}

            {!loading && filteredOrders.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <div className="text-4xl mb-3">🍽️</div>
                <p>No orders in this category</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredOrders.map(order => {
                  const cfg = STATUS_OPTIONS.find(s => s.value === order.status)
                  return (
                    <motion.div key={order._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                      className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${cfg.color}30` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-2xl font-black" style={{ color: cfg.color }}>#{order.tokenNumber}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{order.user?.name} · {new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.name}</span>
                            <span className="text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold">
                          <span className="text-white">Total</span>
                          <span className="text-[#FFB800]">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(order._id, 'preparing')}
                            className="flex-1 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5"
                            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#3B82F6' }}>
                            <ChefHat size={13} /> Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button onClick={() => updateOrderStatus(order._id, 'ready')}
                            className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                            style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#10B981' }}>
                            <Check size={13} /> Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                            style={{ background: 'rgba(107,114,128,0.15)', border: '1px solid rgba(107,114,128,0.3)', color: '#9CA3AF' }}>
                            <Package size={13} /> Mark Collected
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-400">{menuItems.length} total items</p>
              <button onClick={openAddForm}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)', boxShadow: '0 3px 12px rgba(255,69,0,0.25)' }}>
                <Plus size={15} /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map(item => (
                <div key={item._id} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {item.image && (
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-[#111]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category} · ₹{item.price}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditForm(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteItem(item._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.isVeg ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                    <button onClick={() => toggleAvailable(item)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                        item.availableToday ? 'bg-green-400/15 text-green-400 border border-green-400/25' : 'bg-red-400/10 text-red-400 border border-red-400/20'
                      }`}>
                      {item.availableToday ? '✓ Available' : '✗ Unavailable'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[60] p-6 rounded-2xl"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">{editItem ? 'Edit Item' : 'Add New Item'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {[['name', 'Name *', 'text'], ['description', 'Description *', 'text']].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF4500]/60 transition-all" />
                  </div>
                ))}

                {/* ── Image Upload ── */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Item Image</label>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                    className="hidden" onChange={handleImageUpload} />
                  <div className="flex gap-2 items-start">
                    {/* Preview */}
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {form.image ? (
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus size={22} className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                        style={{ background: 'rgba(255,69,0,0.12)', border: '1px solid rgba(255,69,0,0.35)', color: '#FF6B35' }}
                      >
                        <ImagePlus size={14} />
                        {uploading ? 'Uploading…' : 'Upload Photo'}
                      </button>
                      <input
                        type="url"
                        placeholder="or paste image URL"
                        value={form.image}
                        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]/60 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {[['price', 'Price (₹) *', 'number'], ['quantity', 'Quantity', 'number']].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1">{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: +e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF4500]/60 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isVeg} onChange={e => setForm(f => ({ ...f, isVeg: e.target.checked }))}
                    className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-300">Vegetarian</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-white/5 border border-white/10">
                  Cancel
                </button>
                <button onClick={saveItem} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #FF4500, #FF6B35)' }}>
                  {saving ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

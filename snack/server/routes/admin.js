const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const User = require('../models/User')
const MenuItem = require('../models/MenuItem')
const { protect, authorize } = require('../middleware/auth')

router.use(protect, authorize('admin'))

// GET /api/admin/dashboard - analytics
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Start of week (Monday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1)

    // Start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      allOrders,
      totalUsers,
      totalMenuItems,
    ] = await Promise.all([
      Order.find({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.find({ createdAt: { $gte: startOfWeek, $lt: tomorrow } }),
      Order.find({ createdAt: { $gte: startOfMonth, $lt: tomorrow } }),
      Order.find().limit(1000),
      User.countDocuments({ role: 'customer' }),
      MenuItem.countDocuments(),
    ])

    const revenueToday = ordersToday.reduce((s, o) => s + o.totalAmount, 0)
    const revenueWeek = ordersThisWeek.reduce((s, o) => s + o.totalAmount, 0)
    const revenueMonth = ordersThisMonth.reduce((s, o) => s + o.totalAmount, 0)

    // Best selling items
    const itemSales = {}
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) itemSales[item.name] = { name: item.name, count: 0, revenue: 0 }
        itemSales[item.name].count += item.quantity
        itemSales[item.name].revenue += item.price * item.quantity
      })
    })
    const bestSellers = Object.values(itemSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Weekly revenue for chart (last 7 days)
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      const dayOrders = allOrders.filter(o => o.createdAt >= date && o.createdAt < nextDate)
      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
        orders: dayOrders.length,
      })
    }

    // Order status breakdown today
    const statusBreakdown = {
      pending: ordersToday.filter(o => o.status === 'pending').length,
      preparing: ordersToday.filter(o => o.status === 'preparing').length,
      ready: ordersToday.filter(o => o.status === 'ready').length,
      completed: ordersToday.filter(o => o.status === 'completed').length,
    }

    res.json({
      ordersToday: ordersToday.length,
      revenueToday,
      revenueWeek,
      revenueMonth,
      totalUsers,
      totalMenuItems,
      bestSellers,
      weeklyData,
      statusBreakdown,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { name, role, isActive } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isActive },
      { new: true, runValidators: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/orders - all orders with filters
router.get('/orders', async (req, res) => {
  try {
    const { status, date, limit = 50 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      filter.createdAt = { $gte: d, $lt: next }
    }
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

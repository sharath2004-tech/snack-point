const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const MenuItem = require('../models/MenuItem')
const { protect, authorize } = require('../middleware/auth')

// POST /api/orders - customer: place order
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { items, specialInstructions } = req.body
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' })
    }

    // Verify items and calculate total
    let totalAmount = 0
    const orderItems = []
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId)
      if (!menuItem || !menuItem.availableToday) {
        return res.status(400).json({ message: `Item '${item.name}' is not available` })
      }
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      })
      totalAmount += menuItem.price * item.quantity
    }

    const tokenNumber = await Order.getNextToken()

    const order = await Order.create({
      user: req.user._id,
      tokenNumber,
      items: orderItems,
      totalAmount,
      specialInstructions: specialInstructions || '',
    })

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/my - customer: get own orders
router.get('/my', protect, authorize('customer'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/status/:tokenNumber - customer: track by token
router.get('/status/:tokenNumber', protect, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const order = await Order.findOne({
      tokenNumber: parseInt(req.params.tokenNumber),
      createdAt: { $gte: today },
    }).populate('user', 'name')

    if (!order) return res.status(404).json({ message: 'Order not found for today' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders - cook/admin: all orders (today)
router.get('/', protect, authorize('cook', 'admin'), async (req, res) => {
  try {
    const { status, date } = req.query
    const filter = {}
    if (status) filter.status = status

    // Default: today's orders
    const queryDate = date ? new Date(date) : new Date()
    queryDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(queryDate)
    nextDay.setDate(nextDay.getDate() + 1)
    filter.createdAt = { $gte: queryDate, $lt: nextDay }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: 1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/orders/:id/status - cook/admin: update status
router.put('/:id/status', protect, authorize('cook', 'admin'), async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'preparing', 'ready', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

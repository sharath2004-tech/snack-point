const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const MenuItem = require('../models/MenuItem')
const { protect, authorize } = require('../middleware/auth')

router.use(protect, authorize('cook', 'admin'))

// GET /api/cook/orders - incoming orders for today
router.get('/orders', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { status } = req.query
    const filter = { createdAt: { $gte: today, $lt: tomorrow } }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: 1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/cook/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'preparing', 'ready', 'completed']
    if (!valid.includes(status)) {
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

// GET /api/cook/menu
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/cook/menu
router.post('/menu', async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/cook/menu/:id
router.put('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/cook/menu/:id
router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Item removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItem')
const { protect, authorize } = require('../middleware/auth')

// GET /api/menu - public: all available today items
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = { availableToday: true }
    if (category && category !== 'All') filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/menu/all - cook/admin: all items regardless of availability
router.get('/all', protect, authorize('cook', 'admin'), async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/menu - cook/admin: add new item
router.post('/', protect, authorize('cook', 'admin'), async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/menu/:id - cook/admin: update item
router.put('/:id', protect, authorize('cook', 'admin'), async (req, res) => {
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

// DELETE /api/menu/:id - cook/admin: delete item
router.delete('/:id', protect, authorize('cook', 'admin'), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Item deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

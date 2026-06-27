const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItem')
const { protect, authorize } = require('../middleware/auth')

// Simple in-memory cache with 30s TTL for public menu queries
const menuCache = new Map()
const CACHE_TTL = 30 * 1000

function getCached(key) {
  const entry = menuCache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data
  return null
}

function setCache(key, data) {
  menuCache.set(key, { data, ts: Date.now() })
}

function invalidateCache() {
  menuCache.clear()
}

// GET /api/menu - public: all available today items
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const cacheKey = `${category || 'All'}:${search || ''}`
    const cached = getCached(cacheKey)
    if (cached) return res.json(cached)

    const filter = { availableToday: true }
    if (category && category !== 'All') filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const items = await MenuItem.find(filter)
      .select('-__v -createdAt -updatedAt')
      .sort({ category: 1, name: 1 })
      .lean()

    setCache(cacheKey, items)
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
    invalidateCache()
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
    invalidateCache()
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
    invalidateCache()
    res.json({ message: 'Item deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

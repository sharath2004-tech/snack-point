const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [300, 'Description too long'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Burgers', 'Wraps', 'Fries', 'Drinks', 'Snacks', 'Desserts'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be positive'],
  },
  quantity: {
    type: Number,
    default: 50,
    min: [0, 'Quantity cannot be negative'],
  },
  availableToday: {
    type: Boolean,
    default: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  isBestseller: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

// Compound index for common query: filter by availability + category, sort by name
menuItemSchema.index({ availableToday: 1, category: 1, name: 1 })
// Index for name search (regex queries benefit from this for prefix searches)
menuItemSchema.index({ name: 1 })

module.exports = mongoose.model('MenuItem', menuItemSchema)

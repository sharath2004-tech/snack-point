const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed'],
    default: 'pending',
  },
  specialInstructions: {
    type: String,
    default: '',
    maxlength: 200,
  },
}, { timestamps: true })

// Ensure token numbers are sequential per day
orderSchema.statics.getNextToken = async function () {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const count = await this.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  })
  return count + 1
}

module.exports = mongoose.model('Order', orderSchema)

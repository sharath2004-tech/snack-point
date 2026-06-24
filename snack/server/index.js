const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

dotenv.config()

const app = express()

// ── Security headers ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// ── Gzip compression ──────────────────────────────────────
app.use(compression())

// ── Rate limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again in 15 minutes.' },
})
app.use('/api/', limiter)
app.use('/api/auth', authLimiter)

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))

// ── Static: uploaded menu images ─────────────────────────
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir))

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'))
app.use('/api/menu',   require('./routes/menu'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/admin',  require('./routes/admin'))
app.use('/api/cook',   require('./routes/cook'))
app.use('/api/upload', require('./routes/upload'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Snack Point API running', env: process.env.NODE_ENV })
})

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// ── MongoDB Atlas connection ───────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    })
    console.log('✅ MongoDB Atlas connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    console.error('💡 Check your MONGO_URI in server/.env')
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'))
mongoose.connection.on('reconnected',  () => console.log('🔄 MongoDB reconnected'))

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  })
})

module.exports = app


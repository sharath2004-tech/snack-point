/**
 * Keep-Alive Service for Render
 * Pings the backend every 2 minutes to prevent it from sleeping
 * 
 * Usage:
 * 1. Deploy this as a separate service on Render (or any platform)
 * 2. Set TARGET_URL environment variable to your backend URL
 * 3. This will ping /api/health every 2 minutes
 */

const https = require('https')
const http = require('http')

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5000'
const PING_INTERVAL = 2 * 60 * 1000 // 2 minutes

function pingServer() {
  const url = `${TARGET_URL}/api/health`
  const protocol = url.startsWith('https') ? https : http
  
  const startTime = Date.now()
  
  protocol.get(url, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      const duration = Date.now() - startTime
      console.log(`✅ [${new Date().toISOString()}] Ping successful (${res.statusCode}) - ${duration}ms`)
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(data)
          console.log(`   Response: ${json.message}`)
        } catch (e) {
          console.log(`   Response: ${data.substring(0, 100)}`)
        }
      }
    })
  }).on('error', (err) => {
    console.error(`❌ [${new Date().toISOString()}] Ping failed:`, err.message)
  })
}

// Initial ping
console.log(`🚀 Keep-Alive service started`)
console.log(`🎯 Target: ${TARGET_URL}/api/health`)
console.log(`⏱️  Interval: ${PING_INTERVAL / 1000} seconds\n`)

pingServer()

// Schedule pings every 2 minutes
setInterval(pingServer, PING_INTERVAL)

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Keep-Alive service stopped')
  process.exit(0)
})

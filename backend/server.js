const process = require('process')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { initSocket } = require('./socket')
require('dotenv').config()

// Routes imports
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const symptomRoutes = require('./routes/symptomRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const appointmentRequestRoutes = require('./routes/appointmentRequestRoutes')
const activityLogRoutes = require('./routes/activityLogRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const adminRoutes = require('./routes/adminRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')

// Express app
const app = express()

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true)
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'))) //eslint-disable-line

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CareConnect Backend API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Routes
authRoutes(app)
profileRoutes(app)
symptomRoutes(app)
app.use('/api', appointmentRoutes) // Updated to use router
appointmentRequestRoutes(app)
doctorRoutes(app)
adminRoutes(app)
activityLogRoutes(app)
analyticsRoutes(app)
feedbackRoutes(app)

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) //eslint-disable-line

// MongoDB connection (non-blocking)
const connectToMongoDB = async () => {
  try {
    console.info('🔍 Environment Variables Debug:')
    console.info('NODE_ENV:', process.env.NODE_ENV)
    console.info('PORT:', process.env.PORT)
    console.info('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.info('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0)
    console.info('MONGODB_URI starts with mongodb+srv:', process.env.MONGODB_URI?.startsWith('mongodb+srv://') || false)
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!')
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')))
      return
    }
    
    // Hide credentials in logs but show structure
    const mongoUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    console.info('🔄 Connecting to:', mongoUri)
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      // Removed deprecated options that cause errors
    })
    console.info('✅ Connected to MongoDB successfully')
  } catch (err) {
    console.error('❌ Database connection error:', err.message)
    console.error('Full error:', err)
    // Don't exit process, let server run without DB for now
  }
}

// Connect to MongoDB (don't await - let it happen in background)
connectToMongoDB()

const PORT = process.env.PORT || 10000
const HOST = '0.0.0.0' // Force bind to all interfaces

console.info(`🚀 Starting server...`)
console.info(`📡 Port from env: ${process.env.PORT}`)
console.info(`📡 Port final: ${PORT}`)
console.info(`🏠 Host: ${HOST}`)
console.info(`🔧 Node ENV: ${process.env.NODE_ENV}`)
console.info(`💾 MongoDB URI exists: ${!!process.env.MONGODB_URI}`)

const server = http.createServer(app)

// Start server BEFORE initializing socket to ensure port binding happens first
server.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
  console.info(`✅ Server running on ${HOST}:${PORT}`)
  
  // Initialize socket AFTER server is listening
  initSocket(server)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.info('Process terminated')
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

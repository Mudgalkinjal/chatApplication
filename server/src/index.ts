import express from 'express'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

import connectDB from './config/db'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import transporter from './config/transporter'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to Database
connectDB()

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

// Health Check Route
app.get('/', (req, res) => {
  res.send('Server is running')
})

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app)
console.log('consoling server')
console.log(server)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST'], // Allow necessary HTTP methods
  },
})
console.log('consoling  io')
console.log(io)
console.log('done consoling io')

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('in socket')

  console.log('User connected:', socket.id)

  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data) // Broadcast the message to all clients
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Verify SMTP transporter
transporter.verify((error, success) => {
  console.log('in transporter')

  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP connection successful:', success)
  }
})

// Start the server
const PORT = process.env.PORT || 5001
console.log('here')
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

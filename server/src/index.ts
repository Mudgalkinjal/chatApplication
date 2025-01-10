import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import transporter from './config/transporter'

// Load environment variables
dotenv.config()
//process.env.CLIENT_URL

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())
connectDB()

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('send_message', (data) => {
    io.emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP connection successful:', success)
  }
})

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

// Health Check Route
app.get('/', (req, res) => {
  res.send('Server is running')
})

const PORT = 5001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

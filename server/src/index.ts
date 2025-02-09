import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import friendsRoutes from './routes/friends'
import { initBot } from './utils/initBot'

const app = express()
const server = createServer(app)

// CORS helper
const allowedOrigins = ['http://localhost:3000', process.env.CLIENT_URL]
const corsOptions = {
  origin: (origin: any, callback: Function) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
// Initialize DB & Bot
;(async () => {
  try {
    await connectDB()
    await initBot()
  } catch (err) {
    console.error('Startup error:', err)
    process.exit(1)
  }
})()

// Set up Socket.IO
const io = new Server(server, {
  cors: { ...corsOptions, methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('send_message', (data) => {
    io.emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/friends', friendsRoutes)
app.get('/', (req, res) => res.send('Server is running'))

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

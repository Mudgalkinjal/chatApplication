import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { User } from './models/User'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import friendsRoutes from './routes/friends'
import transporter from './config/transporter'

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP connection successful:', success)
  }
})

dotenv.config()

const app = express()
const server = createServer(app)

const allowedOrigins = ['http://localhost:3000', process.env.CLIENT_URL]

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

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

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/friends', friendsRoutes)

app.get('/', (req, res) => {
  res.send('Server is running')
})

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp')
  .then(async () => {
    console.log('MongoDB connected')

    const botId = '65a000000000000000000000'
    const existingBot = await User.findById(botId)

    if (!existingBot) {
      console.log('Creating Company Support Bot...')

      const hashedPassword = await bcrypt.hash('defaultpassword', 12)

      await User.create({
        _id: new mongoose.Types.ObjectId(botId),
        name: 'Company Support Bot',
        email: 'support@yourapp.com',
        password: hashedPassword,
        isBot: true,
        isVerified: true,
        friends: [],
      })

      console.log('Company Support Bot created successfully.')
    } else {
      console.log('Company Support Bot already exists.')
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = 5001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import authRoutes from './routes/auth'
import chatRoutes from './routes/chat'
import transporter from './config/transporter'

dotenv.config()
console.log('SMTP_HOST:', process.env.SMTP_HOST)
console.log('PORT:', process.env.PORT)
console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing')

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP connection successful:', success)
  }
})

const app = express()
app.use(cors())

// Middleware
app.use(express.json())

// Connect to Database
connectDB()

// Mount the auth routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

// Start Server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

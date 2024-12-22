import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
app.use(cors())

// Middleware
app.use(express.json())

// Connect to Database
connectDB() // Will log a warning if the connection string is not provided

// Mount the auth routes
app.use('/api/auth', authRoutes)

// Start Server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

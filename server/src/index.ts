import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// Connect to Database
connectDB() // Will log a warning if the connection string is not provided

// Routes
app.get('/', (req, res) => {
  res.send('API is running...')
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

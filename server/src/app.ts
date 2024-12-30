import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import chatRoutes from './routes/chat'

const app = express()

// Middleware
app.use(cors()) // Enable CORS for frontend-backend communication
app.use(express.json()) // Parse incoming JSON requests

// MongoDB Connection
const mongoURI = 'your_mongo_connection_string'
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/chat', chatRoutes) // Use your chat routes

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Chat server is running')
})

export default app

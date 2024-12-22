import express from 'express'

const router = express.Router()

// Example route (replace or extend this as needed)
router.get('/', (req, res) => {
  res.send('Auth endpoint is working')
})

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    // Example logic
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

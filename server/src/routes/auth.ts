import express from 'express'

const router = express.Router()

// Example route (replace or extend this as needed)
router.get('/', (req, res) => {
  res.send('Auth endpoint is working')
})

export default router

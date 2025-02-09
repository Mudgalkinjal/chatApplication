import express from 'express'
import { User } from '../models/User'

const router = express.Router()

router.post('/add-friend', async (req, res) => {
  const { userId, friendId } = req.body

  if (!userId || !friendId) {
    return res
      .status(400)
      .json({ error: 'Both userId and friendId are required' })
  }

  try {
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } })

    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } })

    res.json({ message: 'Friend added successfully!' })
  } catch (error) {
    console.error('Error adding friend:', error)
    res.status(500).json({ error: 'Failed to add friend' })
  }
})

router.get('/:userId', async (req, res) => {
  console.log('inside route get user id friends')
  console.log(req.params.userId)
  console.log('---------')

  try {
    const user = await User.findById(req.params.userId).populate(
      'friends',
      'name email'
    )
    console.log('friends loop')
    console.log(user?.friends)
    console.log('---------')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.friends)
  } catch (error) {
    console.error('Error fetching friends:', error)
    res.status(500).json({ error: 'Failed to fetch friends' })
  }
})

export default router

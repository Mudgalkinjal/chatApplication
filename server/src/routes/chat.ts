import express from 'express'

import {
  sendMessage,
  getMessages,
  getUsers,
} from '../controllers/chatController'

const router = express.Router()

router.post('/send', sendMessage)
router.get('/messages', getMessages)
router.get('/getUsers', getUsers)

export default router

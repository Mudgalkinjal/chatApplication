import { Request, Response } from 'express'
import { Chat } from '../models/Chat'
import { User } from '../models/User'

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, message } = req.body

    const chat = new Chat({ sender, receiver, message })
    await chat.save()

    res.status(201).json(chat)
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query

    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

import { Request, Response } from 'express'
import { Chat } from '../models/Chat'
import { User } from '../models/User'
import mongoose from 'mongoose'

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, message } = req.body

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(receiver)
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid sender or receiver ID format' })
    }

    const chat = new Chat({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      message,
    })

    await chat.save()

    res.status(201).json(chat)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const user1 = req.query.user1 as string
    const user2 = req.query.user2 as string

    console.log('Received user1:', user1)
    console.log('Received user2:', user2)

    if (!user1 || !user2) {
      return res
        .status(400)
        .json({ error: 'Both user1 and user2 are required' })
    }

    if (
      !mongoose.Types.ObjectId.isValid(user1) ||
      !mongoose.Types.ObjectId.isValid(user2)
    ) {
      return res.status(400).json({ error: 'Invalid user ID format' })
    }

    const messages = await Chat.find({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(user1),
          receiver: new mongoose.Types.ObjectId(user2),
        },
        {
          sender: new mongoose.Types.ObjectId(user2),
          receiver: new mongoose.Types.ObjectId(user1),
        },
      ],
    }).sort({ timestamp: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { user1 } = req.query

    if (!user1) {
      return res.status(400).json({ error: 'user1Id is required' })
    }

    const user = await User.findById(user1).populate(
      'friends',
      'name email _id'
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user.friends || [])
  } catch (error) {
    console.error('Error fetching friends:', error)
    res.status(500).json({ error: 'Failed to fetch friends' })
  }
}

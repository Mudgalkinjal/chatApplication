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
    const chat = new Chat({ sender, receiver, message })
    await chat.save()

    res.status(201).json(chat)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query

    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }, // Include messages where user1 is the receiver
      ],
    }).sort({ timestamp: 1 }) // Sort by timestamp for chronological order

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

    // Find all users except the one matching user1Id
    const users = await User.find({
      _id: { $ne: user1 }, // Exclude the logged-in user
      isVerified: true, // Only include verified users
    })

    res.status(200).json(users || [])
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

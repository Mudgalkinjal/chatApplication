import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

export const initBot = async () => {
  try {
    const botId = '65a000000000000000000000'
    const existingBot = await User.findById(botId)

    if (!existingBot) {
      console.log('Creating Company Support Bot...')
      const hashedPassword = await bcrypt.hash('defaultpassword', 12)

      await User.create({
        _id: new mongoose.Types.ObjectId(botId),
        name: 'Company Support Bot',
        email: 'support@yourapp.com',
        password: hashedPassword,
        isBot: true,
        isVerified: true,
        friends: [],
      })

      console.log('Company Support Bot created successfully.')
    } else {
      console.log('Company Support Bot already exists.')
    }
  } catch (error) {
    console.error('Error initializing bot:', error)
    throw error
  }
}

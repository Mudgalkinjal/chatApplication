import { User } from '../models/User'

export const getUserDataByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email }).select('-password')
    if (!user) {
      console.log('User not found')
      return null
    }
    return user
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

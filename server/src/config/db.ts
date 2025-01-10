import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || 'your_mongodb_connection_string_here'

    // Log a warning if the default placeholder is used
    if (mongoURI === 'your_mongodb_connection_string_here') {
      console.warn(
        'MONGO_URI is not defined. Using placeholder connection string.'
      )
    }

    // Attempt connection
    await mongoose.connect(mongoURI, {})
  } catch (error) {
    console.error((error as Error).message)
    process.exit(1)
  }
}

export default connectDB

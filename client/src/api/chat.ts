const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'

// Send a Message
export const sendMessage = async (
  sender: string,
  receiver: string,
  message: string
) => {
  const response = await fetch(`${API_URL}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, receiver, message }),
  })
  return response.json()
}

// Get Messages
export const getMessages = async (user1: string, user2: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/chat/messages?user1=${user1}&user2=${user2}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    const data = await response.json()
    return data // Return fetched messages
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export const getUsers = async (user1: string) => {
  const response = await fetch(`${API_URL}/api/chat/getUsers?user1=${user1}`)
  const data = await response.json() // Parse the response body only once
  console.log('Fetched Users:', data) // Log the parsed data
  return data
}

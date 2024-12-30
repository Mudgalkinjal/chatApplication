const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'

// Send a Message
export const sendMessage = async (
  sender: string,
  receiver: string,
  message: string
) => {
  const response = await fetch(`${API_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, receiver, message }),
  })
  return response.json()
}

// Get Messages
export const getMessages = async (user1: string, user2: string) => {
  const response = await fetch(
    `${API_URL}/messages?user1=${user1}&user2=${user2}`
  )
  return response.json()
}

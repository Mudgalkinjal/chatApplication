import React, { useState, useEffect } from 'react'
import { sendMessage, getMessages } from '../api/chat'

const ChatApp = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user1] = useState('User1ID') // Replace with actual user ID
  const [user2] = useState('User2ID') // Replace with actual user ID

  useEffect(() => {
    // Fetch messages when the component loads
    const fetchMessages = async () => {
      const msgs = await getMessages(user1, user2)
      setMessages(msgs)
    }

    fetchMessages()
  }, [user1, user2])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const msg = await sendMessage(user1, user2, newMessage)
    setMessages((prev) => [...prev, msg])
    setNewMessage('')
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === user1 ? 'You' : 'Other'}:</strong>{' '}
            {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}

export default ChatApp

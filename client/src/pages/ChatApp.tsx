import React, { useState, useEffect, useRef } from 'react'
import { sendMessage, getMessages, getFriends } from '../api/chat'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'
const socket = io(API_URL)

const ChatApp = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    name: string
  } | null>(null)
  const [friends, setFriends] = useState<
    { _id: string; name: string; email: string }[]
  >([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Socket listener for incoming messages
  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (data.receiver === currentUser?.id) {
        setMessages((prev) => [...prev, data])
      }
    })
    return () => {
      socket.off('receive_message')
    }
  }, [currentUser])

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('No token found')
        const response = await fetch(`${API_URL}/api/auth/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        setCurrentUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/signin')
      }
    }

    fetchUserData()
  }, [navigate])

  // Fetch friends (which includes the support user)
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser) return
      try {
        const friendsList = await getFriends(currentUser.id)
        setFriends(friendsList || [])
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [currentUser])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !selectedUser) return
      try {
        const msgs = await getMessages(currentUser.id, selectedUser.id)
        setMessages(msgs)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [currentUser, selectedUser])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleUserSelection = (id: string, name: string) => {
    setSelectedUser({ id, name })
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    navigate('/signin')
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedUser) return
    try {
      const msg = await sendMessage(currentUser.id, selectedUser.id, newMessage)
      setMessages((prev) => [...prev, msg])
      socket.emit('send_message', msg)
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!currentUser) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <header className="bg-indigo-600 text-white py-4 px-6 rounded-md mb-6">
        <h1 className="text-xl font-semibold">Welcome, {currentUser.name}</h1>
      </header>
      <main className="grid grid-cols-3 gap-6">
        {/* Friends List */}
        <aside className="col-span-1 bg-gray-100 p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4 text-indigo-600">
            Friends
          </h2>
          {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleUserSelection(friend._id, friend.name)}
              className="py-2 border-b cursor-pointer hover:bg-indigo-50"
            >
              {friend.name}
            </div>
          ))}
          <button
            onClick={handleSignOut}
            className="mt-4 bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Sign Out
          </button>
        </aside>

        {/* Chat Section */}
        <section className="col-span-2 flex flex-col bg-white p-4 rounded-md shadow">
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md">
            {selectedUser ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 p-3 rounded-md ${
                    msg.sender === currentUser.id
                      ? 'bg-indigo-100 text-indigo-800 self-end'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <strong>
                    {msg.sender === currentUser.id
                      ? currentUser.name
                      : selectedUser.name}
                    :
                  </strong>{' '}
                  {msg.message}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-xl mb-2">
                  👋 Select a friend to start chatting!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 p-2 border rounded-md"
              disabled={!selectedUser}
            />
            <button
              onClick={handleSendMessage}
              className={`ml-2 px-4 py-2 rounded-md ${
                selectedUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ChatApp

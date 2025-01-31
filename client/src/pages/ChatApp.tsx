import React, { useState, useEffect, useRef } from 'react'
import { sendMessage, getMessages, getUsers } from '../api/chat'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'
const socket: Socket = io(API_URL)

const ChatApp = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState<{
    name: string
    email: string
    id: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user1, setUser1] = useState('')
  const [user1Name, setUser1Name] = useState('')
  const [user2Name, setUser2Name] = useState('')
  const [user2, setUser2] = useState('')
  const [users, setUsers] = useState<
    { name: string; email: string; id: string }[]
  >([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>(
    {}
  )

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (data.receiver === user1) {
        setMessages((prevMessages) => [...prevMessages, data])

        if (data.sender !== user2) {
          setUnreadMessages((prev) => ({
            ...prev,
            [data.sender]: (prev[data.sender] || 0) + 1,
          }))
        }
      }
    })

    return () => {
      socket.off('receive_message')
    }
  }, [user1, user2])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await fetch(`${API_URL}/api/auth/protected`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUser1(data.user.userId)
        setUser1Name(data.user.name)

        setUserData({
          name: data.user.name,
          email: data.user.email,
          id: data.user.userId,
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(user1)
        console.log(response)

        if (!Array.isArray(response)) {
          console.error('Invalid response format. Expected an array.')
          return
        }
        const filteredUsers = response.map(
          (user: { name: any; email: any; _id: any }) => ({
            name: user.name,
            email: user.email,
            id: user._id,
          })
        )
        setUsers(filteredUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [user1])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user1 || !user2) {
          console.warn('Skipping fetchMessages due to missing user IDs.')
          return
        }

        const msgs = await getMessages(user1, user2)
        setMessages(msgs)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [user1, user2])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loading) {
    return <div className="text-center py-10 text-gray-700">Loading...</div>
  }

  if (!userData) {
    return (
      <div className="text-center py-10 text-red-600">
        Error fetching user data. Please try again later.
      </div>
    )
  }

  const handleUserSelection = (userId: string, userName: string) => {
    setUser2(userId)
    setUser2Name(userName)

    setUnreadMessages((prev) => {
      const updated = { ...prev }
      delete updated[userId]
      return updated
    })
  }
  const handleSignOut = () => {
    setUserData(null)
    navigate('/signin')
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const msg = await sendMessage(user1, user2, newMessage)

      setMessages((prevMessages) => [...prevMessages, msg])

      socket.emit('send_message', msg)

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      {/* Header Section */}
      <header className="bg-indigo-600 text-white py-4 px-6 rounded-md mb-6">
        <h1 className="text-xl font-semibold">Welcome, {userData.name}</h1>
      </header>

      <main className="grid grid-cols-3 gap-6">
        {/* User List */}
        <aside className="col-span-1 bg-gray-100 p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4 text-indigo-600">Users</h2>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelection(user.id, user.name)}
              className="relative py-2 border-b cursor-pointer flex items-center justify-between hover:bg-indigo-50"
            >
              <span className="text-gray-700">{user.name}</span>

              {/* Notification Bubble */}
              {unreadMessages[user.id] && (
                <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadMessages[user.id]}
                </span>
              )}
            </div>
          ))}
          <div className="mt-4 flex">
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 mt-2"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Chat Section */}
        <section className="col-span-2 flex flex-col bg-white p-4 rounded-md shadow">
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md">
            {user2Name ? (
              messages &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-md ${
                    msg.sender === user1
                      ? 'bg-indigo-100 text-indigo-800 self-end'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>
                    <strong>
                      {msg.sender === user1 ? user1Name : user2Name}:
                    </strong>{' '}
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-xl mb-2">
                  👋 Select a user to start chatting!
                </p>
                <p className="text-sm text-gray-400">
                  Browse the user list on the left and click to open a chat.
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
              className={`flex-1 p-2 border rounded-md focus:ring ${
                user2Name
                  ? 'focus:ring-indigo-200'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
              disabled={!user2Name}
            />
            <button
              onClick={handleSendMessage}
              className={`ml-2 px-4 py-2 rounded-md ${
                user2Name
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!user2Name}
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

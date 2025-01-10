import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  function handleSignUpNavigate() {
    navigate('/signup')
  }
  function handleSignInNavigate() {
    navigate('/signin')
  }
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-[#546e04bf] text-white text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to my Chat App!</h1>
        <p className="text-lg mb-8">
          Connect, collaborate, and chat with your communities seamlessly.
        </p>
        <button
          onClick={handleSignUpNavigate}
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
          Join Now
        </button>
        <button
          onClick={handleSignInNavigate}
          className="px-6 py-3 ml-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
          Log In
        </button>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose ChatHub?
          </h2>
          <p className="text-gray-600 text-lg">
            Experience seamless communication and powerful tools for community
            building.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Private & Group Chats
            </h3>
            <p className="text-gray-600">
              Engage in seamless one-on-one or group conversations with
              intuitive chat tools.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customizable Channels
            </h3>
            <p className="text-gray-600">
              Organize your discussions into focused channels for better
              collaboration.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Rich Text & Media Sharing
            </h3>
            <p className="text-gray-600">
              Share images, links, and expressive messages to make conversations
              vibrant and engaging.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

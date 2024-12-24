import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const [message, setMessage] = useState('')

  useEffect(() => {
    switch (status) {
      case 'success':
        setMessage('Email successfully verified!')
        break
      case 'already-verified':
        setMessage('Email is already verified.')
        break
      case 'user-not-found':
        setMessage('User not found.')
        break
      case 'invalid-token':
        setMessage('Invalid or expired token.')
        break
      default:
        setMessage('An error occurred. Please try again.')
    }
  }, [status])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Email Verification
        </h1>
        <p
          className={`text-center text-lg ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail

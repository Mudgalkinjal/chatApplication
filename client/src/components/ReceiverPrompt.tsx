import React, { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface ReceiverPromptProps {
  users: User[]
  onSubmit: (userId: string, userName: string) => void
}

export default function ReceiverPrompt({
  users,
  onSubmit,
}: ReceiverPromptProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedUserName, setSelectedUserName] = useState('')

  function handleSubmit(val: string) {
    setSelectedUserId(val)
    const user = users.find((user) => user.id === val)
    setSelectedUserName(user?.name || '') // Update name based on selected ID
  }

  useEffect(() => {
    onSubmit(selectedUserId, selectedUserName)
  }, [onSubmit, selectedUserId, selectedUserName])

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow">
      <label
        htmlFor="user-select"
        className="block text-sm font-medium text-gray-700"
      >
        Who do you want to send this message to?
      </label>
      <select
        id="user-select"
        value={selectedUserId}
        onChange={(e) => handleSubmit(e.target.value)}
        className="mt-2 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>
          Select a user
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {selectedUserId && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>You selected:</strong> {selectedUserName || 'Unknown'}
        </div>
      )}
    </div>
  )
}

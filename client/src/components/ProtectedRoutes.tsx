import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('authToken') // Check for token in localStorage

  if (!token) {
    return <Navigate to="/signin" /> // Redirect to login if no token
  }

  return children
}

export default ProtectedRoute

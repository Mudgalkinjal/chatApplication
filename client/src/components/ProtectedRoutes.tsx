import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/signin" />
  }

  return children
}

export default ProtectedRoute

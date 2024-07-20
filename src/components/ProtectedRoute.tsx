import React from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../api/firebase/setup'

interface ProtectedRouteProps {
    children: React.ReactNode;
    // isAuthenticated: boolean;
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
    }, [])

    if (loading) return <div>Loading...</div>

    return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute
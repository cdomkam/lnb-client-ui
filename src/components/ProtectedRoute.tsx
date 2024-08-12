import React from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../api/firebase/setup'
import { UserContext } from './context.ts'

interface ProtectedRouteProps {
    children: React.ReactNode;
    // isAuthenticated: boolean;
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null)
    const [fb_user_id, setFbID] = React.useState<string>('')
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
            
            if (user){
                setFbID(user.uid)
            }
        })
    }, [])

    if (loading) return <div>Loading...</div>
    // const UserContext = useUserContext()
    return user ? ( <UserContext.Provider value={{fb_user_id}}>
                        {children}
                    </UserContext.Provider> ) : <Navigate to="/login" />
}

export default ProtectedRoute
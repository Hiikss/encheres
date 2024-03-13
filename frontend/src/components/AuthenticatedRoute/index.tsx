import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

const AuthenticatedRoute = () => {
    const auth = useAuth()

    return auth.user ? <Outlet /> : <Navigate to="/login" />
}

export default AuthenticatedRoute

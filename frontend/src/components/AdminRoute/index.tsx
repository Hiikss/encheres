import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

const AdminRoute = () => {
    const auth = useAuth()

    return auth.user?.admin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute

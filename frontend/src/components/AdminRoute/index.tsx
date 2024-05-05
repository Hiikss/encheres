import { Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import NotFound from '../NotFound';

const AdminRoute = () => {
    const auth = useAuth();

    return auth.user?.admin ? <Outlet /> : <NotFound />;
};

export default AdminRoute

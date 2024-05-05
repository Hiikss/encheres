import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { notification } from 'antd';
import { useEffect } from 'react';

const AuthenticatedRoute = () => {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.user) {
            notification.info({
                message: 'Vous devez être connecté pour accéder à ce contenu',
                duration: 2,
                placement: 'top',
            });
        }
    }, [auth.user]);

    return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthenticatedRoute;

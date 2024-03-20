import { useEffect } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { getAuthToken, useAuth } from '../AuthProvider';
import { notification } from 'antd';

const ResponseInterceptor = () => {
    const auth = useAuth();

    useEffect(() => {

        const interceptor = axiosInstance.interceptors.response.use((response) => {
            return response
            },
            (error) => {
                const status = error.response ? error.response.status : null;

                if (status === 401 && getAuthToken()) {
                    auth.logOut();
                    notification.error({
                        message: 'Une erreur est survenue',
                        description: 'Vous avez été déconnecté',
                        duration: 3,
                        placement: 'top',
                    });
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [auth]);

    return null;
}

export default ResponseInterceptor;
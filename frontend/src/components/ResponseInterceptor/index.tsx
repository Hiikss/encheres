import { useEffect } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import {
    getAuthToken,
    getPseudo,
    getRefreshToken,
    setAuthToken,
    setRefreshToken,
    useAuth,
} from '../AuthProvider';
import { notification } from 'antd';
import { RefreshTokenRequest } from '../../types/RefreshToken';

const ResponseInterceptor = () => {
    const auth = useAuth();

    const refreshToken = async (token: RefreshTokenRequest) => {
        try {
            const response = await axiosInstance.post('/auth/refresh', token);

            setAuthToken(response.data.token, response.data.pseudo);
            setRefreshToken(response.data.refreshToken);
            auth.setUser({
                pseudo: response.data.pseudo,
                lastname: response.data.lastname,
                firstname: response.data.firstname,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber,
                street: response.data.street,
                postalCode: response.data.postalCode,
                city: response.data.city,
                credit: response.data.credit,
                admin: response.data.admin,
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response &&
                    error.response.status === 401 &&
                    originalRequest.url !== '/auth/refresh' &&
                    getAuthToken() &&
                    getRefreshToken() &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    const token: RefreshTokenRequest = {
                        token: getRefreshToken(),
                        pseudo: getPseudo(),
                    };
                    try {
                        await refreshToken(token);
                        return axiosInstance(originalRequest);
                    } catch (err) {
                        auth.logOut();
                        notification.error({
                            message: 'Une erreur est survenue',
                            description: 'Vous avez été déconnecté',
                            duration: 3,
                            placement: 'top',
                        });
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [auth]);

    return null;
};

export default ResponseInterceptor;
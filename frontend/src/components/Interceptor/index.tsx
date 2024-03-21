import { useEffect } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import instance from '../../services/AxiosInstance';
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
import { AxiosRequestConfig } from 'axios';

interface QueueItem {
    config: AxiosRequestConfig;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}

const requestQueue: QueueItem[] = [];
let isRefreshing = false;

const processQueue = (token: RefreshTokenRequest) => {
    while (requestQueue.length > 0) {
        const item = requestQueue.shift();
        if (item) {
            axiosInstance(item.config)
                .then((response) => {
                    item.resolve(response);
                })
                .catch((error) => {
                    item.reject(error);
                });
        }
    }
};

const AxiosInterceptor = () => {
    const auth = useAuth();

    instance.interceptors.request.use((config) => {
        const token = getAuthToken();
        if (token !== null && token !== undefined && token !== 'null') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

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
            isRefreshing = false;
            processQueue(token);
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
                    if (!isRefreshing) {
                        isRefreshing = true;
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
                    } else {
                        return new Promise((resolve, reject) => {
                            requestQueue.push({
                                config: originalRequest,
                                resolve,
                                reject,
                            });
                        });
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

export default AxiosInterceptor;

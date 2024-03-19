import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../../types/User';
import { renewAuthUser } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Flex, notification, Spin } from 'antd';

export type UserContextType = {
    user: any;
    setUser: any;
    loading: boolean;
    logOut: () => void;
    refreshUser: () => void;
};

type UserContextProviderType = {
    children: React.ReactNode;
};

export const AuthContext = createContext({} as UserContextType);

const AuthProvider = ({ children }: UserContextProviderType) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (getAuthToken() !== undefined) {
            renewAuthUser()
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    setAuthToken(null);
                    setUser(null);
                    notification.error({
                        message: 'Une erreur est survenue',
                        description: 'Vous avez été déconnecté',
                        duration: 2,
                        placement: 'top',
                    });
                    navigate('/');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const refreshUser = () => {
        renewAuthUser()
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                setAuthToken(null);
                setUser(null);
                notification.error({
                    message: 'Une erreur est survenue',
                    description: 'Vous avez été déconnecté',
                    duration: 2,
                    placement: 'top',
                });
            });
    };

    const logOut = () => {
        setUser(null);
        setAuthToken(null);
        navigate('/');
    };

    if (loading) {
        return (
            <Flex justify="center" align="center">
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, logOut, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const getAuthToken = () => {
    return Cookies.get('auth_token');
};

export const setAuthToken = (token: any) => {
    if (token !== null) {
        Cookies.set('auth_token', token);
    } else {
        Cookies.remove('auth_token');
    }
};

export const useAuth = () => {
    return useContext(AuthContext);
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../../types/User';
import { refreshAuthUser } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Flex, notification, Spin } from 'antd';
import { RefreshTokenRequest } from '../../types/RefreshToken';

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
const events: string[] = [
    'load',
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress',
];

export const AuthContext = createContext({} as UserContextType);

const AuthProvider = ({ children }: UserContextProviderType) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    let timer: NodeJS.Timer;

    // this function sets the timer that logs out the user after 5 min
    const handleLogoutTimer = () => {
        timer = setTimeout(() => {
            // clears any pending timer.
            resetTimer();
            // Listener clean up. Removes the existing event listener from the window
            Object.values(events).forEach((item) => {
                window.removeEventListener(item, resetTimer);
            });
            if (getAuthToken()) {
                logOut();
                notification.error({
                    message: 'Vous avez été déconnecté pour inactivité',
                    duration: 0,
                    placement: 'top',
                });
            }
        }, 300_000);
    };

    // this resets the timer if it exists.
    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    // when component mounts, it adds an event listeners to the window
    // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 5 min of inactivity resets.
    // However, if none of the event is triggered within 5 min, that is app is inactive, the app automatically logs out.
    useEffect(() => {
        if (user) {
            const eventListener = () => {
                resetTimer();
                handleLogoutTimer();
            };

            events.forEach((item) => {
                window.addEventListener(item, eventListener);
            });

            return () => {
                events.forEach((item) => {
                    resetTimer();
                    window.removeEventListener(item, eventListener);
                });
            };
        }
    }, [user]);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = async () => {
        if (getAuthToken() !== undefined && getPseudo() !== undefined) {
            setLoading(true);
            const token: RefreshTokenRequest = {
                token: getRefreshToken(),
                pseudo: getPseudo(),
            };

            await refreshAuthUser(token)
                .then((res) => {
                    setAuthToken(res.data.token, res.data.pseudo);
                    setRefreshToken(res.data.refreshToken);
                    setUser({
                        pseudo: res.data.pseudo,
                        lastname: res.data.lastname,
                        firstname: res.data.firstname,
                        email: res.data.email,
                        phoneNumber: res.data.phoneNumber,
                        street: res.data.street,
                        postalCode: res.data.postalCode,
                        city: res.data.city,
                        credit: res.data.credit,
                        admin: res.data.admin,
                    });
                })
                .catch((err) => {
                    logOut();
                    notification.error({
                        message: 'Une erreur est survenue',
                        description: 'Vous avez été déconnecté',
                        duration: 2,
                        placement: 'top',
                    });
                });
        }
        setLoading(false);
    };

    const logOut = () => {
        setUser(null);
        setAuthToken(null);
        setRefreshToken(null);
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
            value={{
                user,
                setUser,
                loading,
                logOut,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const getAuthToken = () => {
    return Cookies.get('auth_token');
};

export const getRefreshToken = () => {
    return Cookies.get('auth_refresh');
};

export const getPseudo = () => {
    return Cookies.get('auth_pseudo');
};

export const setAuthToken = (token: any, pseudo?: any) => {
    if (token !== null) {
        Cookies.set('auth_token', token);
        Cookies.set('auth_pseudo', pseudo);
    } else {
        Cookies.remove('auth_token');
        Cookies.remove('auth_pseudo');
    }
};

export const setRefreshToken = (refreshToken: any) => {
    if (refreshToken !== null) {
        Cookies.set('auth_refresh', refreshToken);
    } else {
        Cookies.remove('auth_refresh');
    }
};

export const useAuth = () => {
    return useContext(AuthContext);
};

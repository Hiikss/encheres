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

            if(user) {
                logOut();
                notification.error({
                    message: 'Vous avez été déconnecté pour inactivité',
                    duration: 0,
                    placement: 'top',
                });
            }
        }, 5000);
    };

    // this resets the timer if it exists.
    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    // when component mounts, it adds an event listeners to the window
    // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 5 min of inactivity resets.
    // However, if none of the event is triggered within 5 min, that is app is inactive, the app automatically logs out.
    useEffect(() => {
        if(user) {
            const eventListener = () => {
                resetTimer();
                handleLogoutTimer();
            };

            events.forEach((item) => {
                window.addEventListener(item, eventListener);
            });

            return () => {
                events.forEach((item) => {
                    window.removeEventListener(item, eventListener);
                });
            };
        }
    }, [user]);

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

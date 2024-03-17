import axiosInstance from "../AxiosInstance";
import { RequestUser, Credentials, AuthUser, ResponseUser } from '../../types/User';

export const login = (credentials: Credentials) => {
    return axiosInstance().post('/auth/login', credentials);
}

export const register = (user: RequestUser) => {
    return axiosInstance().post('/auth/register', user)
}

export const getAuthUser = async () => {
    return axiosInstance().get<AuthUser>('/auth').then(res => {
        return res;
    })
}

export const getUser = async (pseudo: string) => {
    return axiosInstance().get<ResponseUser>(`/users/${pseudo}`).then(res => {
        return res;
    })
}

export const updateUser = async (pseudo: string, user: RequestUser) => {
    return axiosInstance().put<ResponseUser>(`/users/${pseudo}`, user).then(res => {
        return res;
    })
}

export const deleteUser = async (pseudo: string) => {
    return axiosInstance().delete(`/users/${pseudo}`).then(res => {
        return res;
    })
}
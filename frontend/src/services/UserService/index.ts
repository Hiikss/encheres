import axiosInstance from "../AxiosInstance";
import { RequestUser, Credentials, AuthUser, ResponseUser, PartialUserRequest } from '../../types/User';
import { RefreshTokenRequest } from '../../types/RefreshToken';

export const login = (credentials: Credentials) => {
    return axiosInstance.post('/auth/login', credentials);
}

export const register = (user: RequestUser) => {
    return axiosInstance.post('/auth/register', user)
}

export const refreshAuthUser = async (token: RefreshTokenRequest) => {
    return axiosInstance.post('/auth/refresh', token).then(res => {
        return res;
    })
}

export const getUsers = async (page: number, size: number, searchFilter: string) => {
    const params: string = `?page=${page}&size=${size}&searchFilter=${searchFilter}`;
    return axiosInstance.get<ResponseUser[]>(`/users${params}`).then(res => {
        return res;
    })
}

export const getUser = async (pseudo: any) => {
    return axiosInstance.get<ResponseUser>(`/users/${pseudo}`).then(res => {
        return res;
    })
}

export const updateUser = async (pseudo: string, user: RequestUser) => {
    return axiosInstance.put<ResponseUser>(`/users/${pseudo}`, user).then(res => {
        return res;
    })
}

export const deleteUser = async (pseudo: string) => {
    return axiosInstance.delete(`/users/${pseudo}`).then(res => {
        return res;
    })
}

export const updatePartiallyUser = async (partialUser: PartialUserRequest) => {
    return axiosInstance.patch(`/users`, partialUser).then(res => {
        return res;
    })
}
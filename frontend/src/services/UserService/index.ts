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
// export const getExample = (user: User) => {
//     return axiosInstance().get<User>('/encheres/api/auth/register').then(response => {
//         return response;
//     })
// }
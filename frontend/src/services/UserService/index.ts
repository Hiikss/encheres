import axiosInstance from "../AxiosInstance";
import {RequestUser, Credentials} from "../../types/User";

export const login = (credentials: Credentials) => {
    return axiosInstance().post('/auth/login', credentials);
}

export const register = (user: RequestUser) => {
    return axiosInstance().post('/auth/register', user)
}

// export const getExample = (user: User) => {
//     return axiosInstance().get<User>('/encheres/api/auth/register').then(response => {
//         return response;
//     })
// }
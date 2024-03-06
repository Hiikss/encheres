import axios from "axios";
import Cookies from 'js-cookie';

export const getAuthToken = () => {
    return Cookies.get('auth_token');
};

export const setAuthHeader = (token: any) => {
    if (token !== null) {
        console.log("cookie set")
        Cookies.set("auth_token", token);
    } else {
        Cookies.remove("auth_token");
    }
};

const axiosInstance = () => {

    const instance = axios.create({
        baseURL: "http://localhost:8080/encheres/api",
        headers: {
            "Content-Type": "application/json"
        }
    });

    let token = getAuthToken();
    if (token !== null && token !== undefined && token !== "null") {
        instance.interceptors.request.use(
            config => {
                config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            }
        )
    }
    return instance;
}

export default axiosInstance;

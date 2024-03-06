import axios from "axios";

export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token: any) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
    } else {
        window.localStorage.removeItem("auth_token");
    }
};

const axiosInstance = () => {

    const instance = axios.create({
        baseURL: "http://localhost:8080/encheres/api",
        headers: {
            "Content-Type": "application/json"
        }
    });

    instance.interceptors.request.use(
        config => {
            config.headers['Authorization'] = `Bearer`;
            return config;
        }
    )
    return instance;
}

export default axiosInstance;

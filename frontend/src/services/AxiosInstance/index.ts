import axios from "axios";

const axiosInstance = () => {
    const instance = axios.create({
        baseURL: "http://localhost:8080/encheres/api",
        headers: {
            "Content-Type": "application/json"
        }
    });
    // instance.interceptors.request.use(
    //     config => {
    //         config.headers['Authorization'] = `Bearer`;
    //         return config;
    //     }
    // )
    return instance;
}

export default axiosInstance;
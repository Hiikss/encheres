import axios from 'axios'
import { getAuthToken } from '../../components/AuthProvider'

const axiosInstance = () => {
    const instance = axios.create({
        baseURL: 'http://localhost:8080/encheres/api',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    let token = getAuthToken()
    if (token !== null && token !== undefined && token !== 'null') {
        instance.interceptors.request.use((config) => {
            config.headers['Authorization'] = `Bearer ${token}`
            return config
        })
    }
    return instance
}

export default axiosInstance;

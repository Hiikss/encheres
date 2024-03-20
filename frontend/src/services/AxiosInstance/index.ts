import axios from 'axios';
import { getAuthToken } from '../../components/AuthProvider';

const instance = axios.create({
    baseURL: 'http://localhost:8080/encheres/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token !== null && token !== undefined && token !== 'null') {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default instance;

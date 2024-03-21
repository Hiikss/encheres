import axios from 'axios';
import { getAuthToken } from '../../components/AuthProvider';

const instance = axios.create({
    baseURL: 'http://localhost:8080/encheres/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;

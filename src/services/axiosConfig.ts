import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL_LOCAL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = authService.getAccessToken();
    if(token) {
        config.headers.Authorization= `Bearer ${token}`
    }
    return config;
})

export default api;
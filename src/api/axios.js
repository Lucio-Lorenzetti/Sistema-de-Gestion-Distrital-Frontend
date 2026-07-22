import axios from 'axios';

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    
    /*PARA TRABAJAR CON EL BACKEND EN LOCAL*/
    //baseURL: 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
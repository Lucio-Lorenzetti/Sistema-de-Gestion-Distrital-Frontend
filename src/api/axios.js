import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Tu URL de Laravel
    withCredentials: true, // Crucial si usas Laravel Sanctum para cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;
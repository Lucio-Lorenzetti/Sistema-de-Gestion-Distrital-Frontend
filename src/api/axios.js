import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si el token quedó inválido/expirado/revocado, limpiamos la sesión y mandamos al login.
// Se excluye /login (para no pisar el mensaje de credenciales incorrectas) y /logout
// (para no competir con la navegación propia del botón "Cerrar sesión").
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isExemptRequest = url.includes('/login') || url.includes('/logout');
        if (error.response?.status === 401 && !isExemptRequest) {
            useAuthStore.getState().clearSession();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

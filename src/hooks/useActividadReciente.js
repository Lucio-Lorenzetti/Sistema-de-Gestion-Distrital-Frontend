// src/hooks/useActividadReciente.js
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

export function useActividadReciente() {
    const [actividades, setActividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/activity-logs') // sin /api, ya está en baseURL
            .then(res => setActividades(res.data))
            .catch(err => console.error('Error al cargar actividad reciente:', err))
            .finally(() => setIsLoading(false));
    }, []);

    return { actividades, isLoading };
}
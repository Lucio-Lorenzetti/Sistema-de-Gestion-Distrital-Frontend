// src/hooks/useActividadReciente.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export function useActividadReciente() {
    const [actividades, setActividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = useAuthStore.getState().token;
        axios.get('/api/activity-logs', {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        })
            .then(res => setActividades(res.data))
            .catch(err => console.error('Error al cargar actividad reciente:', err))
            .finally(() => setIsLoading(false));
    }, []);

    return { actividades, isLoading };
}
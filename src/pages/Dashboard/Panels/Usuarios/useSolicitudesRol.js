// src/pages/Dashboard/Panels/Usuarios/useSolicitudesRol.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useSolicitudesRol = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSolicitudes = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/solicitudes-rol')
            .then(setSolicitudes)
            .catch((err) => console.error('Error al cargar solicitudes de rol:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchSolicitudes();
    }, [fetchSolicitudes]);

    return { solicitudes, isLoading, refetch: fetchSolicitudes };
};

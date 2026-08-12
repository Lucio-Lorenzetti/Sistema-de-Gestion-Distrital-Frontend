// src/pages/Dashboard/Panels/Programas/useComentariosPendientes.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Hilos sin resolver en programas 'enviado' que el usuario puede comentar —
// para Educador/Aux Prog Rama, acotado a su rama; el backend hace ese filtro.
export const useComentariosPendientes = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [comentarios, setComentarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComentarios = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/comentarios-pendientes')
            .then(setComentarios)
            .catch((err) => console.error('Error al cargar comentarios pendientes:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchComentarios();
    }, [fetchComentarios]);

    return { comentarios, isLoading, refetch: fetchComentarios };
};

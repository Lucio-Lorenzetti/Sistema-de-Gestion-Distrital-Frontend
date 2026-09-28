// src/pages/Dashboard/Panels/Actualizaciones/useFeatureRequests.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const ESTADO_LABELS = {
    pendiente: 'Pendiente',
    proxima_version: 'Próxima versión',
    descartada: 'Descartada',
    implementada: 'Implementada',
};

export const PRIORIDAD_LABELS = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
};

export const useFeatureRequests = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [peticiones, setPeticiones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPeticiones = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/peticiones-mejora')
            .then(setPeticiones)
            .catch((err) => console.error('Error al cargar peticiones de mejora:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPeticiones();
    }, [fetchPeticiones]);

    const crearPeticion = async (contenido, { estado, prioridad } = {}) => {
        const body = { contenido };
        if (estado) body.estado = estado;
        if (prioridad) body.prioridad = prioridad;
        const nueva = await authorizedFetch('/peticiones-mejora', { method: 'POST', body });
        setPeticiones((prev) => [nueva, ...prev]);
    };

    const cambiarEstado = async (id, estado) => {
        const actualizada = await authorizedFetch(`/peticiones-mejora/${id}`, {
            method: 'PATCH',
            body: { estado },
        });
        setPeticiones((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
    };

    const cambiarPrioridad = async (id, prioridad) => {
        const actualizada = await authorizedFetch(`/peticiones-mejora/${id}`, {
            method: 'PATCH',
            body: { prioridad },
        });
        setPeticiones((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
    };

    const eliminarPeticion = async (id) => {
        await authorizedFetch(`/peticiones-mejora/${id}`, { method: 'DELETE' });
        setPeticiones((prev) => prev.filter((p) => p.id !== id));
    };

    return { peticiones, isLoading, refetch: fetchPeticiones, crearPeticion, cambiarEstado, cambiarPrioridad, eliminarPeticion };
};

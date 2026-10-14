// src/pages/Dashboard/Panels/Actualizaciones/useFeatureRequests.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

const QUERY_KEY = ['peticiones-mejora'];

export const useFeatureRequests = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const queryClient = useQueryClient();

    const { data: peticiones = [], isLoading, refetch } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => authorizedFetch('/peticiones-mejora'),
    });

    const crearPeticion = async (contenido, { estado, prioridad } = {}) => {
        const body = { contenido };
        if (estado) body.estado = estado;
        if (prioridad) body.prioridad = prioridad;
        const nueva = await authorizedFetch('/peticiones-mejora', { method: 'POST', body });
        queryClient.setQueryData(QUERY_KEY, (prev) => [nueva, ...(prev ?? [])]);
    };

    const cambiarEstado = async (id, estado) => {
        const actualizada = await authorizedFetch(`/peticiones-mejora/${id}`, {
            method: 'PATCH',
            body: { estado },
        });
        queryClient.setQueryData(QUERY_KEY, (prev) => (prev ?? []).map((p) => (p.id === id ? actualizada : p)));
    };

    const cambiarPrioridad = async (id, prioridad) => {
        const actualizada = await authorizedFetch(`/peticiones-mejora/${id}`, {
            method: 'PATCH',
            body: { prioridad },
        });
        queryClient.setQueryData(QUERY_KEY, (prev) => (prev ?? []).map((p) => (p.id === id ? actualizada : p)));
    };

    const eliminarPeticion = async (id) => {
        await authorizedFetch(`/peticiones-mejora/${id}`, { method: 'DELETE' });
        queryClient.setQueryData(QUERY_KEY, (prev) => (prev ?? []).filter((p) => p.id !== id));
    };

    return { peticiones, isLoading, refetch, crearPeticion, cambiarEstado, cambiarPrioridad, eliminarPeticion };
};

// src/pages/Dashboard/Panels/Programas/useComentariosPendientes.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Hilos sin resolver en programas 'enviado' que el usuario puede comentar —
// para Educador/Aux Prog Rama, acotado a su rama; el backend hace ese filtro.
// Lo usan dos tarjetas del Dashboard a la vez (pendientes + respondidos):
// antes eran dos pedidos idénticos, ahora comparten el mismo resultado.
export const useComentariosPendientes = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: comentarios = [], isLoading, refetch } = useQuery({
        queryKey: ['comentarios-pendientes'],
        queryFn: () => authorizedFetch('/comentarios-pendientes'),
    });

    return { comentarios, isLoading, refetch };
};

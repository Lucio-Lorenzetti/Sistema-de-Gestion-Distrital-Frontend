// src/pages/Dashboard/Panels/Programas/useProgramaNotas.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useProgramaNotas = (programaId) => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: notas = [], isLoading, error, refetch } = useQuery({
        queryKey: ['programa-notas', programaId],
        queryFn: () => authorizedFetch(`/programas/${programaId}/notas`),
        enabled: !!programaId,
    });

    const crearHilo = (lineRef, contenido) =>
        authorizedFetch(`/programas/${programaId}/notas`, {
            method: 'POST',
            body: { line_ref: lineRef, contenido },
        }).then(() => refetch());

    const responder = (parentId, contenido) =>
        authorizedFetch(`/programas/${programaId}/notas`, {
            method: 'POST',
            body: { parent_id: parentId, contenido },
        }).then(() => refetch());

    const toggleResuelta = (noteId, resuelta) =>
        authorizedFetch(`/programas/${programaId}/notas/${noteId}/resolucion`, {
            method: 'PATCH',
            body: { resuelta },
        }).then(() => refetch());

    return {
        notas,
        isLoading,
        error: error?.message ?? null,
        refetch,
        crearHilo,
        responder,
        toggleResuelta,
    };
};

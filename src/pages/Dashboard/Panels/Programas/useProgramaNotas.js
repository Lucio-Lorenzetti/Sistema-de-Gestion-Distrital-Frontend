// src/pages/Dashboard/Panels/Programas/useProgramaNotas.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useProgramaNotas = (programaId) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [notas, setNotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sin dependencias de authorizedFetch: no memoiza su referencia entre renders
    // (mismo patrón que useProgramas.js), incluirlo en las deps rehace el fetch en bucle.
    const fetchNotas = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch(`/programas/${programaId}/notas`)
            .then(setNotas)
            .catch((err) => {
                console.error('Error al cargar comentarios:', err);
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }, [programaId]);

    useEffect(() => {
        fetchNotas();
    }, [fetchNotas]);

    const crearHilo = (lineRef, contenido) =>
        authorizedFetch(`/programas/${programaId}/notas`, {
            method: 'POST',
            body: { line_ref: lineRef, contenido },
        }).then(fetchNotas);

    const responder = (parentId, contenido) =>
        authorizedFetch(`/programas/${programaId}/notas`, {
            method: 'POST',
            body: { parent_id: parentId, contenido },
        }).then(fetchNotas);

    const toggleResuelta = (noteId, resuelta) =>
        authorizedFetch(`/programas/${programaId}/notas/${noteId}/resolucion`, {
            method: 'PATCH',
            body: { resuelta },
        }).then(fetchNotas);

    return { notas, isLoading, error, refetch: fetchNotas, crearHilo, responder, toggleResuelta };
};

// src/pages/Dashboard/Panels/Cursos/usePapeleraCursos.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraCursos = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [cursos, setCursos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchPapelera = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/courses/papelera')
            .then(setCursos)
            .catch((err) => console.error('Error al cargar la papelera de cursos:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPapelera();
    }, [fetchPapelera]);

    return { cursos, isLoading, refetch: fetchPapelera };
};

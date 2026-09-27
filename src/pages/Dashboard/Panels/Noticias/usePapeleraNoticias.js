// src/pages/Dashboard/Panels/Noticias/usePapeleraNoticias.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraNoticias = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchPapelera = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/news/papelera')
            .then(setNoticias)
            .catch((err) => console.error('Error al cargar la papelera de noticias:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPapelera();
    }, [fetchPapelera]);

    return { noticias, isLoading, refetch: fetchPapelera };
};

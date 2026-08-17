// src/pages/Dashboard/Panels/Programas/usePapeleraProgramas.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraProgramas = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [programas, setProgramas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchPapelera = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/programas/papelera')
            .then(setProgramas)
            .catch((err) => console.error('Error al cargar la papelera de programas:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPapelera();
    }, [fetchPapelera]);

    return { programas, isLoading, refetch: fetchPapelera };
};

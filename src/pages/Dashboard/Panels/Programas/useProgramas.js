// src/pages/Dashboard/Panels/Programas/useProgramas.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useProgramas = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [programas, setProgramas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchProgramas = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/programas')
            .then(setProgramas)
            .catch((err) => console.error('Error al cargar programas:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchProgramas();
    }, [fetchProgramas]);

    return { programas, isLoading, refetch: fetchProgramas };
};
// src/pages/Dashboard/Panels/Programas/useProgramas.js
import { useState, useEffect } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useProgramas = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [programas, setProgramas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authorizedFetch('/programas')
            .then(setProgramas)
            .catch((err) => console.error('Error al cargar programas:', err))
            .finally(() => setIsLoading(false));
    }, []);

    return { programas, isLoading };
};
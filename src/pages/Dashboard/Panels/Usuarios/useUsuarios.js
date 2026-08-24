// src/pages/Dashboard/Panels/Usuarios/useUsuarios.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useUsuarios = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchUsuarios = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/usuarios')
            .then(setUsuarios)
            .catch((err) => console.error('Error al cargar usuarios:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return { usuarios, isLoading, refetch: fetchUsuarios };
};

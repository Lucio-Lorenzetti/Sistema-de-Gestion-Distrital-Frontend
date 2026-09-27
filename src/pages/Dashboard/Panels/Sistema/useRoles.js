// src/pages/Dashboard/Panels/Sistema/useRoles.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useRoles = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchRoles = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/roles')
            .then(setRoles)
            .catch((err) => console.error('Error al cargar roles:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return { roles, isLoading, refetch: fetchRoles };
};

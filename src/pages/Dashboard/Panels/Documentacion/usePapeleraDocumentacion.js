// src/pages/Dashboard/Panels/Documentacion/usePapeleraDocumentacion.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraDocumentacion = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchPapelera = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/bibliografia/papelera')
            .then(setItems)
            .catch((err) => console.error('Error al cargar la papelera de bibliografía:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPapelera();
    }, [fetchPapelera]);

    return { items, isLoading, refetch: fetchPapelera };
};

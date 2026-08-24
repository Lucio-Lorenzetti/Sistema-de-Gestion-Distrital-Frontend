// src/pages/Dashboard/Panels/Usuarios/usePapeleraUsuarios.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// `habilitado`: solo Developer puede ver esta papelera (403 para cualquier
// otro rol) — el que llama pasa `false` si el usuario logueado no es
// Developer, para no disparar un fetch que sabemos de antemano que va a fallar.
export const usePapeleraUsuarios = (habilitado = true) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(habilitado);

    // Sin dependencias: authorizedFetch no memoiza su referencia entre renders,
    // así que incluirlo en las deps rehace el fetch en bucle.
    const fetchPapelera = useCallback(() => {
        if (!habilitado) return Promise.resolve();

        setIsLoading(true);
        return authorizedFetch('/usuarios/papelera')
            .then(setUsuarios)
            .catch((err) => console.error('Error al cargar la papelera de usuarios:', err))
            .finally(() => setIsLoading(false));
    }, [habilitado]);

    useEffect(() => {
        fetchPapelera();
    }, [fetchPapelera]);

    return { usuarios, isLoading, refetch: fetchPapelera };
};

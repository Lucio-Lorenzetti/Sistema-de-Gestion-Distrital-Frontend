// src/pages/Dashboard/Panels/Programas/useGruposCatalogo.js
import { useState, useEffect } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useGruposCatalogo = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [catalogoGrupos, setCatalogoGrupos] = useState([]);

    useEffect(() => {
        authorizedFetch('/grupos')
            .then(setCatalogoGrupos)
            .catch((err) => console.error('Error al cargar grupos:', err));
    }, []);

    return { catalogoGrupos };
};
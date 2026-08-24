// src/pages/Dashboard/Panels/Usuarios/useRamasCatalogo.js
import { useState, useEffect } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import { ordenarRamas } from '../../../../utils/ordenRamas';

export const useRamasCatalogo = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [catalogoRamas, setCatalogoRamas] = useState([]);

    useEffect(() => {
        authorizedFetch('/ramas')
            .then((ramas) => setCatalogoRamas(ordenarRamas(ramas)))
            .catch((err) => console.error('Error al cargar ramas:', err));
    }, []);

    return { catalogoRamas };
};

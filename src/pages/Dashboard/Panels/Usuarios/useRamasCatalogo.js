// src/pages/Dashboard/Panels/Usuarios/useRamasCatalogo.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import { ordenarRamas } from '../../../../utils/ordenRamas';

// Mismo criterio que useGruposCatalogo: varias pantallas lo piden, ahora
// comparten un único resultado cacheado en vez de refetchear cada una.
export const useRamasCatalogo = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: catalogoRamas = [] } = useQuery({
        queryKey: ['catalogo-ramas'],
        queryFn: () => authorizedFetch('/ramas').then(ordenarRamas),
        staleTime: 1000 * 60 * 30,
    });

    return { catalogoRamas };
};

// src/pages/Dashboard/Panels/Programas/useGruposCatalogo.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Lo usan ProgramasTable, Usuarios y MiPerfil — antes cada uno pedía /grupos
// por su cuenta al montarse. Con useQuery, el primero que lo pide lo trae y
// los demás reusan el mismo resultado (ver src/queryClient.js).
export const useGruposCatalogo = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: catalogoGrupos = [] } = useQuery({
        queryKey: ['catalogo-grupos'],
        queryFn: () => authorizedFetch('/grupos'),
        staleTime: 1000 * 60 * 30, // el back ya lo cachea 24h y nadie lo cambia desde la app
    });

    return { catalogoGrupos };
};

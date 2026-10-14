// src/pages/Dashboard/Panels/Usuarios/useSolicitudesRol.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useSolicitudesRol = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: solicitudes = [], isLoading, refetch } = useQuery({
        queryKey: ['solicitudes-rol'],
        queryFn: () => authorizedFetch('/solicitudes-rol'),
    });

    return { solicitudes, isLoading, refetch };
};

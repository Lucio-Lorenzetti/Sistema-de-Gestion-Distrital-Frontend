// src/pages/Dashboard/Panels/Usuarios/useUsuarios.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useUsuarios = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: usuarios = [], isLoading, refetch } = useQuery({
        queryKey: ['usuarios'],
        queryFn: () => authorizedFetch('/usuarios'),
    });

    return { usuarios, isLoading, refetch };
};

// src/pages/Dashboard/Panels/Sistema/useRoles.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const useRoles = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: roles = [], isLoading, refetch } = useQuery({
        queryKey: ['roles'],
        queryFn: () => authorizedFetch('/roles'),
    });

    return { roles, isLoading, refetch };
};

// src/pages/Dashboard/Panels/Programas/usePapeleraProgramas.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraProgramas = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: programas = [], isLoading, refetch } = useQuery({
        queryKey: ['papelera-programas'],
        queryFn: () => authorizedFetch('/programas/papelera'),
    });

    return { programas, isLoading, refetch };
};

// src/pages/Dashboard/Panels/Noticias/usePapeleraNoticias.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraNoticias = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: noticias = [], isLoading, refetch } = useQuery({
        queryKey: ['papelera-noticias'],
        queryFn: () => authorizedFetch('/news/papelera'),
    });

    return { noticias, isLoading, refetch };
};

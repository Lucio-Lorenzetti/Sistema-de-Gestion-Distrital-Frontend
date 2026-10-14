// src/pages/Dashboard/Panels/Documentacion/usePapeleraDocumentacion.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraDocumentacion = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: items = [], isLoading, refetch } = useQuery({
        queryKey: ['papelera-documentacion'],
        queryFn: () => authorizedFetch('/bibliografia/papelera'),
    });

    return { items, isLoading, refetch };
};

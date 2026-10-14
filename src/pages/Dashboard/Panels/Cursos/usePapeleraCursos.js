// src/pages/Dashboard/Panels/Cursos/usePapeleraCursos.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export const usePapeleraCursos = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: cursos = [], isLoading, refetch } = useQuery({
        queryKey: ['papelera-cursos'],
        queryFn: () => authorizedFetch('/courses/papelera'),
    });

    return { cursos, isLoading, refetch };
};

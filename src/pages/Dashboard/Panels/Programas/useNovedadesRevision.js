// src/pages/Dashboard/Panels/Programas/useNovedadesRevision.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Novedades de revisión de los últimos 14 días para el auxiliar de programa (el backend
// acota por rama a los Aux Prog Rama): programas que entraron a revisión, que volvieron
// corregidos tras comentarios, e hilos que alguien respondió o resolvió.
export const useNovedadesRevision = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: novedades = [], isLoading } = useQuery({
        queryKey: ['revision-novedades'],
        queryFn: () => authorizedFetch('/revision/novedades'),
    });

    return { novedades, isLoading };
};

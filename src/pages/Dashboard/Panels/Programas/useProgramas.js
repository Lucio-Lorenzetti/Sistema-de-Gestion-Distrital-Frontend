// src/pages/Dashboard/Panels/Programas/useProgramas.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Lo usan Programs.jsx (la pantalla de gestión) Y varias tarjetas del
// Dashboard (EducadorResumenCard, ProgramasAprobacionResumen) — antes cada
// uno pedía /programas por su cuenta. En un dashboard donde se muestran dos
// de esas tarjetas juntas, eran DOS pedidos idénticos en simultáneo.
export const useProgramas = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: programas = [], isLoading, refetch } = useQuery({
        queryKey: ['programas'],
        queryFn: () => authorizedFetch('/programas'),
    });

    return { programas, isLoading, refetch };
};

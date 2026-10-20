// src/pages/Dashboard/Panels/Developer/useSistemaDashboard.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Salud del sistema (base, cron, servicios, últimos errores). Se refresca solo
// cada minuto mientras el Dashboard está abierto: es justamente el dato que
// sirve para enterarse de un problema sin tener que recargar.
export const useSistemaEstado = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: estado, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useQuery({
        queryKey: ['sistema', 'estado'],
        queryFn: () => authorizedFetch('/sistema/estado'),
        refetchInterval: 60_000,
    });

    return { estado, isLoading, isError, isFetching, refetch, actualizadoEn: dataUpdatedAt };
};

// Métricas del distrito: usuarios, programas y perfil público de los grupos.
export const useSistemaMetricas = () => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: metricas, isLoading, isError } = useQuery({
        queryKey: ['sistema', 'metricas'],
        queryFn: () => authorizedFetch('/sistema/metricas'),
    });

    return { metricas, isLoading, isError };
};

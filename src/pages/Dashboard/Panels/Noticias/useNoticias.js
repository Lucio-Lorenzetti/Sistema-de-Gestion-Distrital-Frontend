// src/pages/Dashboard/panels/noticias/useNoticias.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// Lo usan GeneralMetrics y NoticiasResumenCard en el mismo Dashboard del
// Director — antes cada uno pedía /news por su cuenta (2 pedidos idénticos
// en simultáneo). Con useQuery comparten el resultado.
export function useNoticias() {
    const { authorizedFetch } = useAuthorizedFetch();
    const queryClient = useQueryClient();

    const { data: noticias = [], isLoading: loading } = useQuery({
        queryKey: ['noticias'],
        queryFn: () => authorizedFetch('/news'),
    });

    const eliminar = async (id) => {
        try {
            await authorizedFetch(`/news/${id}`, { method: 'DELETE' });
            queryClient.setQueryData(['noticias'], (prev) => (prev ?? []).filter((n) => n.id !== id));
        } catch (err) {
            console.error('Error al eliminar noticia:', err);
        }
    };

    const publicarRapido = async (id) => {
        try {
            await authorizedFetch(`/news/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ estado: 'Publicada', publicado_at: new Date().toISOString() }),
            });
            queryClient.setQueryData(['noticias'], (prev) =>
                (prev ?? []).map((n) => (n.id === id ? { ...n, estado: 'Publicada' } : n))
            );
        } catch (err) {
            console.error('Error al publicar rápidamente:', err);
        }
    };

    return { noticias, loading, eliminar, publicarRapido };
}

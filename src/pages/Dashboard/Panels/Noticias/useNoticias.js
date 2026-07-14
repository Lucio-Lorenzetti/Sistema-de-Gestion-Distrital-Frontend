// src/pages/Dashboard/panels/noticias/useNoticias.js
import { useEffect, useState } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

export function useNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authorizedFetch } = useAuthorizedFetch();

    useEffect(() => {
        authorizedFetch('/api/news')
            .then(setNoticias)
            .catch((err) => console.error('Error al cargar noticias:', err))
            .finally(() => setLoading(false));
    }, []);

    const eliminar = async (id) => {
        try {
            await authorizedFetch(`/api/news/${id}`, { method: 'DELETE' });
            setNoticias((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            console.error('Error al eliminar noticia:', err);
        }
    };

    const publicarRapido = async (id) => {
        try {
            await authorizedFetch(`/api/news/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ estado: 'Publicada', publicado_at: new Date().toISOString() }),
            });
            setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, estado: 'Publicada' } : n)));
        } catch (err) {
            console.error('Error al publicar rápidamente:', err);
        }
    };

    return { noticias, loading, eliminar, publicarRapido };
}
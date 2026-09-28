// src/hooks/useNotificaciones.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthorizedFetch } from './useAuthorizedFetch';

const INTERVALO_POLLING_MS = 30000;

// Sin websockets todavía, así que el conteo de no leídas se refresca por
// polling — cada 30s alcanza para "te enteraste en menos de un minuto" sin
// bombardear al backend.
export const useNotificaciones = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [notificaciones, setNotificaciones] = useState([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNoLeidas = useCallback(() => {
        return authorizedFetch('/me/notificaciones/no-leidas')
            .then((res) => setNoLeidas(res.no_leidas))
            .catch((err) => console.error('Error al cargar no leídas:', err));
    }, []);

    const fetchNotificaciones = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch('/me/notificaciones')
            .then(setNotificaciones)
            .catch((err) => console.error('Error al cargar notificaciones:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchNoLeidas();
        const id = setInterval(fetchNoLeidas, INTERVALO_POLLING_MS);
        return () => clearInterval(id);
    }, [fetchNoLeidas]);

    const marcarLeida = async (id) => {
        setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
        setNoLeidas((prev) => Math.max(0, prev - 1));
        try {
            await authorizedFetch(`/me/notificaciones/${id}/leer`, { method: 'PATCH' });
        } catch (err) {
            console.error('Error al marcar como leída:', err);
        }
    };

    const marcarTodasLeidas = async () => {
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
        setNoLeidas(0);
        try {
            await authorizedFetch('/me/notificaciones/leer-todas', { method: 'PATCH' });
        } catch (err) {
            console.error('Error al marcar todas como leídas:', err);
        }
    };

    return { notificaciones, noLeidas, isLoading, fetchNotificaciones, marcarLeida, marcarTodasLeidas };
};

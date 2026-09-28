// src/components/ui/NotificacionesBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificaciones } from '../../hooks/useNotificaciones';

const tiempoRelativo = (isoString) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return 'ahora';
    if (minutos < 60) return `hace ${minutos}m`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas}h`;
    return `hace ${Math.floor(horas / 24)}d`;
};

const NotificacionesBell = () => {
    const { notificaciones, noLeidas, fetchNotificaciones, marcarLeida, marcarTodasLeidas } = useNotificaciones();
    const [abierto, setAbierto] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAbrir = () => {
        setAbierto((prev) => {
            if (!prev) fetchNotificaciones();
            return !prev;
        });
    };

    const handleClickNotificacion = (n) => {
        if (!n.leida) marcarLeida(n.id);
        setAbierto(false);
        if (n.url) navigate(n.url);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={handleAbrir}
                className="relative p-2 rounded-xl text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer"
                title="Notificaciones"
            >
                <Bell size={19} />
                {noLeidas > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-scout-accent text-white text-[9px] font-black flex items-center justify-center">
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>

            {abierto && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg z-20 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-scout-border shrink-0">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-scout-primary">Notificaciones</h3>
                        {noLeidas > 0 && (
                            <button
                                type="button"
                                onClick={marcarTodasLeidas}
                                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                            >
                                <CheckCheck size={11} /> Marcar todas
                            </button>
                        )}
                    </div>

                    {notificaciones.length === 0 ? (
                        <p className="text-xs text-scout-muted font-medium text-center py-8 px-4">Sin notificaciones todavía.</p>
                    ) : (
                        <div className="divide-y divide-scout-border">
                            {notificaciones.map((n) => (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => handleClickNotificacion(n)}
                                    className={`w-full text-left px-4 py-3 flex items-start gap-2.5 hover:bg-scout-bg-panel transition-colors cursor-pointer ${!n.leida ? 'bg-scout-primary/5' : ''}`}
                                >
                                    {!n.leida && <span className="w-1.5 h-1.5 rounded-full bg-scout-accent mt-1.5 shrink-0" />}
                                    <div className={!n.leida ? '' : 'pl-4'}>
                                        <p className="text-xs font-medium text-scout-ink leading-snug">{n.mensaje}</p>
                                        <p className="text-[10px] text-scout-muted font-bold uppercase tracking-wide mt-1">{tiempoRelativo(n.fecha)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificacionesBell;

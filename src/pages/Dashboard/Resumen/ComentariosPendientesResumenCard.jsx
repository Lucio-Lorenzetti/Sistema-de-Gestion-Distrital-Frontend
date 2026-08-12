// src/pages/Dashboard/Resumen/ComentariosPendientesResumenCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useComentariosPendientes } from '../Panels/Programas/useComentariosPendientes';

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

const ComentariosPendientesResumenCard = () => {
    const { comentarios, isLoading } = useComentariosPendientes();

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                <MessageCircle size={16} /> Comentarios a Resolver en tu Rama
            </h3>
            <div className="h-px bg-scout-border my-4" />

            {isLoading ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
            ) : comentarios.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-2">No hay comentarios pendientes en tu rama.</p>
            ) : (
                <div className="flex flex-col divide-y divide-scout-border">
                    {comentarios.map((c) => (
                        <Link
                            key={c.id}
                            to={`/gestion-programas/revisar/${c.program?.id}`}
                            className="py-3 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-scout-bg-panel transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="text-xs font-black text-scout-ink truncate">{c.program?.titulo}</p>
                                <p className="text-xs text-scout-muted truncate">
                                    <span className="font-bold text-scout-ink">{c.user?.name}:</span> {c.contenido}
                                </p>
                            </div>
                            <span className="shrink-0 text-[9px] font-bold text-scout-muted uppercase tracking-widest whitespace-nowrap">
                                {formatFecha(c.created_at)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComentariosPendientesResumenCard;

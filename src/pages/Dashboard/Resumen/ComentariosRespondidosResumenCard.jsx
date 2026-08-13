// src/pages/Dashboard/Resumen/ComentariosRespondidosResumenCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Reply } from 'lucide-react';
import { useUserRole } from '../../../hooks/useUserRole';
import { useComentariosPendientes } from '../Panels/Programas/useComentariosPendientes';

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

// Mismo feed que ComentariosPendientesResumenCard (/comentarios-pendientes),
// pero acotado a los hilos que ABRIÓ el auxiliar y que ya tienen al menos una
// respuesta de otra persona (típicamente el educador) — "te respondieron",
// no "tenés que responder".
const ComentariosRespondidosResumenCard = () => {
    const { user } = useUserRole();
    const { comentarios, isLoading } = useComentariosPendientes();

    const respondidos = comentarios
        .filter((c) => Number(c.user?.id) === Number(user?.id))
        .map((c) => ({
            ...c,
            ultimaRespuesta: [...(c.replies || [])]
                .filter((r) => Number(r.user?.id) !== Number(user?.id))
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0],
        }))
        .filter((c) => c.ultimaRespuesta)
        .slice(0, 5);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                <Reply size={16} /> Te Respondieron
            </h3>
            <div className="h-px bg-scout-border my-4" />

            {isLoading ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
            ) : respondidos.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-2">Todavía nadie respondió tus comentarios pendientes.</p>
            ) : (
                <div className="flex flex-col divide-y divide-scout-border">
                    {respondidos.map((c) => (
                        <Link
                            key={c.id}
                            to={`/gestion-programas/revisar/${c.program?.id}`}
                            className="py-3 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-scout-bg-panel transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="text-xs font-black text-scout-ink truncate">{c.program?.titulo}</p>
                                <p className="text-xs text-scout-muted truncate">
                                    <span className="font-bold text-scout-ink">{c.ultimaRespuesta.user?.name}:</span> {c.ultimaRespuesta.contenido}
                                </p>
                            </div>
                            <span className="shrink-0 text-[9px] font-bold text-scout-muted uppercase tracking-widest whitespace-nowrap">
                                {formatFecha(c.ultimaRespuesta.created_at)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComentariosRespondidosResumenCard;

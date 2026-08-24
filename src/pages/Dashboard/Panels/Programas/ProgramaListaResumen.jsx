// src/pages/Dashboard/Panels/Programas/ProgramaListaResumen.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

// Mismo formato de fila que los boards de comentarios (ComentariosPendientesResumenCard /
// ComentariosRespondidosResumenCard): título + metadato + fecha, todo clickeable hacia el
// programa. "compact" es la variante de menor peso visual (p. ej. "Aprobados Recientemente",
// que es informativo pero no requiere acción, a diferencia de "Próximos a Aprobar").
const ProgramaListaResumen = ({ titulo, icon, programas, emptyText, fechaCampo, fechaLabel, compact = false }) => (
    <div className={`h-full flex flex-col bg-scout-bg-card rounded-[2rem] border border-scout-border shadow-sm ${compact ? 'p-6' : 'p-8'}`}>
        <h3 className={`font-black uppercase tracking-tight flex items-center gap-2 ${
            compact ? 'text-xs text-scout-muted' : 'text-sm text-scout-primary'
        }`}>
            {icon} {titulo}
        </h3>
        <div className="h-px bg-scout-border my-4" />

        {programas.length === 0 ? (
            <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-2">{emptyText}</p>
        ) : (
            <div className="flex flex-col divide-y divide-scout-border">
                {programas.map((p) => (
                    <Link
                        key={p.id}
                        to={`/gestion-programas/revisar/${p.id}`}
                        className="py-3 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-scout-bg-panel transition-colors"
                    >
                        <div className="min-w-0">
                            <p className="text-xs font-black text-scout-ink truncate">{p.titulo}</p>
                            <p className="text-xs text-scout-muted truncate">
                                <span className="font-bold text-scout-ink">{p.owner?.nombre_visible || p.owner?.name || 'Sin asignar'}</span> · {p.rama?.nombre || '—'} · {p.grupo?.nombre || '—'}
                            </p>
                        </div>
                        <span className="shrink-0 text-[9px] font-bold text-scout-muted uppercase tracking-widest whitespace-nowrap">
                            {fechaLabel} {formatFecha(p[fechaCampo])}
                        </span>
                    </Link>
                ))}
            </div>
        )}
    </div>
);

export default ProgramaListaResumen;

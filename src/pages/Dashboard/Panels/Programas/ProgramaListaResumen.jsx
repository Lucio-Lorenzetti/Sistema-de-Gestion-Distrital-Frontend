// src/pages/Dashboard/Panels/Programas/ProgramaListaResumen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import EstadoBadge from '../../../../components/ui/EstadoBadge';

const ESTADO_LABELS = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

// Mismo formato que las tarjetas de Noticias / Cursos / Documentación: título, una
// línea con fecha a la izquierda y badge a la derecha, y "Ver todos" al pie. Las
// filas ya vienen acotadas por quien lo usa para que la tarjeta entre en la pantalla.
const ProgramaListaResumen = ({ titulo, icon, programas, emptyText, fechaCampo, fechaLabel }) => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
        <div className="flex items-center justify-between shrink-0">
            <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                {icon} {titulo}
            </h2>
            <Link to="/gestion-programas" className="text-scout-muted hover:text-scout-primary transition-colors">
                <ChevronRight size={16} />
            </Link>
        </div>
        <div className="h-px bg-scout-border shrink-0 my-4" />

        {programas.length === 0 ? (
            <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">{emptyText}</p>
        ) : (
            <div className="space-y-4 flex-1">
                {programas.map((p) => (
                    <Link
                        key={p.id}
                        to={`/gestion-programas/revisar/${p.id}`}
                        className="block space-y-1"
                    >
                        <p className="text-xs font-bold text-scout-ink line-clamp-1">{p.titulo}</p>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] text-scout-muted flex items-center gap-1 min-w-0">
                                <Clock size={10} className="shrink-0" />
                                <span className="truncate">{fechaLabel} {formatFecha(p[fechaCampo])} · {p.grupo?.nombre || '—'}</span>
                            </span>
                            <EstadoBadge estado={ESTADO_LABELS[p.estado] || p.estado} />
                        </div>
                    </Link>
                ))}
            </div>
        )}

        <Link
            to="/gestion-programas"
            className="mt-4 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors flex items-center gap-1"
        >
            Ver todos <ChevronRight size={12} />
        </Link>
    </div>
);

export default ProgramaListaResumen;

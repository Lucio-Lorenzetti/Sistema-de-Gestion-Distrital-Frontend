// src/pages/Dashboard/Panels/Actualizaciones/PeticionCard.jsx
import React from 'react';
import EstadoBadge from '../../../../components/ui/EstadoBadge';
import { ESTADO_LABELS, PRIORIDAD_LABELS } from './useFeatureRequests';

const formatearFecha = (iso) => new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const PeticionCard = ({ peticion, children, editorPrioridad }) => (
    <div className="bg-scout-bg-card rounded-2xl border border-scout-border p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
                <EstadoBadge estado={ESTADO_LABELS[peticion.estado] ?? peticion.estado} />
                {peticion.prioridad && <EstadoBadge estado={PRIORIDAD_LABELS[peticion.prioridad] ?? peticion.prioridad} />}
            </div>
            <span className="text-[10px] font-bold text-scout-muted uppercase tracking-wide shrink-0">
                {formatearFecha(peticion.created_at)}
            </span>
        </div>
        <p className="text-sm text-scout-ink font-medium leading-relaxed whitespace-pre-wrap">{peticion.contenido}</p>
        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-3">
            {peticion.autor?.nombre_visible ?? peticion.autor?.name ?? 'Usuario eliminado'}
        </p>
        {editorPrioridad && <div className="mt-3">{editorPrioridad}</div>}
        {children && <div className="flex items-center gap-2 mt-4 flex-wrap">{children}</div>}
    </div>
);

export default PeticionCard;

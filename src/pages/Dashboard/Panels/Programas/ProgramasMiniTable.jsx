// src/pages/Dashboard/Panels/Programas/ProgramasMiniTable.jsx
import React from 'react';
import EstadoBadge from '../../../../components/ui/EstadoBadge';

const ESTADO_LABELS = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const ProgramasMiniTable = ({ titulo, icon, programas, emptyText }) => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
        <h3 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2 shrink-0">
            {icon} {titulo}
        </h3>
        <div className="h-px bg-scout-border shrink-0 my-4" />

        {programas.length === 0 ? (
            <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">{emptyText}</p>
        ) : (
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-scout-border text-[9px] font-black uppercase tracking-widest text-scout-muted">
                            <th className="pb-2 font-black">Título</th>
                            <th className="pb-2 font-black">Rama</th>
                            <th className="pb-2 font-black">Grupo</th>
                            <th className="pb-2 font-black">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-scout-border">
                        {programas.map((p) => (
                            <tr key={p.id} className="hover:bg-scout-bg-panel transition-colors">
                                <td className="py-2.5 pr-3 text-xs font-bold text-scout-ink">{p.titulo}</td>
                                <td className="py-2.5 pr-3 text-xs text-scout-muted font-medium whitespace-nowrap">{p.rama?.nombre || '—'}</td>
                                <td className="py-2.5 pr-3 text-xs text-scout-muted font-medium whitespace-nowrap">{p.grupo?.nombre || '—'}</td>
                                <td className="py-2.5"><EstadoBadge estado={ESTADO_LABELS[p.estado] || p.estado} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default ProgramasMiniTable;
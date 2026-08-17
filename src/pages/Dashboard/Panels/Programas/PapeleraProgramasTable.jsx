// src/pages/Dashboard/Panels/Programas/PapeleraProgramasTable.jsx
import React, { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const ETIQUETAS_TIPO = {
    cuatrimestre: 'Cuatrimestre',
    campamento: 'Campamento',
    cfa: 'Campamento Anual (CFA)',
};

const formatFecha = (fechaIso) => {
    if (!fechaIso) return '—';
    return new Date(fechaIso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const PapeleraProgramasTable = ({ programas, isLoading, onRestaurado }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [restaurandoId, setRestaurandoId] = useState(null);
    const [error, setError] = useState(null);

    const handleRestaurar = async (programa) => {
        setRestaurandoId(programa.id);
        setError(null);
        try {
            await authorizedFetch(`/programas/${programa.id}/restore`, { method: 'PATCH' });
            await onRestaurado?.();
        } catch (err) {
            console.error('Error al restaurar el programa:', err);
            setError('No se pudo restaurar el programa: ' + err.message);
        } finally {
            setRestaurandoId(null);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            {error && (
                <div className="mb-5 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                    {error}
                </div>
            )}
            <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Papelera de Programas</h2>
            <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1 shrink-0">
                Programas que eliminaste. Se pueden restaurar en cualquier momento.
            </p>
            <div className="h-px bg-scout-border shrink-0 mt-5" />

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando papelera...</p>
                </div>
            ) : programas.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><Trash2 size={20} /></div>
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">La papelera está vacía</p>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6 flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                <th className="pb-3 font-black">Título</th>
                                <th className="pb-3 font-black">Tipo</th>
                                <th className="pb-3 font-black">Rama</th>
                                <th className="pb-3 font-black">Grupo</th>
                                <th className="pb-3 font-black">Eliminado el</th>
                                <th className="pb-3 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-scout-border">
                            {programas.map((programa) => (
                                <tr key={programa.id} className="group hover:bg-scout-bg-panel transition-colors">
                                    <td className="py-4 pr-4">
                                        <p className="text-xs font-bold text-scout-ink transition-colors">{programa.titulo}</p>
                                    </td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{ETIQUETAS_TIPO[programa.tipo] || programa.tipo || '—'}</td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.rama?.nombre || '—'}</td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.grupo?.nombre || '—'}</td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{formatFecha(programa.deleted_at)}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleRestaurar(programa)}
                                                disabled={restaurandoId === programa.id}
                                                className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer disabled:opacity-40"
                                                title="Restaurar"
                                            >
                                                <RotateCcw size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PapeleraProgramasTable;

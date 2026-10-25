// src/pages/Logueado/Programas/PanelComentariosPrograma.jsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessagesSquare, X } from 'lucide-react';
import { useAuthorizedFetch } from '../../../hooks/useAuthorizedFetch';
import { useProgramaNotas } from '../../Dashboard/Panels/Programas/useProgramaNotas';
import HiloComentario from './HiloComentario';

// Comentarios de la revisión a la vista mientras se corrige el programa. Es un panel
// lateral que no tapa el editor: el educador lee, edita, y marca cada hilo como
// resuelto sin salir de la pantalla. Si el programa no tiene comentarios, no aparece.
const PanelComentariosPrograma = ({ programaId }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [abierto, setAbierto] = useState(false);

    const { notas, responder, toggleResuelta } = useProgramaNotas(programaId);

    // El editor solo se abre con el programa en borrador (o rechazado, que es de solo lectura).
    const { data: programa } = useQuery({
        queryKey: ['programa-estado', programaId],
        queryFn: () => authorizedFetch(`/programas/${programaId}`),
        enabled: !!programaId,
    });
    const puedeResponder = programa?.estado === 'borrador';

    // Primero lo que sigue pendiente: es lo que hay que corregir.
    const ordenadas = useMemo(
        () => [...notas].sort((a, b) => Number(a.resuelta) - Number(b.resuelta)),
        [notas]
    );
    const pendientes = notas.filter((n) => !n.resuelta).length;

    if (notas.length === 0) return null;

    return (
        <>
            {!abierto && (
                <button
                    type="button"
                    onClick={() => setAbierto(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-scout-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-scout-primary-hover transition-colors cursor-pointer"
                >
                    <MessagesSquare size={14} />
                    Comentarios · {pendientes > 0 ? `${pendientes} pendiente${pendientes > 1 ? 's' : ''}` : 'todos resueltos'}
                </button>
            )}

            {abierto && (
                <aside className="fixed top-0 right-0 z-40 h-full w-full sm:w-[26rem] bg-scout-bg-card border-l border-scout-border shadow-2xl flex flex-col text-left">
                    <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-scout-border bg-scout-bg-panel shrink-0">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wide text-scout-ink">Comentarios de la revisión</h2>
                            <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-0.5">
                                {pendientes} pendiente{pendientes === 1 ? '' : 's'} de {notas.length}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAbierto(false)}
                            title="Cerrar"
                            className="p-1.5 rounded-lg border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-card transition-colors cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {!puedeResponder && (
                            <p className="mt-4 text-[10px] font-bold text-scout-muted uppercase tracking-wide">
                                Solo lectura: el programa no está en borrador.
                            </p>
                        )}
                        {ordenadas.map((hilo) => (
                            <HiloComentario
                                key={hilo.id}
                                hilo={hilo}
                                puedeComentar={puedeResponder}
                                onResponder={responder}
                                onToggleResuelta={toggleResuelta}
                                mostrarTextoOriginal
                            />
                        ))}
                    </div>
                </aside>
            )}
        </>
    );
};

export default PanelComentariosPrograma;

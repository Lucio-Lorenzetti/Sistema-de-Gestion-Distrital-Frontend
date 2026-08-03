// src/pages/Dashboard/Panels/Programas/ProgramasTable.jsx
import React, { useState, useMemo } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import FiltroDropdown from './FiltroDropdown';
import ProgramEstadoBadge from './ProgramEstadoBadge';
import ProgramaDetalleModal from './ProgramaDetalleModal';
import { useGruposCatalogo } from './useGruposCatalogo';

const ITEMS_PER_PAGE = 3;
const ORDEN_RAMAS = ['Castores', 'Lobatos', 'Unidad Scout', 'Caminantes', 'Rovers'];

const FILTROS_ESTADO = [
    { key: 'Todos', label: 'Todos' },
    { key: 'borrador', label: 'Borradores' },
    { key: 'revision', label: 'En Revisión' },
    { key: 'publicado', label: 'Publicados' },
    { key: 'rechazado', label: 'Rechazados' },
];

/**
 * Tabla completa de Programas: filtros de Grupo/Rama/Estado + paginación + modal de detalle.
 * Reutilizada en Programs.jsx (página completa de gestión) y en el Dashboard del
 * Director (GeneralPanel.jsx) — recibe los programas ya cargados por el padre vía
 * useProgramas(), así ambos lugares comparten una sola fuente de datos/fetch.
 */
const ProgramasTable = ({ programas, isLoading }) => {
    const { catalogoGrupos } = useGruposCatalogo();
    const [currentPage, setCurrentPage] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroGrupo, setFiltroGrupo] = useState('Todos');
    const [filtroRama, setFiltroRama] = useState('Todas');
    const [expandedId, setExpandedId] = useState(null);

    // Grupo/Rama solo se muestran como filtro si hay más de 1 valor distinto en los
    // datos que llegaron — así cada rol ve automáticamente lo que le corresponde.
    const gruposDisponibles = useMemo(
        () => [...new Set(programas.map((p) => p.grupo?.nombre).filter(Boolean))],
        [programas]
    );
    const ramasDisponibles = useMemo(() => {
        const presentes = new Set(programas.map((p) => p.rama?.nombre).filter(Boolean));
        return ORDEN_RAMAS.filter((r) => presentes.has(r));
    }, [programas]);

    const opcionesGrupo = [{ key: 'Todos', label: 'Todos' }, ...catalogoGrupos.map((g) => ({ key: g.nombre, label: g.nombre }))];
    const opcionesRama = [{ key: 'Todas', label: 'Todas' }, ...ramasDisponibles.map((n) => ({ key: n, label: n }))];

    const programasFiltrados = programas.filter((p) => {
        if (filtroEstado !== 'Todos' && p.estado !== filtroEstado) return false;
        if (filtroGrupo !== 'Todos' && p.grupo?.nombre !== filtroGrupo) return false;
        if (filtroRama !== 'Todas' && p.rama?.nombre !== filtroRama) return false;
        return true;
    });

    const totalPages = Math.ceil(programasFiltrados.length / ITEMS_PER_PAGE) || 1;
    const programasPagina = programasFiltrados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFiltroEstadoChange = (key) => { setFiltroEstado(key); setCurrentPage(1); };
    const handleFiltroGrupoChange = (key) => { setFiltroGrupo(key); setCurrentPage(1); };
    const handleFiltroRamaChange = (key) => { setFiltroRama(key); setCurrentPage(1); };

    const programaExpandido = programas.find((p) => p.id === expandedId);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            <div className="flex items-center justify-between shrink-0 flex-wrap gap-3">
                <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Programas</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    {gruposDisponibles.length > 1 && (
                        <FiltroDropdown options={opcionesGrupo} value={filtroGrupo} onChange={handleFiltroGrupoChange} />
                    )}
                    {ramasDisponibles.length > 1 && (
                        <FiltroDropdown options={opcionesRama} value={filtroRama} onChange={handleFiltroRamaChange} />
                    )}
                    <FiltroDropdown options={FILTROS_ESTADO} value={filtroEstado} onChange={handleFiltroEstadoChange} />
                </div>
            </div>
            <div className="h-px bg-scout-border shrink-0 mt-5" />

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando programas...</p>
                </div>
            ) : programasPagina.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><ClipboardList size={20} /></div>
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">Todavía no hay programas para mostrar</p>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6 flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                <th className="pb-3 font-black">Título</th>
                                <th className="pb-3 font-black">Rama</th>
                                <th className="pb-3 font-black">Grupo</th>
                                <th className="pb-3 font-black">Autor</th>
                                <th className="pb-3 font-black">Estado</th>
                                <th className="pb-3 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-scout-border">
                            {programasPagina.map((programa) => (
                                <tr key={programa.id} className="group hover:bg-scout-bg-panel transition-colors">
                                    <td className="py-4 pr-4">
                                        <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{programa.titulo}</p>
                                    </td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.rama?.nombre || '—'}</td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.grupo?.nombre || '—'}</td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.owner?.name || 'Sin asignar'}</td>
                                    <td className="py-4 pr-4"><ProgramEstadoBadge estado={programa.estado} /></td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => setExpandedId(programa.id)}
                                                className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                title="Ver"
                                            >
                                                <Eye size={13} />
                                            </button>
                                            {/* Editar / Eliminar quedan para cuando definamos cómo
                                                acceder al usuario logueado (autor/grupo/rama) en el frontend */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {programasFiltrados.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
                    <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentPage} / {totalPages}</span>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
                    </div>
                </div>
            )}

            {programaExpandido && <ProgramaDetalleModal programa={programaExpandido} onClose={() => setExpandedId(null)} />}
        </div>
    );
};

export default ProgramasTable;
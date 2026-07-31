// src/pages/Dashboard/Programs.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    ClipboardList, CheckCircle2, Edit3, Clock, ChevronDown, ChevronLeft, ChevronRight,
    Eye, X, Users, Layers
} from 'lucide-react';
import { useAuthorizedFetch } from '../../hooks/useAuthorizedFetch';
import MetricCard from '../../components/ui/MetricCard';

const PROGRAMAS_ENDPOINT = '/programas';
const ITEMS_PER_PAGE = 3;

const FILTROS_ESTADO = [
    { key: 'Todos', label: 'Todos' },
    { key: 'borrador', label: 'Borradores' },
    { key: 'revision', label: 'En Revisión' },
    { key: 'publicado', label: 'Publicados' },
    { key: 'rechazado', label: 'Rechazados' },
];

// TODO: si tienen un EstadoBadge.jsx genérico, unificar con ese en vez de este local.
const ESTADO_STYLES = {
    borrador: 'bg-gray-100 text-gray-600 border-gray-200',
    revision: 'bg-amber-50 text-amber-700 border-amber-200',
    publicado: 'bg-green-50 text-scout-success border-green-200',
    rechazado: 'bg-red-50 text-scout-accent border-red-200',
};

const ProgramEstadoBadge = ({ estado }) => (
    <span
        className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ESTADO_STYLES[estado] || 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
    >
        {estado}
    </span>
);

const Programs = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [programas, setProgramas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroOpen, setFiltroOpen] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const filtroRef = useRef(null);

    useEffect(() => {
        // El backend ya filtra según el rol (Director/Aux General ven todo,
        // Aux de Rama por rama, Educador por grupo+rama) — acá no se replica esa lógica.
        authorizedFetch(PROGRAMAS_ENDPOINT)
            .then(setProgramas)
            .catch((err) => console.error('Error al cargar programas:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filtroRef.current && !filtroRef.current.contains(e.target)) setFiltroOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const programasFiltrados = filtroEstado === 'Todos'
        ? programas
        : programas.filter((p) => p.estado === filtroEstado);

    const totalPages = Math.ceil(programasFiltrados.length / ITEMS_PER_PAGE) || 1;
    const programasPagina = programasFiltrados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFiltroChange = (key) => { setFiltroEstado(key); setCurrentPage(1); setFiltroOpen(false); };

    const totalPublicados = programas.filter((p) => p.estado === 'publicado').length;
    const totalBorradores = programas.filter((p) => p.estado === 'borrador').length;
    const totalRevision = programas.filter((p) => p.estado === 'revision').length;

    const programaExpandido = programas.find((p) => p.id === expandedId);

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            {/* HEADER */}
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Gestión de Programas
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Programas
                </h1>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
                <MetricCard icon={<ClipboardList />} title="Total de Programas" value={`${programas.length} En Sistema`} sub="Según tu alcance de visibilidad" color="border-scout-primary" />
                <MetricCard icon={<CheckCircle2 />} title="Publicados" value={`${totalPublicados} Programas`} sub="Ya cerrados y visibles" color="border-scout-muted" />
                <MetricCard icon={<Clock />} title="En Revisión" value={`${totalRevision} Programas`} sub="Esperando feedback" color="border-scout-muted" />
                <MetricCard icon={<Edit3 />} title="Borradores" value={`${totalBorradores} Programas`} sub="En armado colaborativo" color="border-scout-muted" />
            </div>

            {/* TABLA */}
            <div className="grid grid-cols-1 gap-8 mt-10" style={{ flex: 1, minHeight: 0 }}>
                <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
                    <div className="flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Programas</h2>
                        <div className="relative" ref={filtroRef}>
                            <button
                                onClick={() => setFiltroOpen((prev) => !prev)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
                            >
                                {FILTROS_ESTADO.find((f) => f.key === filtroEstado)?.label}
                                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${filtroOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {filtroOpen && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                                    {FILTROS_ESTADO.map((filtro) => (
                                        <button
                                            key={filtro.key}
                                            onClick={() => handleFiltroChange(filtro.key)}
                                            className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${filtroEstado === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
                                        >
                                            {filtro.label}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                </div>
            </div>

            {/* MODAL — vista previa rápida. La vista completa con comentarios llega en Fase 6 */}
            {programaExpandido && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                    <div className="relative bg-scout-bg-card w-full max-w-3xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                            <X size={20} />
                        </button>
                        <div className="p-8 md:p-16 overflow-y-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <ProgramEstadoBadge estado={programaExpandido.estado} />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                                    <Layers size={11} /> {programaExpandido.rama?.nombre || '—'}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                                    <Users size={11} /> {programaExpandido.grupo?.nombre || '—'}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-primary text-left">
                                {programaExpandido.titulo}
                            </h2>
                            {programaExpandido.diagnostico && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Diagnóstico</h3>
                                    <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programaExpandido.diagnostico}</p>
                                </div>
                            )}
                            {programaExpandido.objetivos && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Objetivos</h3>
                                    <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programaExpandido.objetivos}</p>
                                </div>
                            )}
                            <p className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                Autor: <span className="text-scout-primary">{programaExpandido.owner?.name || 'Sin asignar'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;
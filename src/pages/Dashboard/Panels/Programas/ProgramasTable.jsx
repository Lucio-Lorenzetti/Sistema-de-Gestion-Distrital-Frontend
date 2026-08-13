// src/pages/Dashboard/Panels/Programas/ProgramasTable.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ChevronLeft, ChevronRight, Eye, Pencil, Send, Download, MessageSquare, Undo2, CheckCircle2, BadgeCheck } from 'lucide-react';
import FiltroDropdown from './FiltroDropdown';
import EstadoBadge from '../../../../components/ui/EstadoBadge';
import ProgramaDetalleModal from './ProgramaDetalleModal';
import { useGruposCatalogo } from './useGruposCatalogo';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import api from '../../../../api/axios';

const ITEMS_PER_PAGE = 3;
const ORDEN_RAMAS = ['Castores', 'Lobatos', 'Unidad Scout', 'Caminantes', 'Rovers'];

const FILTROS_ESTADO = [
    { key: 'Todos', label: 'Todos' },
    { key: 'borrador', label: 'Borradores' },
    { key: 'enviado', label: 'En Revisión' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
];

// El backend guarda el estado en minúscula; EstadoBadge (compartido con Noticias/Cursos)
// espera la etiqueta capitalizada. Este mapa es solo de presentación.
const ESTADO_LABELS = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const ProgramasTable = ({ programas, isLoading, onEstadoActualizado }) => {
    const { catalogoGrupos } = useGruposCatalogo();
    const { authorizedFetch } = useAuthorizedFetch();
    const user = useAuthStore((state) => state.user);

    const [currentPage, setCurrentPage] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroGrupo, setFiltroGrupo] = useState('Todos');
    const [filtroRama, setFiltroRama] = useState('Todas');
    const [expandedId, setExpandedId] = useState(null);
    const [enviandoId, setEnviandoId] = useState(null);
    const [volviendoId, setVolviendoId] = useState(null);
    const [aprobandoId, setAprobandoId] = useState(null);
    const [solicitandoId, setSolicitandoId] = useState(null);
    const [descargandoId, setDescargandoId] = useState(null);
    const [error, setError] = useState(null);

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

    // El autor de un programa, y cualquier educador de la misma rama+grupo, tienen
    // exactamente las mismas capacidades sobre él (editar, enviar, volver a borrador,
    // solicitar aprobación) — es trabajo colaborativo del mismo grupo, no algo
    // personal del autor. Auxiliares, Jefe de Grupo y Director nunca comparten
    // rama_id Y grupo_id con un programa a la vez, así que quedan afuera solos.
    const esColaborador = (programa) => {
        const esAutor = Number(programa.owner?.id) === Number(user?.id);
        const compartenRamaYGrupo =
            Number(programa.rama?.id) === Number(user?.rama?.id) &&
            Number(programa.grupo?.id) === Number(user?.grupo?.id);

        return esAutor || compartenRamaYGrupo;
    };

    const puedeGestionar = (programa) => programa.estado === 'borrador' && esColaborador(programa);

    // Cualquier colaborador puede retroceder el programa de "enviado" a "borrador" para seguir editándolo.
    const puedeVolverABorrador = (programa) => programa.estado === 'enviado' && esColaborador(programa);

    // Distinto de "Enviar a revisión" (borrador → enviado): esto no cambia el estado,
    // solo marca que ya se considera el programa listo — el botón aparece recién
    // cuando está 'enviado'. Mismo criterio que ProgramPolicy::solicitarAprobacion().
    const puedeSolicitarAprobacion = (programa) => programa.estado === 'enviado' && esColaborador(programa);

    // Mismo criterio que ProgramPolicy::updateStatus() en el backend para la transición
    // enviado → aprobado: Aux Prog General (cualquiera) o Aux Prog Rama (solo su rama).
    const puedeAprobar = (programa) => {
        if (programa.estado !== 'enviado') return false;

        const roles = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
        if (roles.includes('aux prog general')) return true;
        if (roles.includes('aux prog rama')) return Number(programa.rama?.id) === Number(user?.rama?.id);

        return false;
    };

    const handleEnviar = async (programa) => {
        setEnviandoId(programa.id);
        setError(null);
        try {
            await authorizedFetch(`/programas/${programa.id}/estado`, {
                method: 'PATCH',
                body: { estado: 'enviado' },
            });
            await onEstadoActualizado?.();
        } catch (err) {
            console.error('Error al enviar el programa a revisión:', err);
            setError('No se pudo enviar el programa a revisión: ' + err.message);
        } finally {
            setEnviandoId(null);
        }
    };

    const handleVolverABorrador = async (programa) => {
        setVolviendoId(programa.id);
        setError(null);
        try {
            await authorizedFetch(`/programas/${programa.id}/estado`, {
                method: 'PATCH',
                body: { estado: 'borrador' },
            });
            await onEstadoActualizado?.();
        } catch (err) {
            console.error('Error al volver el programa a borrador:', err);
            setError('No se pudo volver el programa a borrador: ' + err.message);
        } finally {
            setVolviendoId(null);
        }
    };

    const handleAprobar = async (programa) => {
        setAprobandoId(programa.id);
        setError(null);
        try {
            await authorizedFetch(`/programas/${programa.id}/estado`, {
                method: 'PATCH',
                body: { estado: 'aprobado' },
            });
            await onEstadoActualizado?.();
        } catch (err) {
            console.error('Error al aprobar el programa:', err);
            setError('No se pudo aprobar el programa: ' + err.message);
        } finally {
            setAprobandoId(null);
        }
    };

    const handleSolicitarAprobacion = async (programa) => {
        setSolicitandoId(programa.id);
        setError(null);
        try {
            await authorizedFetch(`/programas/${programa.id}/solicitar-aprobacion`, { method: 'PATCH' });
            await onEstadoActualizado?.();
        } catch (err) {
            console.error('Error al solicitar la aprobación:', err);
            setError('No se pudo solicitar la aprobación: ' + err.message);
        } finally {
            setSolicitandoId(null);
        }
    };

    const handleDescargar = async (programa) => {
        setDescargandoId(programa.id);
        try {
            const res = await api.get(`/programas/${programa.id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${programa.titulo || 'programa'}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error al descargar el PDF:', err);
        } finally {
            setDescargandoId(null);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            {error && (
                <div className="mb-5 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                    {error}
                </div>
            )}
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
                            {programasPagina.map((programa) => {
                                const gestionable = puedeGestionar(programa);
                                const puedeRetroceder = puedeVolverABorrador(programa);
                                const aprobable = puedeAprobar(programa);
                                const solicitable = puedeSolicitarAprobacion(programa);
                                const enRevision = programa.estado === 'enviado';
                                return (
                                    <tr key={programa.id} className="group hover:bg-scout-bg-panel transition-colors">
                                        <td className="py-4 pr-4">
                                            <p className="text-xs font-bold text-scout-ink transition-colors">{programa.titulo}</p>
                                        </td>
                                        <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.rama?.nombre || '—'}</td>
                                        <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.grupo?.nombre || '—'}</td>
                                        <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{programa.owner?.name || 'Sin asignar'}</td>
                                        <td className="py-4 pr-4"><EstadoBadge estado={ESTADO_LABELS[programa.estado] || programa.estado} /></td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setExpandedId(programa.id)}
                                                    className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                    title="Ver"
                                                >
                                                    <Eye size={13} />
                                                </button>

                                                <button
                                                    onClick={() => handleDescargar(programa)}
                                                    disabled={descargandoId === programa.id}
                                                    className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer disabled:opacity-40"
                                                    title="Descargar PDF"
                                                >
                                                    <Download size={13} />
                                                </button>

                                                {gestionable && (
                                                    <>
                                                        <Link
                                                            to={`/gestion-programas/editar/${programa.tipo}/${programa.id}`}
                                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={13} />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleEnviar(programa)}
                                                            disabled={enviandoId === programa.id}
                                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer disabled:opacity-40"
                                                            title="Enviar a revisión"
                                                        >
                                                            <Send size={13} />
                                                        </button>
                                                    </>
                                                )}

                                                {enRevision && (
                                                    <Link
                                                        to={`/gestion-programas/revisar/${programa.id}`}
                                                        className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                        title="Revisar y comentar"
                                                    >
                                                        <MessageSquare size={13} />
                                                    </Link>
                                                )}

                                                {solicitable && (
                                                    <button
                                                        onClick={() => handleSolicitarAprobacion(programa)}
                                                        disabled={solicitandoId === programa.id || !!programa.aprobacion_solicitada_at}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default ${
                                                            programa.aprobacion_solicitada_at
                                                                ? 'border-scout-success/30 bg-scout-success/10 text-scout-success'
                                                                : 'border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary'
                                                        }`}
                                                        title={programa.aprobacion_solicitada_at ? 'Aprobación ya solicitada' : 'Solicitar aprobación'}
                                                    >
                                                        <BadgeCheck size={13} />
                                                    </button>
                                                )}

                                                {aprobable && (
                                                    <button
                                                        onClick={() => handleAprobar(programa)}
                                                        disabled={aprobandoId === programa.id}
                                                        className="p-1.5 rounded-lg border border-scout-success/30 hover:bg-scout-success/10 text-scout-success transition-colors cursor-pointer disabled:opacity-40"
                                                        title="Aprobar programa"
                                                    >
                                                        <CheckCircle2 size={13} />
                                                    </button>
                                                )}

                                                {puedeRetroceder && (
                                                    <button
                                                        onClick={() => handleVolverABorrador(programa)}
                                                        disabled={volviendoId === programa.id}
                                                        className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer disabled:opacity-40"
                                                        title="Volver a borrador"
                                                    >
                                                        <Undo2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
// src/pages/Logueado/Programas/RevisarPrograma.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Users, Tag, MessageSquarePlus, Lock, Type, Stethoscope, Target, CalendarDays, MessagesSquare, Download, BadgeCheck, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useAuthorizedFetch } from '../../../hooks/useAuthorizedFetch';
import api from '../../../api/axios';
import EstadoBadge from '../../../components/ui/EstadoBadge';
import RechazarProgramaModal from '../../../components/ui/RechazarProgramaModal';
import { getLineasPrograma } from '../../Dashboard/Panels/Programas/programaLineas';
import { useProgramaNotas } from '../../Dashboard/Panels/Programas/useProgramaNotas';
import HiloComentario from './HiloComentario';

const ESTADO_LABELS = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const TIPO_LABELS = {
    cuatrimestre: 'Programa de Cuatrimestre',
    campamento: 'Campamento / Acantonamiento',
    cfa: 'Campamento Anual',
};

// Mismo criterio de color por rama que ProgramaDetalleModal.jsx, acá usado como
// acento del encabezado en vez de overlay de fondo.
const RAMA_ACCENT_COLORS = {
    'Castores': '#F97316',
    'Lobatos': '#FACC15',
    'Unidad Scout': '#16A34A',
    'Caminantes': '#00AAF2',
    'Rovers': '#DA251C',
};
const ACCENT_COLOR_DEFAULT = '#00AAF2';

const SECCION_ICONOS = {
    titulo: Type,
    educadores: Users,
    diagnostico: Stethoscope,
    objetivos: Target,
    infoAdicional: MapPin,
};
const getIconoSeccion = (seccionKey) => SECCION_ICONOS[seccionKey] || CalendarDays;

// Misma cascada de roles que ProgramPolicy::comment() en el backend — "Educador"
// es el rol por defecto (un usuario sin roles cargados cuenta como educador),
// por eso no se busca 'educador' explícitamente, es el fallback final.
const puedeComentarPrograma = (programa, user) => {
    if (!programa || programa.estado !== 'enviado') return false;

    const roles = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
    if (roles.includes('director') || roles.includes('jefe de grupo')) return false;
    if (roles.includes('aux prog general')) return true;
    if (roles.includes('aux prog rama')) return Number(programa.rama?.id) === Number(user?.rama?.id);

    return Number(programa.rama?.id) === Number(user?.rama?.id);
};

// Mismo criterio que ProgramasTable.jsx / ProgramPolicy::updateStatus() y
// solicitarAprobacion(): autor o cualquier educador de la misma rama+grupo.
const esColaboradorPrograma = (programa, user) => {
    const esAutor = Number(programa?.owner?.id) === Number(user?.id);
    const compartenRamaYGrupo =
        Number(programa?.rama?.id) === Number(user?.rama?.id) &&
        Number(programa?.grupo?.id) === Number(user?.grupo?.id);

    return esAutor || compartenRamaYGrupo;
};

const puedeSolicitarAprobacionPrograma = (programa, user) =>
    programa?.estado === 'enviado' && esColaboradorPrograma(programa, user);

const puedeAprobarPrograma = (programa, user) => {
    if (programa?.estado !== 'enviado') return false;

    const roles = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
    if (roles.includes('aux prog general')) return true;
    if (roles.includes('aux prog rama')) return Number(programa.rama?.id) === Number(user?.rama?.id);

    return false;
};

const LineaConHilos = ({ linea, hilos, puedeComentar, onAbrirComposer, composerAbierto, onResponder, onToggleResuelta, children }) => (
    <div className="py-1.5">
        <div className="group relative flex items-start gap-2 rounded-lg px-2 py-1 hover:bg-scout-bg-card transition-colors">
            {puedeComentar && (
                <button
                    type="button"
                    onClick={() => onAbrirComposer(linea.lineRef)}
                    title="Comentar esta línea"
                    className={`shrink-0 p-1.5 rounded-lg border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-card transition-opacity cursor-pointer ${
                        composerAbierto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <MessageSquarePlus size={13} />
                </button>
            )}
            {linea.tipo === 'html' ? (
                <div
                    className="flex-1 text-sm text-scout-ink leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: linea.contenido }}
                />
            ) : (
                <p className="flex-1 text-sm text-scout-ink leading-relaxed whitespace-pre-line">{linea.contenido || '—'}</p>
            )}
        </div>
        {children}
        {hilos.map((hilo) => (
            <HiloComentario
                key={hilo.id}
                hilo={hilo}
                puedeComentar={puedeComentar}
                onResponder={onResponder}
                onToggleResuelta={onToggleResuelta}
            />
        ))}
    </div>
);

const RevisarPrograma = () => {
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);
    const { authorizedFetch } = useAuthorizedFetch();

    const [programa, setPrograma] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [composerLineRef, setComposerLineRef] = useState(null);
    const [composerTexto, setComposerTexto] = useState('');
    const [enviandoComposer, setEnviandoComposer] = useState(false);

    const [accionandoEstado, setAccionandoEstado] = useState(false);
    const [descargando, setDescargando] = useState(false);
    const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);

    const { notas, crearHilo, responder, toggleResuelta } = useProgramaNotas(id);

    // Nombrado (en vez de inline en el useEffect) para poder volver a pedirlo
    // después de solicitar aprobación / aprobar, y reflejar el estado nuevo sin recargar la página.
    const fetchPrograma = useCallback(() => {
        setIsLoading(true);
        return authorizedFetch(`/programas/${id}`)
            .then(setPrograma)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        fetchPrograma();
    }, [fetchPrograma]);

    const lineas = useMemo(() => getLineasPrograma(programa), [programa]);
    const puedeComentar = useMemo(() => puedeComentarPrograma(programa, user), [programa, user]);
    const puedeSolicitarAprobacion = useMemo(() => puedeSolicitarAprobacionPrograma(programa, user), [programa, user]);
    const puedeAprobar = useMemo(() => puedeAprobarPrograma(programa, user), [programa, user]);

    const lineRefsExistentes = useMemo(
        () => new Set(lineas.flatMap((s) => s.lineas.map((l) => l.lineRef))),
        [lineas]
    );

    const notasPorLinea = useMemo(() => {
        const mapa = new Map();
        notas.forEach((nota) => {
            const lista = mapa.get(nota.line_ref) || [];
            lista.push(nota);
            mapa.set(nota.line_ref, lista);
        });
        return mapa;
    }, [notas]);

    const notasHuerfanas = useMemo(
        () => notas.filter((n) => !n.line_ref || !lineRefsExistentes.has(n.line_ref)),
        [notas, lineRefsExistentes]
    );

    const abrirComposer = useCallback((lineRef) => {
        setComposerLineRef((actual) => (actual === lineRef ? null : lineRef));
        setComposerTexto('');
    }, []);

    const handleCrearHilo = async (lineRef) => {
        if (!composerTexto.trim()) return;
        setEnviandoComposer(true);
        setError(null);
        try {
            await crearHilo(lineRef, composerTexto.trim());
            setComposerLineRef(null);
            setComposerTexto('');
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviandoComposer(false);
        }
    };

    const handleSolicitarAprobacion = async () => {
        setAccionandoEstado(true);
        setError(null);
        try {
            await authorizedFetch(`/programas/${id}/solicitar-aprobacion`, { method: 'PATCH' });
            await fetchPrograma();
        } catch (err) {
            setError(err.message);
        } finally {
            setAccionandoEstado(false);
        }
    };

    const handleAprobar = async () => {
        setAccionandoEstado(true);
        setError(null);
        try {
            await authorizedFetch(`/programas/${id}/estado`, { method: 'PATCH', body: { estado: 'aprobado' } });
            await fetchPrograma();
        } catch (err) {
            setError(err.message);
        } finally {
            setAccionandoEstado(false);
        }
    };

    const handleRechazar = async (motivo) => {
        setAccionandoEstado(true);
        setError(null);
        try {
            await authorizedFetch(`/programas/${id}/estado`, { method: 'PATCH', body: { estado: 'rechazado', motivo } });
            setMostrarModalRechazo(false);
            await fetchPrograma();
        } catch (err) {
            setError(err.message);
        } finally {
            setAccionandoEstado(false);
        }
    };

    const handleDescargar = async () => {
        setDescargando(true);
        try {
            const res = await api.get(`/programas/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${programa?.titulo || 'programa'}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error al descargar el PDF:', err);
        } finally {
            setDescargando(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-scout-bg-panel">
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando programa...</p>
            </div>
        );
    }

    if (!programa) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-scout-bg-panel p-10 text-center">
                <p className="text-sm font-bold text-scout-muted uppercase tracking-tight">
                    {error || 'No se pudo cargar el programa.'}
                </p>
                <Link to="/gestion-programas" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors">
                    <ArrowLeft size={14} /> Volver a Programas
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-scout-bg-panel font-sans p-6 md:p-10 overflow-y-auto text-left">
            <Link to="/gestion-programas" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors mb-4 shrink-0">
                <ArrowLeft size={14} /> Volver a Programas
            </Link>

            <div
                className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm border-t-[6px]"
                style={{ borderTopColor: RAMA_ACCENT_COLORS[programa.rama?.nombre] || ACCENT_COLOR_DEFAULT }}
            >
                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        <EstadoBadge estado={ESTADO_LABELS[programa.estado] || programa.estado} />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                            <Layers size={11} /> {programa.rama?.nombre || '—'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                            <Users size={11} /> {programa.grupo?.nombre || '—'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                            <Tag size={11} /> {TIPO_LABELS[programa.tipo] || programa.tipo || '—'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleDescargar}
                            disabled={descargando}
                            title="Descargar PDF"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer disabled:opacity-40"
                        >
                            <Download size={13} /> PDF
                        </button>

                        {puedeSolicitarAprobacion && (
                            <button
                                type="button"
                                onClick={handleSolicitarAprobacion}
                                disabled={accionandoEstado || !!programa.aprobacion_solicitada_at}
                                title={programa.aprobacion_solicitada_at ? 'Aprobación ya solicitada' : 'Solicitar aprobación'}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default ${
                                    programa.aprobacion_solicitada_at
                                        ? 'border-scout-success/30 bg-scout-success/10 text-scout-success'
                                        : 'border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel'
                                }`}
                            >
                                <BadgeCheck size={13} /> {programa.aprobacion_solicitada_at ? 'Aprobación solicitada' : 'Solicitar aprobación'}
                            </button>
                        )}

                        {puedeAprobar && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleAprobar}
                                    disabled={accionandoEstado}
                                    title="Aprobar programa"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-scout-success/30 text-[10px] font-black uppercase tracking-widest text-scout-success hover:bg-scout-success/10 transition-colors cursor-pointer disabled:opacity-40"
                                >
                                    <CheckCircle2 size={13} /> Aprobar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMostrarModalRechazo(true)}
                                    disabled={accionandoEstado}
                                    title="Rechazar programa"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-scout-accent/30 text-[10px] font-black uppercase tracking-widest text-scout-accent hover:bg-scout-accent-light transition-colors cursor-pointer disabled:opacity-40"
                                >
                                    <XCircle size={13} /> Rechazar
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-2 text-scout-ink">
                    {programa.titulo}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                    Autor: <span className="text-scout-ink">{programa.owner?.nombre_visible || programa.owner?.name || 'Sin asignar'}</span>
                </p>

                {programa.estado !== 'enviado' && (
                    <div className="mt-5 px-4 py-3 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center gap-2 text-[10px] font-bold text-scout-muted uppercase tracking-wide">
                        <Lock size={12} /> Los comentarios están congelados: el programa no está en revisión.
                    </div>
                )}
                {error && (
                    <div className="mt-5 px-4 py-3 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 mt-6">
                {lineas.map((seccion) => {
                    const IconoSeccion = getIconoSeccion(seccion.seccion);
                    return (
                    <div key={seccion.seccion} className="bg-scout-bg-card rounded-[2rem] border border-scout-border border-l-4 border-l-scout-primary shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-8 py-4 bg-scout-primary/5 border-b border-scout-border">
                            <span className="shrink-0 p-2 rounded-xl bg-scout-primary/10 text-scout-primary">
                                <IconoSeccion size={14} />
                            </span>
                            <h3 className="flex-1 text-sm font-black uppercase tracking-wide text-scout-ink">{seccion.label}</h3>
                            <span className="text-[9px] font-bold text-scout-muted uppercase tracking-widest">
                                {seccion.lineas.length} línea{seccion.lineas.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="p-8">
                        <div className="divide-y divide-scout-border bg-scout-bg-panel/50 rounded-2xl px-3">
                            {seccion.lineas.map((linea) => {
                                const hilos = notasPorLinea.get(linea.lineRef) || [];

                                return (
                                    <LineaConHilos
                                        key={linea.lineRef}
                                        linea={linea}
                                        hilos={hilos}
                                        puedeComentar={puedeComentar}
                                        onAbrirComposer={abrirComposer}
                                        composerAbierto={composerLineRef === linea.lineRef}
                                        onResponder={responder}
                                        onToggleResuelta={toggleResuelta}
                                    >
                                        {composerLineRef === linea.lineRef && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={composerTexto}
                                                    onChange={(e) => setComposerTexto(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleCrearHilo(linea.lineRef); }}
                                                    placeholder="Escribí un comentario sobre esta línea..."
                                                    className="flex-1 border border-scout-border rounded-xl px-3 py-2 text-xs bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleCrearHilo(linea.lineRef)}
                                                    disabled={enviandoComposer || !composerTexto.trim()}
                                                    className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                                                >
                                                    Comentar
                                                </button>
                                            </div>
                                        )}
                                    </LineaConHilos>
                                );
                            })}
                        </div>
                        </div>
                    </div>
                    );
                })}

                {notasHuerfanas.length > 0 && (
                    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border border-l-4 border-l-scout-muted shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-8 py-4 bg-scout-bg-panel border-b border-scout-border">
                            <span className="shrink-0 p-2 rounded-xl bg-scout-bg-card border border-scout-border text-scout-muted">
                                <MessagesSquare size={14} />
                            </span>
                            <h3 className="text-sm font-black uppercase tracking-wide text-scout-ink">Comentarios sin línea asociada</h3>
                        </div>
                        <div className="p-8">
                        {notasHuerfanas.map((hilo) => (
                            <HiloComentario
                                key={hilo.id}
                                hilo={hilo}
                                puedeComentar={puedeComentar}
                                onResponder={responder}
                                onToggleResuelta={toggleResuelta}
                            />
                        ))}
                        </div>
                    </div>
                )}
            </div>

            {mostrarModalRechazo && (
                <RechazarProgramaModal
                    titulo={programa.titulo}
                    onConfirm={handleRechazar}
                    onClose={() => setMostrarModalRechazo(false)}
                    isSubmitting={accionandoEstado}
                />
            )}
        </div>
    );
};

export default RevisarPrograma;

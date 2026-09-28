// src/pages/Dashboard/Actualizaciones.jsx
import React, { useState, useMemo } from 'react';
import { Rocket, Check, X, Trash2, RotateCcw } from 'lucide-react';
import { useFeatureRequests } from './Panels/Actualizaciones/useFeatureRequests';
import PeticionCard from './Panels/Actualizaciones/PeticionCard';
import PrioridadSelector from './Panels/Actualizaciones/PrioridadSelector';
import AsistenteIaChat from './Panels/Actualizaciones/AsistenteIaChat';
import { APP_VERSION } from '../../version';

const BotonAccion = ({ onClick, icon, label, tono = 'default' }) => {
    const tonos = {
        default: 'border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel',
        primary: 'border-scout-primary/30 text-scout-primary hover:bg-scout-primary/10',
        peligro: 'border-scout-accent/30 text-scout-accent hover:bg-scout-accent-light',
    };
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors cursor-pointer ${tonos[tono]}`}
        >
            {icon} {label}
        </button>
    );
};

const Seccion = ({ titulo, peticiones, vacio, children }) => (
    <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary mb-3">
            {titulo} <span className="text-scout-muted font-bold">({peticiones.length})</span>
        </h2>
        {peticiones.length === 0 ? (
            <p className="text-xs text-scout-muted font-medium">{vacio}</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
        )}
    </div>
);

const Actualizaciones = () => {
    const { peticiones, isLoading, cambiarEstado, cambiarPrioridad, eliminarPeticion, crearPeticion } = useFeatureRequests();
    const [idea, setIdea] = useState('');
    const [prioridad, setPrioridad] = useState('media');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const porEstado = useMemo(() => {
        // Alta primero, después Media, después Baja/sin prioridad — y dentro
        // de cada prioridad, la más antigua primero.
        const RANGO_PRIORIDAD = { alta: 0, media: 1, baja: 2 };
        const ordenar = (lista) => [...lista].sort((a, b) => {
            const rangoA = RANGO_PRIORIDAD[a.prioridad] ?? 3;
            const rangoB = RANGO_PRIORIDAD[b.prioridad] ?? 3;
            if (rangoA !== rangoB) return rangoA - rangoB;
            return new Date(a.created_at) - new Date(b.created_at);
        });

        return {
            pendiente: ordenar(peticiones.filter((p) => p.estado === 'pendiente')),
            proxima_version: ordenar(peticiones.filter((p) => p.estado === 'proxima_version')),
            implementada: ordenar(peticiones.filter((p) => p.estado === 'implementada')),
            descartada: ordenar(peticiones.filter((p) => p.estado === 'descartada')),
        };
    }, [peticiones]);

    const editorPrioridadDe = (p) => (
        <PrioridadSelector
            label="Cambiar prioridad"
            value={p.prioridad}
            onChange={(valor) => cambiarPrioridad(p.id, valor)}
            onClear={() => cambiarPrioridad(p.id, null)}
        />
    );

    const handleAgregarIdea = async (e) => {
        e.preventDefault();
        if (!idea.trim()) return;
        setError(null);
        setEnviando(true);
        try {
            await crearPeticion(idea.trim(), { prioridad });
            setIdea('');
            setPrioridad('media');
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Solo Developer
                </span>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                        <Rocket size={20} /> Actualizaciones para versiones siguientes
                    </h1>
                    <span className="text-xl md:text-2xl font-black text-scout-primary tracking-tight shrink-0">
                        Versión actual: v{APP_VERSION}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0" style={{ height: '50vh' }}>
                <form onSubmit={handleAgregarIdea} className="bg-scout-bg-card rounded-2xl border border-scout-border p-5 shadow-sm flex flex-col h-full min-h-0">
                    <label className="text-xs font-black uppercase tracking-widest text-scout-primary mb-2 block shrink-0">
                        Agregar tu idea
                    </label>
                    <p className="text-[11px] text-scout-muted font-medium mb-3 shrink-0">
                        Va directo a "Próxima versión" — no necesitás aprobación de nadie.
                    </p>
                    {error && <p className="text-xs font-bold text-scout-accent mb-3 shrink-0">{error}</p>}
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Ej: agregar adjuntos reales en Programas..."
                        className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none flex-1 min-h-0"
                    />
                    <div className="mt-3 shrink-0">
                        <PrioridadSelector value={prioridad} onChange={setPrioridad} />
                    </div>
                    <button
                        type="submit"
                        disabled={!idea.trim() || enviando}
                        className="mt-3 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40 shrink-0 self-start"
                    >
                        {enviando ? 'Agregando...' : 'Agregar idea'}
                    </button>
                </form>

                <AsistenteIaChat />
            </div>

            <div className="mt-6 pb-6">
                {isLoading ? (
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
                ) : (
                    <>
                        <Seccion titulo="Pendientes de revisar" peticiones={porEstado.pendiente} vacio="No hay peticiones nuevas de Director.">
                            {porEstado.pendiente.map((p) => (
                                <PeticionCard key={p.id} peticion={p} editorPrioridad={editorPrioridadDe(p)}>
                                    <BotonAccion tono="primary" icon={<Check size={11} />} label="Próxima versión" onClick={() => cambiarEstado(p.id, 'proxima_version')} />
                                    <BotonAccion tono="peligro" icon={<X size={11} />} label="Descartar" onClick={() => cambiarEstado(p.id, 'descartada')} />
                                </PeticionCard>
                            ))}
                        </Seccion>

                        <Seccion titulo="Próxima versión" peticiones={porEstado.proxima_version} vacio="Todavía no hay nada anotado para la próxima versión.">
                            {porEstado.proxima_version.map((p) => (
                                <PeticionCard key={p.id} peticion={p} editorPrioridad={editorPrioridadDe(p)}>
                                    <BotonAccion icon={<Check size={11} />} label="Implementada" onClick={() => cambiarEstado(p.id, 'implementada')} />
                                    <BotonAccion tono="peligro" icon={<X size={11} />} label="Descartar" onClick={() => cambiarEstado(p.id, 'descartada')} />
                                </PeticionCard>
                            ))}
                        </Seccion>

                        <Seccion titulo="Implementadas" peticiones={porEstado.implementada} vacio="Todavía no marcaste nada como implementado.">
                            {porEstado.implementada.map((p) => (
                                <PeticionCard key={p.id} peticion={p} editorPrioridad={editorPrioridadDe(p)}>
                                    <BotonAccion icon={<Trash2 size={11} />} label="Eliminar" onClick={() => eliminarPeticion(p.id)} />
                                </PeticionCard>
                            ))}
                        </Seccion>

                        <Seccion titulo="Descartadas" peticiones={porEstado.descartada} vacio="No descartaste ninguna todavía.">
                            {porEstado.descartada.map((p) => (
                                <PeticionCard key={p.id} peticion={p} editorPrioridad={editorPrioridadDe(p)}>
                                    <BotonAccion icon={<RotateCcw size={11} />} label="Reabrir" onClick={() => cambiarEstado(p.id, 'pendiente')} />
                                    <BotonAccion tono="peligro" icon={<Trash2 size={11} />} label="Eliminar" onClick={() => eliminarPeticion(p.id)} />
                                </PeticionCard>
                            ))}
                        </Seccion>
                    </>
                )}
            </div>
        </div>
    );
};

export default Actualizaciones;

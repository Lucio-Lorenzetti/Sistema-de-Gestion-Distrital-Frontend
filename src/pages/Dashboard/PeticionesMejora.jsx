// src/pages/Dashboard/PeticionesMejora.jsx
import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useFeatureRequests } from './Panels/Actualizaciones/useFeatureRequests';
import PeticionCard from './Panels/Actualizaciones/PeticionCard';
import PrioridadSelector from './Panels/Actualizaciones/PrioridadSelector';

const PeticionesMejora = () => {
    const { peticiones, isLoading, crearPeticion } = useFeatureRequests();
    const [contenido, setContenido] = useState('');
    const [prioridad, setPrioridad] = useState('media');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);
    const [ok, setOk] = useState(false);

    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!contenido.trim()) return;
        setError(null);
        setOk(false);
        setEnviando(true);
        try {
            await crearPeticion(contenido.trim(), { prioridad });
            setContenido('');
            setPrioridad('media');
            setOk(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Peticiones de Mejora
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                    <Lightbulb size={20} /> Peticiones de mejora
                </h1>
            </div>

            <div className="mt-6 overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
                <form onSubmit={handleEnviar} className="bg-scout-bg-card rounded-2xl border border-scout-border p-5 shadow-sm mb-8">
                    <label className="text-xs font-black uppercase tracking-widest text-scout-primary mb-2 block">
                        Proponer una mejora
                    </label>
                    <p className="text-[11px] text-scout-muted font-medium mb-3">
                        Le llega directo al Developer para que la evalúe para una próxima versión.
                    </p>
                    {error && <p className="text-xs font-bold text-scout-accent mb-3">{error}</p>}
                    {ok && <p className="text-xs font-bold text-scout-success mb-3">¡Enviada! La vas a ver en tu lista de abajo.</p>}
                    <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        rows={3}
                        placeholder="Contame qué te gustaría que tenga el sistema..."
                        className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                    />
                    <div className="mt-3">
                        <PrioridadSelector value={prioridad} onChange={setPrioridad} />
                    </div>
                    <button
                        type="submit"
                        disabled={!contenido.trim() || enviando}
                        className="mt-3 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40"
                    >
                        {enviando ? 'Enviando...' : 'Enviar petición'}
                    </button>
                </form>

                <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary mb-3">
                    Tus peticiones <span className="text-scout-muted font-bold">({peticiones.length})</span>
                </h2>

                {isLoading ? (
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
                ) : peticiones.length === 0 ? (
                    <p className="text-xs text-scout-muted font-medium">Todavía no mandaste ninguna.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {peticiones.map((p) => (
                            <PeticionCard key={p.id} peticion={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeticionesMejora;

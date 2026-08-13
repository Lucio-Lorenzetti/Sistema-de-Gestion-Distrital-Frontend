// src/pages/Logueado/Programas/HiloComentario.jsx
import React, { useState } from 'react';
import { Check, Undo2, ChevronDown, ChevronUp, CornerDownRight } from 'lucide-react';
import Avatar from '../../../components/ui/Avatar';

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
};

// Una fila de comentario "estilo GitLab": avatar a la izquierda conectado por
// una línea vertical al resto del hilo, contenido a la derecha.
const Comentario = ({ nota, esRaiz }) => (
    <div className="flex items-start gap-3">
        <div className="flex flex-col items-center shrink-0">
            <Avatar name={nota.user?.name} />
            {!esRaiz && <div className="w-px flex-1 bg-scout-border mt-1" />}
        </div>
        <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-scout-ink">{nota.user?.name || 'Usuario'}</span>
                <span className="text-[10px] font-bold text-scout-muted">{formatFecha(nota.created_at)}</span>
            </div>
            <p className="text-xs text-scout-ink leading-relaxed whitespace-pre-line mt-0.5">{nota.contenido}</p>
        </div>
    </div>
);

// Un hilo = comentario raíz + respuestas lineales (sin anidar), como los
// comentarios de línea de un Merge Request. puedeComentar ya viene calculado
// por la página contra la misma matriz de roles que exige el backend.
const HiloComentario = ({ hilo, puedeComentar, onResponder, onToggleResuelta }) => {
    const [respuesta, setRespuesta] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);
    const [colapsado, setColapsado] = useState(false);

    const tieneRespuestas = hilo.replies?.length > 0;

    const handleResponder = async () => {
        if (!respuesta.trim()) return;
        setEnviando(true);
        setError(null);
        try {
            await onResponder(hilo.id, respuesta.trim());
            setRespuesta('');
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    const handleToggleResuelta = async () => {
        setError(null);
        try {
            await onToggleResuelta(hilo.id, !hilo.resuelta);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={`mt-3 rounded-2xl border overflow-hidden transition-colors ${
            hilo.resuelta ? 'border-scout-success/30 bg-scout-bg-panel/60' : 'border-scout-border bg-scout-bg-card'
        }`}>
            {/* Barra superior estilo GitLab: estado del hilo + acción de resolver */}
            <div className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${
                hilo.resuelta ? 'border-scout-success/20 bg-scout-success/5' : 'border-scout-border bg-scout-bg-panel/50'
            }`}>
                <button
                    type="button"
                    onClick={() => setColapsado((c) => !c)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                >
                    {colapsado ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    {hilo.resuelta ? (
                        <span className="text-scout-success">Resuelto</span>
                    ) : (
                        <span>Hilo{tieneRespuestas ? ` · ${hilo.replies.length + 1} comentarios` : ''}</span>
                    )}
                </button>

                {puedeComentar && (
                    <button
                        type="button"
                        onClick={handleToggleResuelta}
                        title={hilo.resuelta ? 'Reabrir hilo' : 'Marcar como resuelto'}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer shrink-0 ${
                            hilo.resuelta
                                ? 'border-scout-border text-scout-muted hover:text-scout-primary hover:border-scout-primary/30'
                                : 'border-scout-success/30 text-scout-success hover:bg-scout-success/10'
                        }`}
                    >
                        {hilo.resuelta ? <Undo2 size={12} /> : <Check size={12} />}
                        {hilo.resuelta ? 'Reabrir' : 'Resolver'}
                    </button>
                )}
            </div>

            {!colapsado && (
                <div className="p-3 flex flex-col gap-2">
                    <Comentario nota={hilo} esRaiz={!tieneRespuestas} />

                    {tieneRespuestas && (
                        <div className="pl-1">
                            {hilo.replies.map((r, i) => (
                                <Comentario key={r.id} nota={r} esRaiz={i === hilo.replies.length - 1} />
                            ))}
                        </div>
                    )}

                    {error && <p className="text-[10px] font-bold text-scout-accent uppercase tracking-wide">{error}</p>}

                    {puedeComentar && (
                        <div className="flex items-center gap-2 pt-2 mt-1 border-t border-scout-border">
                            <CornerDownRight size={13} className="text-scout-muted shrink-0" />
                            <input
                                type="text"
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleResponder(); }}
                                placeholder="Responder..."
                                className="flex-1 border border-scout-border rounded-xl px-3 py-1.5 text-xs bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                            />
                            <button
                                type="button"
                                onClick={handleResponder}
                                disabled={enviando || !respuesta.trim()}
                                className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                            >
                                Responder
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HiloComentario;

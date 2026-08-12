// src/pages/Logueado/Programas/HiloComentario.jsx
import React, { useState } from 'react';
import { Check, Undo2 } from 'lucide-react';

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
};

const Comentario = ({ nota }) => (
    <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-scout-ink">{nota.user?.name || 'Usuario'}</span>
            <span className="text-[9px] font-bold text-scout-muted uppercase tracking-wide">{formatFecha(nota.created_at)}</span>
        </div>
        <p className="text-xs text-scout-ink leading-relaxed whitespace-pre-line">{nota.contenido}</p>
    </div>
);

// Un hilo = comentario raíz + respuestas lineales (sin anidar), como los
// comentarios de línea de un Merge Request. puedeComentar ya viene calculado
// por la página contra la misma matriz de roles que exige el backend.
const HiloComentario = ({ hilo, puedeComentar, onResponder, onToggleResuelta }) => {
    const [respuesta, setRespuesta] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

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
        <div className={`mt-2 rounded-2xl border p-3 flex flex-col gap-3 transition-colors ${
            hilo.resuelta ? 'border-scout-border bg-scout-bg-panel/60 opacity-75' : 'border-scout-primary/30 bg-scout-bg-panel'
        }`}>
            <div className="flex items-start justify-between gap-2">
                <Comentario nota={hilo} />
                {hilo.resuelta && (
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-scout-success">Resuelto</span>
                )}
            </div>

            {hilo.replies?.length > 0 && (
                <div className="flex flex-col gap-3 pl-3 border-l-2 border-scout-border">
                    {hilo.replies.map((r) => <Comentario key={r.id} nota={r} />)}
                </div>
            )}

            {error && <p className="text-[10px] font-bold text-scout-accent uppercase tracking-wide">{error}</p>}

            {puedeComentar && (
                <div className="flex items-center gap-2 pt-2 border-t border-scout-border">
                    <input
                        type="text"
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleResponder(); }}
                        placeholder="Responder..."
                        className="flex-1 border border-scout-border rounded-xl px-3 py-1.5 text-xs bg-scout-bg-card text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                    />
                    <button
                        type="button"
                        onClick={handleResponder}
                        disabled={enviando || !respuesta.trim()}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        Responder
                    </button>
                    <button
                        type="button"
                        onClick={handleToggleResuelta}
                        title={hilo.resuelta ? 'Reabrir hilo' : 'Marcar como resuelto'}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                            hilo.resuelta
                                ? 'border-scout-border text-scout-muted hover:text-scout-primary'
                                : 'border-scout-success/30 text-scout-success hover:bg-scout-success/10'
                        }`}
                    >
                        {hilo.resuelta ? <Undo2 size={13} /> : <Check size={13} />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HiloComentario;

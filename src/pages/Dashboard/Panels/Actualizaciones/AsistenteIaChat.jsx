// src/pages/Dashboard/Panels/Actualizaciones/AsistenteIaChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const AsistenteIaChat = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [mensajes, setMensajes] = useState([]);
    const [entrada, setEntrada] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [noConfigurado, setNoConfigurado] = useState(false);
    const finRef = useRef(null);

    useEffect(() => {
        finRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const handleEnviar = async (e) => {
        e.preventDefault();
        const texto = entrada.trim();
        if (!texto || enviando) return;

        const historial = mensajes.map((m) => ({ role: m.role, contenido: m.contenido }));
        setMensajes((prev) => [...prev, { role: 'user', contenido: texto }]);
        setEntrada('');
        setEnviando(true);

        try {
            const res = await authorizedFetch('/actualizaciones/chat', {
                method: 'POST',
                body: { mensaje: texto, historial },
            });

            if (res.configurado === false) {
                setNoConfigurado(true);
                return;
            }

            setMensajes((prev) => [...prev, { role: 'assistant', contenido: res.respuesta }]);
        } catch (err) {
            setMensajes((prev) => [...prev, { role: 'assistant', contenido: `Error: ${err.message}` }]);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-2xl border border-scout-border shadow-sm flex flex-col h-full min-h-0">
            <div className="px-5 py-4 border-b border-scout-border shrink-0">
                <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary flex items-center gap-2">
                    <Sparkles size={13} /> Asistente IA
                </h2>
                <p className="text-[11px] text-scout-muted font-medium mt-1">
                    Pensá ideas para próximas versiones en base al roadmap actual.
                </p>
            </div>

            {noConfigurado ? (
                <div className="flex-1 flex items-center justify-center px-6 text-center">
                    <p className="text-xs text-scout-muted font-medium">
                        Todavía no configuraste la API key de Gemini — agregá <code className="font-mono">GEMINI_API_KEY</code> en el <code className="font-mono">.env</code> del backend (o en Render) para activar esto.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                        {mensajes.length === 0 && (
                            <p className="text-xs text-scout-muted font-medium">
                                Preguntame, por ejemplo: "¿qué le falta al módulo de Cursos?"
                            </p>
                        )}
                        {mensajes.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                                    m.role === 'user'
                                        ? 'self-end bg-scout-primary text-scout-on-brand'
                                        : 'self-start bg-scout-bg-panel text-scout-ink'
                                }`}
                            >
                                {m.contenido}
                            </div>
                        ))}
                        {enviando && <p className="text-[10px] text-scout-muted font-bold uppercase tracking-widest animate-pulse">Pensando...</p>}
                        <div ref={finRef} />
                    </div>

                    <form onSubmit={handleEnviar} className="p-3 border-t border-scout-border flex items-center gap-2 shrink-0">
                        <input
                            type="text"
                            value={entrada}
                            onChange={(e) => setEntrada(e.target.value)}
                            placeholder="Escribí tu pregunta..."
                            className="flex-1 border border-scout-border rounded-xl px-3 py-2 text-xs bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!entrada.trim() || enviando}
                            className="p-2.5 rounded-xl bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default AsistenteIaChat;

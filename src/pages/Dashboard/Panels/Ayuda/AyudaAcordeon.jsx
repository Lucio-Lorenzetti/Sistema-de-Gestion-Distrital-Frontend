// src/pages/Dashboard/Panels/Ayuda/AyudaAcordeon.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SECCIONES_AYUDA } from './ayudaContenido';

// Sección sin roles definidos = para todos; si tiene roles, solo se muestra a
// quien tenga alguno de esos roles asignados. Developer ve todo, igual que
// bypassea cualquier otro permiso del sistema.
const seccionEsRelevante = (seccion, roleNames) =>
    seccion.roles.length === 0 || roleNames.includes('developer') || seccion.roles.some((r) => roleNames.includes(r));

const AyudaAcordeon = ({ roleNames = [] }) => {
    const secciones = SECCIONES_AYUDA.filter((s) => seccionEsRelevante(s, roleNames));
    const [abiertas, setAbiertas] = useState(() => new Set(secciones.map((s) => s.id)));

    const toggle = (id) => {
        setAbiertas((prev) => {
            const siguiente = new Set(prev);
            if (siguiente.has(id)) siguiente.delete(id);
            else siguiente.add(id);
            return siguiente;
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {secciones.map((seccion) => {
                const abierta = abiertas.has(seccion.id);

                return (
                    <div key={seccion.id} className="bg-scout-bg-card rounded-[2rem] border border-scout-border shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggle(seccion.id)}
                            className="w-full flex items-center justify-between gap-4 px-8 py-5 text-left cursor-pointer"
                        >
                            <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary">{seccion.titulo}</h2>
                            <ChevronDown size={16} className={`text-scout-muted shrink-0 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`} />
                        </button>

                        {abierta && (
                            <div className="px-8 pb-6 flex flex-col gap-4">
                                {seccion.bloques.map((bloque, i) => (
                                    <div key={i}>
                                        {bloque.subtitulo && (
                                            <h3 className="text-xs font-bold text-scout-ink mb-1.5">{bloque.subtitulo}</h3>
                                        )}
                                        <ul className="list-disc list-inside space-y-1">
                                            {bloque.items.map((item, j) => (
                                                <li key={j} className="text-xs text-scout-muted font-medium leading-relaxed">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AyudaAcordeon;

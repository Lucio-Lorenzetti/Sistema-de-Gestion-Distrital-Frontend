// src/pages/Dashboard/Panels/Actualizaciones/HistorialVersiones.jsx
import { ChevronDown } from 'lucide-react';
import { CHANGELOG } from '../../../../changelog';
import { APP_VERSION } from '../../../../version';

const TIPOS = {
    nuevo: { label: 'Nuevo', clase: 'bg-scout-primary/10 text-scout-primary' },
    mejora: { label: 'Mejora', clase: 'bg-scout-success/10 text-scout-success' },
    fix: { label: 'Corrección', clase: 'bg-scout-accent/10 text-scout-accent' },
};

const formatearFecha = (iso) => {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
};

const HistorialVersiones = () => (
    <section className="mt-2 pb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-scout-primary mb-3">
            Historial de versiones <span className="text-scout-muted font-bold">({CHANGELOG.length})</span>
        </h2>

        <div className="flex flex-col gap-3">
            {CHANGELOG.map((entrada) => {
                const esActual = entrada.version === APP_VERSION;
                return (
                    <details
                        key={entrada.version}
                        open={esActual}
                        className="group bg-scout-bg-card rounded-2xl border border-scout-border shadow-sm"
                    >
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            <span className="text-base font-black text-scout-primary shrink-0">v{entrada.version}</span>
                            {esActual && (
                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-scout-primary text-scout-on-brand shrink-0">
                                    Actual
                                </span>
                            )}
                            <span className="text-sm font-bold text-scout-ink min-w-0 truncate">{entrada.titulo}</span>
                            <span className="ml-auto text-xs font-bold uppercase tracking-widest text-scout-muted shrink-0">
                                {formatearFecha(entrada.fecha)}
                            </span>
                            <ChevronDown size={16} className="text-scout-muted shrink-0 transition-transform group-open:rotate-180" />
                        </summary>

                        <ul className="px-5 pb-5 flex flex-col gap-2.5 border-t border-scout-border pt-4">
                            {entrada.cambios.map((cambio, i) => {
                                const tipo = TIPOS[cambio.tipo] ?? TIPOS.mejora;
                                return (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md shrink-0 w-24 text-center ${tipo.clase}`}>
                                            {tipo.label}
                                        </span>
                                        <span className="text-sm text-scout-ink/80 font-medium leading-relaxed">{cambio.texto}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </details>
                );
            })}
        </div>
    </section>
);

export default HistorialVersiones;

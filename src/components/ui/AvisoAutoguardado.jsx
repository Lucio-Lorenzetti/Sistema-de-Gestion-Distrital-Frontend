// src/components/ui/AvisoAutoguardado.jsx
// Franja de estado del autoguardado de un formulario (ver hooks/useAutoguardado.js).
import { Check, History } from 'lucide-react';

const hace = (ms) => {
    const seg = Math.max(0, Math.round((Date.now() - ms) / 1000));
    if (seg < 10) return 'hace un momento';
    if (seg < 60) return `hace ${seg} segundos`;
    const min = Math.round(seg / 60);
    if (min < 60) return `hace ${min} min`;
    const horas = Math.round(min / 60);
    if (horas < 24) return `hace ${horas} h`;
    return new Date(ms).toLocaleDateString('es-AR');
};

const AvisoAutoguardado = ({ restaurado, restauradoEn, guardadoEn, descartar, nota }) => (
    <div className="shrink-0 mt-4 flex flex-col gap-2">
        {restaurado && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 rounded-2xl border border-scout-primary/30 bg-scout-primary/10">
                <History size={16} className="text-scout-primary shrink-0" />
                <p className="text-sm font-bold text-scout-ink flex-1 min-w-[12rem] leading-relaxed">
                    Recuperamos lo que habías cargado{restauradoEn ? ` (guardado ${hace(restauradoEn)})` : ''}.
                    {nota ? ` ${nota}` : ''}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm('¿Descartar el borrador y empezar de cero?')) descartar();
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-scout-accent hover:underline cursor-pointer shrink-0"
                >
                    Descartar y empezar de cero
                </button>
            </div>
        )}
        <p className="flex items-center gap-1.5 text-sm font-bold text-scout-muted">
            <Check size={13} className={guardadoEn ? 'text-scout-success' : 'text-scout-muted'} />
            {guardadoEn
                ? `Borrador guardado automáticamente ${hace(guardadoEn)}`
                : 'Tu avance se guarda solo en este dispositivo mientras escribís.'}
        </p>
    </div>
);

export default AvisoAutoguardado;

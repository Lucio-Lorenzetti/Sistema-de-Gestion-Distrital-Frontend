// src/pages/Dashboard/Panels/Actualizaciones/PrioridadSelector.jsx
import React from 'react';
import { X } from 'lucide-react';
import { PRIORIDAD_LABELS } from './useFeatureRequests';

// Mismos tonos sólidos que EstadoBadge (no solo texto/borde), para que se vea
// igual acá que en el label ya puesto de la tarjeta.
const TONOS = {
    alta: 'bg-red-900 text-white',
    media: 'bg-[#ebd534] text-black',
    baja: 'bg-green-900 text-white',
};

// onClear (opcional): además de elegir Alta/Media/Baja, permite sacarle del
// todo la prioridad a una petición ya creada (queda sin label).
const PrioridadSelector = ({ value, onChange, onClear, label = 'Prioridad' }) => (
    <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
            {label}
        </label>
        <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(PRIORIDAD_LABELS).map(([valor, texto]) => (
                <button
                    key={valor}
                    type="button"
                    onClick={() => onChange(valor)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${TONOS[valor]} ${
                        value === valor ? 'ring-2 ring-offset-2 ring-scout-primary' : 'opacity-40 hover:opacity-100'
                    }`}
                >
                    {texto}
                </button>
            ))}
            {onClear && value && (
                <button
                    type="button"
                    onClick={onClear}
                    title="Sacar prioridad"
                    className="p-1.5 rounded-xl border border-scout-border text-scout-muted hover:text-scout-accent hover:bg-scout-accent-light transition-colors cursor-pointer"
                >
                    <X size={11} />
                </button>
            )}
        </div>
    </div>
);

export default PrioridadSelector;

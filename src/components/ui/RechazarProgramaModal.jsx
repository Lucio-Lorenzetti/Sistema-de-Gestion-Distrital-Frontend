// src/components/ui/RechazarProgramaModal.jsx
// Modal genérico compartido por ProgramasTable.jsx/RevisarPrograma.jsx (rechazar
// un programa) y SolicitudesRolTable.jsx (rechazar una solicitud de rol): pide
// el motivo (obligatorio) antes de confirmar el rechazo.
import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';

const RechazarProgramaModal = ({
    titulo,
    heading = 'Rechazar Programa',
    mensaje = 'contale al autor por qué se rechaza para que pueda corregirlo.',
    onConfirm,
    onClose,
    isSubmitting,
}) => {
    const [motivo, setMotivo] = useState('');

    const handleConfirmar = () => {
        if (!motivo.trim()) return;
        onConfirm(motivo.trim());
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-scout-bg-card w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-scout-border animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1.5 rounded-full text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-1">
                    <XCircle size={16} className="text-scout-accent" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-scout-ink">{heading}</h2>
                </div>
                <p className="text-xs text-scout-muted font-medium mb-5">
                    "{titulo}" — {mensaje}
                </p>

                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                    Motivo del rechazo
                </label>
                <textarea
                    autoFocus
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    rows={4}
                    placeholder="Ej: Falta el objetivo de la actividad 3 en los anexos..."
                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                />

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmar}
                        disabled={!motivo.trim() || isSubmitting}
                        className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-accent text-white hover:bg-scout-accent/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                    >
                        {isSubmitting ? 'Rechazando...' : 'Confirmar rechazo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RechazarProgramaModal;

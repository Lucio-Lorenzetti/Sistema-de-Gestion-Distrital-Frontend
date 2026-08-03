// src/pages/Dashboard/Panels/Programas/ProgramaDetalleModal.jsx
import React from 'react';
import { X, Layers, Users } from 'lucide-react';
import ProgramEstadoBadge from './ProgramEstadoBadge';

const ProgramaDetalleModal = ({ programa, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-scout-bg-card w-full max-w-3xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                <X size={20} />
            </button>
            <div className="p-8 md:p-16 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                    <ProgramEstadoBadge estado={programa.estado} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                        <Layers size={11} /> {programa.rama?.nombre || '—'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                        <Users size={11} /> {programa.grupo?.nombre || '—'}
                    </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-primary text-left">
                    {programa.titulo}
                </h2>
                {programa.diagnostico && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Diagnóstico</h3>
                        <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programa.diagnostico}</p>
                    </div>
                )}
                {programa.objetivos && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Objetivos</h3>
                        <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programa.objetivos}</p>
                    </div>
                )}
                <p className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                    Autor: <span className="text-scout-primary">{programa.owner?.name || 'Sin asignar'}</span>
                </p>
            </div>
        </div>
    </div>
);

export default ProgramaDetalleModal;
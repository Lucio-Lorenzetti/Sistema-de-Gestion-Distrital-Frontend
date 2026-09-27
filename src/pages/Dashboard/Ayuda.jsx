// src/pages/Dashboard/Ayuda.jsx
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import AyudaAcordeon from './Panels/Ayuda/AyudaAcordeon';

const Ayuda = () => {
    const user = useAuthStore((state) => state.user);
    const roleNames = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Guía de uso del sistema
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                    <HelpCircle size={20} /> Ayuda
                </h1>
            </div>

            <div className="mt-8 overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
                <AyudaAcordeon roleNames={roleNames} />
            </div>
        </div>
    );
};

export default Ayuda;

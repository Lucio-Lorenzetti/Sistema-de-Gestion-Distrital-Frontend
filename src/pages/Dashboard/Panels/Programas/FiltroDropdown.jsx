// src/pages/Dashboard/Panels/Programas/FiltroDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const FiltroDropdown = ({ options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const current = options.find((o) => o.key === value)?.label ?? '';

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
            >
                {current}
                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[160px] max-h-64 overflow-y-auto">
                    {options.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => { onChange(opt.key); setOpen(false); }}
                            className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${value === opt.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FiltroDropdown;
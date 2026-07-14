// src/components/ui/FiltroDropdown.jsx
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

const FiltroDropdown = ({ value, onChange, opciones }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setOpen(false));

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
            >
                {opciones.find((f) => f.key === value)?.label}
                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                    {opciones.map((filtro) => (
                        <button
                            key={filtro.key}
                            onClick={() => { onChange(filtro.key); setOpen(false); }}
                            className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${value === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'
                                }`}
                        >
                            {filtro.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FiltroDropdown;
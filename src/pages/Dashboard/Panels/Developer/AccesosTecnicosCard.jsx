// src/pages/Dashboard/Panels/Developer/AccesosTecnicosCard.jsx
import { ChevronRight } from 'lucide-react';

// "Backend" y "Frontend" no nombran al proveedor a propósito: si algún día cambia
// el hosting, solo hay que cambiar la URL de estas dos variables de entorno
// (VITE_PANEL_BACKEND_URL y VITE_PANEL_FRONTEND_URL, en el entorno del frontend).
// Mientras no estén definidas, apuntan a los paneles de los proveedores actuales.
const ACCESOS = [
    { label: 'Backend', href: import.meta.env.VITE_PANEL_BACKEND_URL || 'https://dashboard.render.com' },
    { label: 'Frontend', href: import.meta.env.VITE_PANEL_FRONTEND_URL || 'https://vercel.com/dashboard' },
    { label: 'Supabase (base y archivos)', href: 'https://supabase.com/dashboard' },
    { label: 'cron-job.org', href: 'https://console.cron-job.org' },
    { label: 'Brevo (correo)', href: 'https://app.brevo.com' },
    { label: 'Google AI Studio (Gemini)', href: 'https://aistudio.google.com' },
];

const AccesosTecnicosCard = () => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col gap-5 h-full">
        <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Accesos Técnicos</h2>
        <div className="h-px bg-scout-border" />
        <div className="space-y-2 w-full">
            {ACCESOS.map(({ label, href }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-scout-bg-panel border border-scout-border hover:bg-scout-primary hover:text-white text-scout-primary transition-all px-5 py-3 rounded-xl flex items-center justify-between group"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
            ))}
        </div>
    </div>
);

export default AccesosTecnicosCard;

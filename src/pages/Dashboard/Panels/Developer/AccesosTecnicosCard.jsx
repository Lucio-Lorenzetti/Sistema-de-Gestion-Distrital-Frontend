// src/pages/Dashboard/Panels/Developer/AccesosTecnicosCard.jsx
import { ChevronRight } from 'lucide-react';

const ACCESOS = [
    { label: 'Sitio público', href: 'https://distrito3zona13.vercel.app' },
    { label: 'Render (API)', href: 'https://dashboard.render.com' },
    { label: 'Vercel (frontend)', href: 'https://vercel.com/dashboard' },
    { label: 'Supabase (base y archivos)', href: 'https://supabase.com/dashboard' },
    { label: 'GitHub · Frontend', href: 'https://github.com/Lucio-Lorenzetti/Sistema-de-Gestion-Distrital-Frontend' },
    { label: 'GitHub · Backend', href: 'https://github.com/Lucio-Lorenzetti/Sistema-de-Gestion-Distrital-Backend' },
    { label: 'cron-job.org', href: 'https://console.cron-job.org' },
    { label: 'Brevo (correo)', href: 'https://app.brevo.com' },
    { label: 'Google AI Studio (Gemini)', href: 'https://aistudio.google.com' },
    { label: 'Postman', href: 'https://web.postman.co' },
];

const AccesosTecnicosCard = () => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col gap-5">
        <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Accesos Técnicos</h2>
        <div className="h-px bg-scout-border" />
        <div className="space-y-2 w-full">
            {ACCESOS.map(({ label, href }) => (
                <a
                    key={href}
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

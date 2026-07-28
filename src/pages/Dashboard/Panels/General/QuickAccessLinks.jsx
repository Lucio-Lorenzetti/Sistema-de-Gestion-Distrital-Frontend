// src/pages/Dashboard/panels/general/QuickAccessLinks.jsx
import { ChevronRight } from 'lucide-react';
import QuickLink from '../../../../components/ui/QuickLink';

const QuickAccessLinks = () => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[310px]">
        <div className="space-y-4 w-full">
            <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Acceso Rápido</h2>
            <div className="h-px bg-scout-border" />
            <p className="text-xs text-scout-muted text-left leading-relaxed">
                Módulos directos de consulta protegidos por tus credenciales de acceso institucional.
            </p>
        </div>
        <div className="space-y-2 w-full mt-4">
            {/*
              ⚠️ TODO: reemplazar "/gestion-documentos" por la URL real del Drive Distrital
              cuando la consigas. Si es un link externo (no una ruta interna), cambiar
              <QuickLink to="..."> por un <a href="..." target="_blank" rel="noopener noreferrer">
              con las mismas clases, igual que se hizo abajo con "Cruz del Sur".
            */}
            <QuickLink to="/gestion-documentos" label="Revisar Drive Distrital" />

            <a
                href="https://www.cruz-del-sur.org.ar/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-scout-bg-panel border border-scout-border hover:bg-scout-primary hover:text-white text-scout-primary transition-all px-5 py-3.5 rounded-xl flex items-center justify-between group"
            >
                <span className="text-[10px] font-black uppercase tracking-widest">Cruz del Sur</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
    </div>
);

export default QuickAccessLinks;
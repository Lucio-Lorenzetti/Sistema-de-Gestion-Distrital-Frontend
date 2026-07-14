// src/pages/Dashboard/panels/general/QuickAccessLinks.jsx
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
            <QuickLink to="/gestion-documentos" label="Revisar Drive Distrital" />
            <QuickLink to="/gestion-cursos" label="Calendario de Cursos" />
        </div>
    </div>
);

export default QuickAccessLinks;
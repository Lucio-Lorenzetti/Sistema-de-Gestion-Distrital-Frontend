// src/pages/Dashboard/Resumen/EducadorResumenCard.jsx
import { UserCircle2, Layers, Users as UsersIcon } from 'lucide-react';
import { useUserRole } from '../../../hooks/useUserRole';
import { useProgramas } from '../Panels/Programas/useProgramas';

// OJO: asumo que useUserRole() devuelve user.rama.nombre y user.grupo.nombre
// (relaciones cargadas). Si el objeto user solo trae id/name/email planos,
// avisame y lo ajusto para pedir esos datos de otra forma.
const EducadorResumenCard = () => {
    const { user } = useUserRole();
    const { programas, isLoading } = useProgramas();

    const misProgramas = programas.filter((p) => Number(p.owner?.id) === Number(user?.id));
    const misBorradores = misProgramas.filter((p) => p.estado === 'borrador').length;
    const misEnRevision = misProgramas.filter((p) => p.estado === 'enviado').length;
    const misPublicados = misProgramas.filter((p) => p.estado === 'aprobado').length;

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-primary">
                    <UserCircle2 size={22} />
                </div>
                <div>
                    <p className="text-sm font-black text-scout-ink uppercase tracking-tight">{user?.name}</p>
                    <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest flex items-center gap-3">
                        <span className="flex items-center gap-1"><Layers size={11} /> {user?.rama?.nombre || '—'}</span>
                        <span className="flex items-center gap-1"><UsersIcon size={11} /> {user?.grupo?.nombre || '—'}</span>
                    </p>
                </div>
            </div>

            <div className="h-px bg-scout-border mb-6" />

            <p className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-4">Mis Programas</p>
            {isLoading ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
            ) : misProgramas.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">Todavía no subiste ningún programa.</p>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <p className="text-2xl font-black text-scout-ink">{misBorradores}</p>
                        <p className="text-[9px] font-bold text-scout-muted uppercase tracking-widest">Borrador</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-scout-ink">{misEnRevision}</p>
                        <p className="text-[9px] font-bold text-scout-muted uppercase tracking-widest">Revisión</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-scout-ink">{misPublicados}</p>
                        <p className="text-[9px] font-bold text-scout-muted uppercase tracking-widest">Publicados</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducadorResumenCard;
// src/pages/Dashboard/Resumen/ProgramasAprobacionResumen.jsx
import React from 'react';
import { CheckCircle2, Hourglass } from 'lucide-react';
import { useProgramas } from '../Panels/Programas/useProgramas';
import ProgramasMiniTable from '../Panels/Programas/ProgramasMiniTable';

/**
 * Usado tanto por Aux Prog General como por cada Aux de Rama — el backend ya
 * scopea /programas según el rol (General ve todo, cada Aux de Rama solo la suya),
 * así que este componente no necesita saber cuál de los dos es ni chequear rol.
 */
const ProgramasAprobacionResumen = () => {
    const { programas, isLoading } = useProgramas();

    const aprobadosRecientes = [...programas]
        .filter((p) => p.estado === 'aprobado')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 5);

    const proximosAAprobar = [...programas]
        .filter((p) => p.estado === 'enviado')
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, 5);

    if (isLoading) {
        return (
            <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando programas...</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgramasMiniTable
                titulo="Programas Aprobados Recientemente"
                icon={<CheckCircle2 size={16} />}
                programas={aprobadosRecientes}
                emptyText="Todavía no hay programas publicados"
            />
            <ProgramasMiniTable
                titulo="Próximos a Aprobar"
                icon={<Hourglass size={16} />}
                programas={proximosAAprobar}
                emptyText="No hay programas esperando revisión"
            />
        </div>
    );
};

export default ProgramasAprobacionResumen;
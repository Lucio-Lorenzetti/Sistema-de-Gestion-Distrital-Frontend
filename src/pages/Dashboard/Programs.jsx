// src/pages/Dashboard/Programs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle2, Clock, Edit3, ChevronRight, Plus } from 'lucide-react';
import MetricCard from '../../components/ui/MetricCard';
import { useUserRole } from '../../hooks/useUserRole';
import { ROLES } from './dashboard.permissions';
import { useProgramas } from './Panels/Programas/useProgramas';
import ProgramasTable from './Panels/Programas/ProgramasTable';

const Programs = () => {
    const { role } = useUserRole();
    const { programas, isLoading, refetch } = useProgramas();

    const totalPublicados = programas.filter((p) => p.estado === 'aprobado').length;
    const totalBorradores = programas.filter((p) => p.estado === 'borrador').length;
    const totalRevision = programas.filter((p) => p.estado === 'enviado').length;

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            {/* HEADER */}
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Gestión de Programas
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Programas
                </h1>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
                <MetricCard icon={<ClipboardList />} title="Total de Programas" value={`${programas.length} En Sistema`} sub="Según tu alcance de visibilidad" color="border-scout-primary" />
                <MetricCard icon={<CheckCircle2 />} title="Publicados" value={`${totalPublicados} Programas`} sub="Ya cerrados y visibles" color="border-scout-muted" />
                <MetricCard icon={<Clock />} title="En Revisión" value={`${totalRevision} Programas`} sub="Esperando feedback" color="border-scout-muted" />
                {role === ROLES.EDUCADOR ? (
                    <Link
                        to="/gestion-programas/crear"
                        className="bg-scout-primary text-white hover:bg-scout-primary-hover transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between text-left group cursor-pointer border border-scout-primary shadow-sm hover:shadow-md"
                    >
                        <div className="flex justify-between items-start w-full">
                            <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Plus size={20} className="text-white" />
                            </div>
                            <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">Acción Rápida</span>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">Nuevo Programa</h3>
                        </div>
                    </Link>
                ) : (
                    <MetricCard icon={<Edit3 />} title="Borradores" value={`${totalBorradores} Programas`} sub="En armado colaborativo" color="border-scout-muted" />
                )}
            </div>

            {/* TABLA */}
            <div className="grid grid-cols-1 gap-8 mt-10" style={{ flex: 1, minHeight: 0 }}>
                <ProgramasTable programas={programas} isLoading={isLoading} onEstadoActualizado={refetch} />
            </div>
        </div>
    );
};

export default Programs;
// src/pages/Dashboard/panels/general/GeneralPanel.jsx
import ActivityItem from '../../../../components/ui/ActivityItem';
import Pagination from '../../../../components/ui/Pagination';
import GeneralMetrics from './GeneralMetrics';
import QuickAccessLinks from './QuickAccessLinks';
import ProgramasTable from '../../Panels/Programas/ProgramasTable';
import { useProgramas } from '../../Panels/Programas/useProgramas';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';
import { useActividadReciente } from '../../../../hooks/useActividadReciente';

const GeneralPanel = () => {
    const { actividades, isLoading } = useActividadReciente();
    const { programas, isLoading: isLoadingProgramas } = useProgramas();

    const { current, page, setPage, totalPages } = usePaginatedFilter(actividades, {
        defaultFilter: 'Todos', // no filtra por estado, solo pagina
    });

    return (
        <>
            <GeneralMetrics />

            <div className="lg:col-span-2 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 flex flex-col justify-between shadow-sm min-h-[310px]">
                <div className="space-y-6 w-full">
                    <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Actividad del Sistema</h2>
                    <div className="h-px bg-scout-border" />

                    {isLoading ? (
                        <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse py-4">
                            Cargando actividad...
                        </p>
                    ) : current.length === 0 ? (
                        <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4">
                            Todavía no hay actividad registrada.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {current.map((act) => (
                                <ActivityItem key={act.id} title={act.titulo} desc={act.desc} time={act.time} />
                            ))}
                        </div>
                    )}
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} size="lg" />
            </div>

            <QuickAccessLinks />

            {/* Misma tabla completa (filtros de Grupo/Rama/Estado + paginación) que usa
                Aux Programa/Educador en /gestion-programas — pedido explícito para Director. */}
            <div className="lg:col-span-3">
                <ProgramasTable programas={programas} isLoading={isLoadingProgramas} />
            </div>
        </>
    );
};

export default GeneralPanel;
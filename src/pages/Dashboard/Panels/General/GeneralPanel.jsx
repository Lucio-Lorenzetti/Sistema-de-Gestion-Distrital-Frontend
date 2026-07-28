// src/pages/Dashboard/panels/general/GeneralPanel.jsx
import { FileText } from 'lucide-react';
import ActivityItem from '../../../../components/ui/ActivityItem';
import Pagination from '../../../../components/ui/Pagination';
import GeneralMetrics from './GeneralMetrics';
import QuickAccessLinks from './QuickAccessLinks';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';
import { useActividadReciente } from '../../../../hooks/useActividadReciente';

const GeneralPanel = () => {
    const { actividades, isLoading } = useActividadReciente();

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

            {/*
              ⚠️ PLACEHOLDER — Tabla de Programas Recientes.
              Reservado para cuando se rehaga el módulo de Programas desde cero.
              Va a tener el mismo patrón visual que la tabla de Aux. Programa
              (filtro por estado con dropdown + paginación), pero mostrando
              TODOS los programas del distrito en vez de filtrar por rama/usuario.

              Reemplazar este bloque completo por algo como:
              <TablaProgramasGeneral programas={programas} ... />
              cuando el back de Programas esté listo.
            */}
            <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col items-center justify-center gap-3 min-h-[220px]">
                <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted">
                    <FileText size={20} />
                </div>
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight text-center">
                    Tabla de Programas Recientes — pendiente de conectar
                </p>
            </div>
        </>
    );
};

export default GeneralPanel;
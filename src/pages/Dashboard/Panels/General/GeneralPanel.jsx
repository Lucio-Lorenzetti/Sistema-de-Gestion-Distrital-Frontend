// src/pages/Dashboard/panels/general/GeneralPanel.jsx
import ActivityItem from '../../../../components/ui/ActivityItem';
import Pagination from '../../../../components/ui/Pagination';
import GeneralMetrics from './GeneralMetrics';
import QuickAccessLinks from './QuickAccessLinks';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';
import { ACTIVIDADES_RECIENTES_MOCK } from '../../../../data/general.mocks';

const GeneralPanel = () => {
    const { current, page, setPage, totalPages } = usePaginatedFilter(ACTIVIDADES_RECIENTES_MOCK, {
        defaultFilter: 'Todos', // no filtra por estado, solo pagina
    });

    return (
        <>
            <GeneralMetrics />

            <div className="lg:col-span-2 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 flex flex-col justify-between shadow-sm min-h-[310px]">
                <div className="space-y-6 w-full">
                    <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Actividad del Sistema</h2>
                    <div className="h-px bg-scout-border" />
                    <div className="space-y-5">
                        {current.map((act) => (
                            <ActivityItem key={act.id} title={act.titulo} desc={act.desc} time={act.time} />
                        ))}
                    </div>
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} size="lg" />
            </div>

            <QuickAccessLinks />
        </>
    );
};

export default GeneralPanel;
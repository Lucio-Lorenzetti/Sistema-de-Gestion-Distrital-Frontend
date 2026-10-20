// src/pages/Dashboard/Panels/General/ActividadSistemaCard.jsx
import ActivityItem from '../../../../components/ui/ActivityItem';
import Pagination from '../../../../components/ui/Pagination';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';
import { useActividadReciente } from '../../../../hooks/useActividadReciente';

// Feed del registro de actividad. Lo usan el panel del Director y el del Developer.
// `itemsPerPage` deja que cada panel ajuste cuántas entradas muestra por página
// según la altura que le toca (el del Developer la comparte con "Accesos técnicos").
const ActividadSistemaCard = ({ itemsPerPage = 3 }) => {
    const { actividades, isLoading } = useActividadReciente();

    const { current, page, setPage, totalPages } = usePaginatedFilter(actividades, {
        itemsPerPage,
        defaultFilter: 'Todos', // no filtra por estado, solo pagina
    });

    return (
        <div className="lg:col-span-2 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 flex flex-col justify-between shadow-sm min-h-[310px] h-full">
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
    );
};

export default ActividadSistemaCard;

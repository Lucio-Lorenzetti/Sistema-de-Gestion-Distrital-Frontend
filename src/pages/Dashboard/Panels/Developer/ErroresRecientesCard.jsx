// src/pages/Dashboard/Panels/Developer/ErroresRecientesCard.jsx
import Pagination from '../../../../components/ui/Pagination';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';
import { tiempoRelativo } from '../../../../utils/tiempo';

const ESTILO_NIVEL = {
    warning: 'bg-amber-500/15 text-amber-600',
};
const ESTILO_NIVEL_GRAVE = 'bg-scout-accent-light text-scout-accent';

const ErroresRecientesCard = ({ errores = [], isLoading }) => {
    const { current, page, setPage, totalPages } = usePaginatedFilter(errores, {
        itemsPerPage: 4,
        defaultFilter: 'Todos',
    });

    return (
        <div className="lg:col-span-2 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 flex flex-col justify-between shadow-sm min-h-[310px]">
            <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Errores Recientes</h2>
                    <p className="text-[10px] text-scout-muted font-medium mt-1">
                        Advertencias y errores del backend (mails que no salieron, fallos de la IA, excepciones). Se guardan los últimos 25.
                    </p>
                </div>
                <div className="h-px bg-scout-border" />

                {isLoading ? (
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse py-4">Cargando...</p>
                ) : current.length === 0 ? (
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4">Sin errores recientes.</p>
                ) : (
                    <div className="space-y-4">
                        {current.map((e, i) => (
                            <div key={`${e.fecha}-${i}`} className="flex justify-between items-start gap-4 text-xs">
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${ESTILO_NIVEL[e.nivel] ?? ESTILO_NIVEL_GRAVE}`}>
                                            {e.nivel}
                                        </span>
                                        {e.origen && <span className="text-[10px] text-scout-muted font-bold truncate">{e.origen}</span>}
                                    </div>
                                    <p className="text-scout-ink leading-snug break-words">{e.mensaje}</p>
                                </div>
                                <span className="text-[9px] font-black uppercase text-scout-muted tracking-wider whitespace-nowrap pt-0.5">
                                    {tiempoRelativo(e.fecha)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} size="lg" />
        </div>
    );
};

export default ErroresRecientesCard;

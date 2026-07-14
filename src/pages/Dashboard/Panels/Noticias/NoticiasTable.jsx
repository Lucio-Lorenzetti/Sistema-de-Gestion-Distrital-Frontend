// src/pages/Dashboard/panels/noticias/NoticiasTable.jsx
import { Link } from 'react-router-dom';
import { Clock, Send, Edit3, Eye, Trash2, Newspaper } from 'lucide-react';
import FiltroDropdown from '../../../../components/ui/FiltroDropdown';
import EmptyState from '../../../../components/ui/EmptyState';
import EstadoBadge from '../../../../components/ui/EstadoBadge';
import Pagination from '../../../../components/ui/Pagination';

const FILTROS_NOTICIAS = [
    { key: 'Todas', label: 'Todas' },
    { key: 'Publicada', label: 'Publicadas' },
    { key: 'Borrador', label: 'Borradores' },
    { key: 'Programada', label: 'Programadas' },
];

const NoticiasTable = ({
    noticias, filtro, onFiltroChange, page, totalPages, onPageChange,
    onVer, onPublicar, onEliminar,
}) => (
    <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col">
        <div className="flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Noticias Recientes</h2>
            <FiltroDropdown value={filtro} onChange={onFiltroChange} opciones={FILTROS_NOTICIAS} />
        </div>
        <div className="h-px bg-scout-border shrink-0 mt-5" />

        {noticias.length === 0 ? (
            <EmptyState icon={<Newspaper size={20} />} message="No hay noticias con ese estado" />
        ) : (
            <div className="overflow-x-auto mt-6 flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                            <th className="pb-3 font-black">Título</th>
                            <th className="pb-3 font-black">Estado</th>
                            <th className="pb-3 font-black">Autor</th>
                            <th className="pb-3 font-black">Fecha</th>
                            <th className="pb-3 font-black text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-scout-border">
                        {noticias.map((noticia) => (
                            <tr key={noticia.id} className="group hover:bg-scout-bg-panel transition-colors">
                                <td className="py-4 pr-4">
                                    <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{noticia.titulo}</p>
                                </td>
                                <td className="py-4 pr-4"><EstadoBadge estado={noticia.estado} /></td>
                                <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{noticia.autor || 'Sin asignar'}</td>
                                <td className="py-4 pr-4">
                                    <span className="text-[9px] text-scout-muted flex items-center gap-1 whitespace-nowrap"><Clock size={11} /> {noticia.fecha}</span>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {noticia.estado === 'Borrador' && (
                                            <button
                                                onClick={() => onPublicar(noticia.id)}
                                                className="p-1.5 rounded-lg border border-scout-border hover:bg-green-50 text-scout-muted hover:text-scout-success transition-colors cursor-pointer"
                                                title="Publicar ahora"
                                            >
                                                <Send size={13} />
                                            </button>
                                        )}
                                        <Link
                                            to={`/noticias-internas/editar/${noticia.id}`}
                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <Edit3 size={13} />
                                        </Link>
                                        <button
                                            onClick={() => onVer(noticia.id)}
                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                            title="Ver"
                                        >
                                            <Eye size={13} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('¿Estás seguro de eliminar esta noticia?')) onEliminar(noticia.id);
                                            }}
                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-red-50 text-scout-muted hover:text-scout-accent transition-colors cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
);

export default NoticiasTable;
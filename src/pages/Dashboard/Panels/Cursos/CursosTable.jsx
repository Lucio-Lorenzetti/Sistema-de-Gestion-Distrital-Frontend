// src/pages/Dashboard/panels/cursos/CursosTable.jsx
import { BookOpen, Clock, Eye, Users as UsersIcon } from 'lucide-react';
import EmptyState from '../../../../components/ui/EmptyState';
import EstadoBadge from '../../../../components/ui/EstadoBadge';
import Pagination from '../../../../components/ui/Pagination';
import FiltroDropdown from '../../../../components/ui/FiltroDropdown';

const FILTROS_CURSOS = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Abierto', label: 'Abiertos' },
    { key: 'Cerrado', label: 'Cerrados' },
];

const CursosTable = ({ cursos, filtro, onFiltroChange, page, totalPages, onPageChange, onVer }) => (
    <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col">
        <div className="flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Cursos Recientes</h2>
            <FiltroDropdown value={filtro} onChange={onFiltroChange} opciones={FILTROS_CURSOS} />
        </div>
        <div className="h-px bg-scout-border shrink-0 mt-5" />

        {cursos.length === 0 ? (
            <EmptyState icon={<BookOpen size={20} />} message="No hay cursos con ese estado" />
        ) : (
            <div className="overflow-x-auto mt-6 flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                            <th className="pb-3 font-black">Curso</th>
                            <th className="pb-3 font-black text-center">Modalidad</th>
                            <th className="pb-3 font-black text-center">Inicio</th>
                            <th className="pb-3 font-black text-center">Inscriptos</th>
                            <th className="pb-3 font-black text-center">Estado</th>
                            <th className="pb-3 font-black text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-scout-border">
                        {cursos.map((curso) => (
                            <tr key={curso.id} className="group hover:bg-scout-bg-panel transition-colors">
                                <td className="py-4 pr-3">
                                    <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{curso.titulo}</p>
                                </td>
                                <td className="py-4 text-xs font-bold uppercase tracking-wider text-scout-muted text-center">{curso.modalidad}</td>
                                <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">
                                    <span className="flex items-center justify-center gap-1"><Clock size={11} /> {curso.fechaInicio}</span>
                                </td>
                                <td className="py-4 text-xs text-scout-muted text-center">
                                    <span className="flex items-center justify-center gap-1"><UsersIcon size={11} /> {curso.inscriptos}</span>
                                </td>
                                <td className="py-4 text-center"><EstadoBadge estado={curso.estado} /></td>
                                <td className="py-4 text-center">
                                    <button
                                        onClick={() => onVer(curso.id)}
                                        className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                        title="Ver"
                                    >
                                        <Eye size={13} />
                                    </button>
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

export default CursosTable;
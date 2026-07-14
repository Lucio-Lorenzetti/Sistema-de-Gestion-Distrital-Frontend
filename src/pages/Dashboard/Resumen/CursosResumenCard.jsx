// src/pages/Dashboard/Resumen/CursosResumenCard.jsx
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronRight, Clock } from 'lucide-react';
import EstadoBadge from '../../../components/ui/EstadoBadge';
import { useCursos } from '../Panels/Cursos/useCursos';

const CursosResumenCard = () => {
    const { cursos } = useCursos();
    const ultimos = [...cursos].slice(0, 4);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                    <GraduationCap size={16} /> Cursos
                </h2>
                <Link to="/gestion-cursos" className="text-scout-muted hover:text-scout-primary transition-colors">
                    <ChevronRight size={16} />
                </Link>
            </div>
            <div className="h-px bg-scout-border shrink-0 my-4" />

            {ultimos.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">Sin cursos aún</p>
            ) : (
                <div className="space-y-4 flex-1">
                    {ultimos.map((c) => (
                        <div key={c.id} className="space-y-1">
                            <p className="text-xs font-bold text-scout-primary line-clamp-1">{c.titulo}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-scout-muted flex items-center gap-1"><Clock size={10} /> {c.fechaInicio}</span>
                                <EstadoBadge estado={c.estado} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link
                to="/gestion-cursos"
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors flex items-center gap-1"
            >
                Ver todos <ChevronRight size={12} />
            </Link>
        </div>
    );
};

export default CursosResumenCard;
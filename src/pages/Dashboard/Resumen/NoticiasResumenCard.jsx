// src/pages/Dashboard/Resumen/NoticiasResumenCard.jsx
import { Link } from 'react-router-dom';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';
import EstadoBadge from '../../../components/ui/EstadoBadge';
import { useNoticias } from '../Panels/Noticias/useNoticias';

const NoticiasResumenCard = () => {
    const { noticias } = useNoticias();
    const ultimas = [...noticias]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 6);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                    <Newspaper size={16} /> Noticias
                </h2>
                <Link to="/noticias-internas" className="text-scout-muted hover:text-scout-primary transition-colors">
                    <ChevronRight size={16} />
                </Link>
            </div>
            <div className="h-px bg-scout-border shrink-0 my-4" />

            {ultimas.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">Sin noticias aún</p>
            ) : (
                <div className="space-y-4 flex-1">
                    {ultimas.map((n) => (
                        <div key={n.id} className="space-y-1">
                            <p className="text-xs font-bold text-scout-primary line-clamp-1">{n.titulo}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-scout-muted flex items-center gap-1"><Clock size={10} /> {n.fecha}</span>
                                <EstadoBadge estado={n.estado} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link
                to="/noticias-internas"
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors flex items-center gap-1"
            >
                Ver todas <ChevronRight size={12} />
            </Link>
        </div>
    );
};

export default NoticiasResumenCard;
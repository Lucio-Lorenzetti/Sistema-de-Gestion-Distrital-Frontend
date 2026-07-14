// src/pages/Dashboard/panels/noticias/NoticiasMetrics.jsx
import { Newspaper, Edit3, Calendar, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '../../../../components/ui/MetricCard';

const NoticiasMetrics = ({ noticias }) => {
    const publicadas = noticias.filter((n) => n.estado === 'Publicada').length;
    const borradores = noticias.filter((n) => n.estado === 'Borrador').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
            <MetricCard icon={<Newspaper />} title="Noticias Publicadas" value={`${publicadas} Artículos`} sub="Visibles en Home" color="border-scout-primary" />
            <MetricCard icon={<Edit3 />} title="Noticias en Borrador" value={`${borradores} Guardadas`} sub="Pendientes de revisión" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Total de Noticias" value={`${noticias.length} En Sistema`} sub="Todas las categorías" color="border-scout-muted" />
            <Link
                to="/noticias-internas/crear"
                className="bg-scout-primary text-white hover:bg-scout-primary-hover transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between text-left group cursor-pointer border border-scout-primary h-30 shadow-sm hover:shadow-md"
            >
                <div className="flex justify-between items-start w-full">
                    <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                        <Plus size={20} className="text-white" />
                    </div>
                    <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">Acción Rápida</span>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">Nueva Noticia</h3>
                </div>
            </Link>
        </div>
    );
};

export default NoticiasMetrics;
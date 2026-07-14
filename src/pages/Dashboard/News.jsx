// src/pages/Dashboard/News.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Newspaper, Edit3, Plus, ChevronRight, ChevronDown, ChevronLeft,
    Eye, Trash2, Send, Clock, X
} from 'lucide-react';
import { useAuthorizedFetch } from '../../hooks/useAuthorizedFetch';
import MetricCard from '../../components/ui/MetricCard';
import EstadoBadge from '../../components/ui/EstadoBadge';
import imgDefault from '../../assets/noticia-default.jpg';

const NOTICIAS_ENDPOINT = '/api/news';
const ITEMS_PER_PAGE = 3;

const FILTROS_ESTADO = [
    { key: 'Todas', label: 'Todas' },
    { key: 'Publicada', label: 'Publicadas' },
    { key: 'Borrador', label: 'Borradores' },
    { key: 'Programada', label: 'Programadas' },
];

const News = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtroEstado, setFiltroEstado] = useState('Todas');
    const [filtroOpen, setFiltroOpen] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const filtroRef = useRef(null);

    useEffect(() => {
        authorizedFetch(NOTICIAS_ENDPOINT)
            .then(setNoticias)
            .catch((err) => console.error('Error al cargar noticias:', err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filtroRef.current && !filtroRef.current.contains(e.target)) setFiltroOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEliminar = (id) => {
        authorizedFetch(`${NOTICIAS_ENDPOINT}/${id}`, { method: 'DELETE' })
            .then(() => setNoticias((prev) => prev.filter((n) => n.id !== id)))
            .catch((err) => console.error('Error al eliminar noticia:', err));
    };

    const handlePublicarRapido = (id) => {
        authorizedFetch(`${NOTICIAS_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ estado: 'Publicada', publicado_at: new Date().toISOString() }),
        })
            .then(() => setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, estado: 'Publicada' } : n))))
            .catch((err) => console.error('Error al publicar rápidamente:', err));
    };

    const noticiasFiltradas = filtroEstado === 'Todas'
        ? noticias
        : noticias.filter((n) => n.estado === filtroEstado);

    const totalPages = Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE) || 1;
    const noticiasPagina = noticiasFiltradas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleFiltroChange = (key) => { setFiltroEstado(key); setCurrentPage(1); setFiltroOpen(false); };

    const totalPublicadas = noticias.filter((n) => n.estado === 'Publicada').length;
    const totalBorradores = noticias.filter((n) => n.estado === 'Borrador').length;

    const noticiaExpandida = noticias.find((n) => n.id === expandedId);

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            {/* HEADER */}
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Gestión de Noticias
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Noticias
                </h1>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
                <MetricCard icon={<Newspaper />} title="Noticias Publicadas" value={`${totalPublicadas} Artículos`} sub="Visibles en Home" color="border-scout-primary" />
                <MetricCard icon={<Edit3 />} title="Noticias en Borrador" value={`${totalBorradores} Guardadas`} sub="Pendientes de revisión" color="border-scout-muted" />
                <MetricCard icon={<Newspaper />} title="Total de Noticias" value={`${noticias.length} En Sistema`} sub="Todas las categorías" color="border-scout-muted" />
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

            {/* TABLA */}
            <div className="grid grid-cols-1 gap-8 mt-10" style={{ flex: 1, minHeight: 0 }}>
                <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
                    <div className="flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Noticias Publicadas</h2>
                        <div className="relative" ref={filtroRef}>
                            <button
                                onClick={() => setFiltroOpen((prev) => !prev)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
                            >
                                {FILTROS_ESTADO.find((f) => f.key === filtroEstado)?.label}
                                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${filtroOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {filtroOpen && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                                    {FILTROS_ESTADO.map((filtro) => (
                                        <button
                                            key={filtro.key}
                                            onClick={() => handleFiltroChange(filtro.key)}
                                            className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${filtroEstado === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
                                        >
                                            {filtro.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-px bg-scout-border shrink-0 mt-5" />

                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center py-8">
                            <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando noticias...</p>
                        </div>
                    ) : noticiasPagina.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                            <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><Newspaper size={20} /></div>
                            <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay noticias con ese estado</p>
                        </div>
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
                                    {noticiasPagina.map((noticia) => (
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
                                                        <button onClick={() => handlePublicarRapido(noticia.id)} className="p-1.5 rounded-lg border border-scout-border hover:bg-green-50 text-scout-muted hover:text-scout-success transition-colors cursor-pointer" title="Publicar ahora">
                                                            <Send size={13} />
                                                        </button>
                                                    )}
                                                    <Link to={`/noticias-internas/editar/${noticia.id}`} className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Editar">
                                                        <Edit3 size={13} />
                                                    </Link>
                                                    <button onClick={() => setExpandedId(noticia.id)} className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Ver">
                                                        <Eye size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (window.confirm('¿Estás seguro de eliminar esta noticia?')) handleEliminar(noticia.id); }}
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

                    {noticiasFiltradas.length > ITEMS_PER_PAGE && (
                        <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
                            <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentPage} / {totalPages}</span>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {noticiaExpandida && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                    <div className="relative bg-scout-bg-card w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                        <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                            <X size={20} />
                        </button>
                        <div className="md:w-1/2 h-64 md:h-auto bg-scout-bg-panel">
                            <img src={noticiaExpandida.imagen || imgDefault} className="w-full h-full object-cover" alt={noticiaExpandida.titulo} />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-scout-muted block mb-4 text-left">
                                {noticiaExpandida.categoria || 'General'} • {noticiaExpandida.fecha}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-primary text-left">
                                {noticiaExpandida.titulo}
                            </h2>
                            {noticiaExpandida.copete && (
                                <p className="text-lg font-bold text-scout-primary border-l-4 border-scout-primary pl-4 mb-6 leading-snug text-left">
                                    {noticiaExpandida.copete}
                                </p>
                            )}
                            <div className="text-scout-muted leading-relaxed text-sm md:text-base text-left whitespace-pre-line">
                                {noticiaExpandida.contenido}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;
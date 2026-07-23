import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, FileText, LinkIcon, Plus, ChevronRight, ChevronDown, ChevronLeft,
    Eye, Trash2, Download as DownloadIcon, Clock, X, ExternalLink
} from 'lucide-react';
import { useAuthorizedFetch } from '../../hooks/useAuthorizedFetch';
import MetricCard from '../../components/ui/MetricCard';

const BIBLIOGRAFIA_ENDPOINT = '/bibliografia';
const ITEMS_PER_PAGE = 5;

const FILTROS_TIPO = [
    { key: 'Todos', label: 'Todos' },
    { key: 'archivo', label: 'Archivos' },
    { key: 'link', label: 'Links' },
];

const TipoBadge = ({ tipo }) => {
    const isArchivo = tipo === 'archivo';
    return (
        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isArchivo ? 'bg-scout-primary/10 text-scout-primary' : 'bg-scout-muted/10 text-scout-muted'
            }`}>
            {isArchivo ? <FileText size={10} /> : <LinkIcon size={10} />}
            {isArchivo ? 'Archivo' : 'Link'}
        </span>
    );
};

const Bibliografia = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtroTipo, setFiltroTipo] = useState('Todos');
    const [filtroOpen, setFiltroOpen] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const filtroRef = useRef(null);

    useEffect(() => {
        authorizedFetch(BIBLIOGRAFIA_ENDPOINT)
            .then(setItems)
            .catch((err) => console.error('Error al cargar bibliografía:', err))
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
        authorizedFetch(`${BIBLIOGRAFIA_ENDPOINT}/${id}`, { method: 'DELETE' })
            .then(() => setItems((prev) => prev.filter((i) => i.id !== id)))
            .catch((err) => console.error('Error al eliminar:', err));
    };

    const itemsFiltrados = filtroTipo === 'Todos'
        ? items
        : items.filter((i) => i.tipo === filtroTipo);

    const totalPages = Math.ceil(itemsFiltrados.length / ITEMS_PER_PAGE) || 1;
    const itemsPagina = itemsFiltrados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleFiltroChange = (key) => { setFiltroTipo(key); setCurrentPage(1); setFiltroOpen(false); };

    const totalArchivos = items.filter((i) => i.tipo === 'archivo').length;
    const totalLinks = items.filter((i) => i.tipo === 'link').length;

    const itemExpandido = items.find((i) => i.id === expandedId);

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            {/* HEADER */}
            <div className="border-b border-scout-border pb-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Gestión de Bibliografía
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Bibliografía y Documentos
                </h1>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
                <MetricCard icon={<BookOpen />} title="Total de Documentos" value={`${items.length} En Sistema`} sub="Archivos y links" color="border-scout-primary" />
                <MetricCard icon={<FileText />} title="Archivos Subidos" value={`${totalArchivos} PDFs/Docs`} sub="Almacenados en servidor" color="border-scout-muted" />
                <MetricCard icon={<LinkIcon />} title="Links Externos" value={`${totalLinks} Recursos`} sub="Referencias web" color="border-scout-muted" />
                <Link
                    to="/library/crear"
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
                        <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">Agregar Bibliografía</h3>
                    </div>
                </Link>
            </div>

            {/* TABLA */}
            <div className="grid grid-cols-1 gap-8 mt-10" style={{ flex: 1, minHeight: 0 }}>
                <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
                    <div className="flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Biblioteca Disponible</h2>
                        <div className="relative" ref={filtroRef}>
                            <button
                                onClick={() => setFiltroOpen((prev) => !prev)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
                            >
                                {FILTROS_TIPO.find((f) => f.key === filtroTipo)?.label}
                                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${filtroOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {filtroOpen && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                                    {FILTROS_TIPO.map((filtro) => (
                                        <button
                                            key={filtro.key}
                                            onClick={() => handleFiltroChange(filtro.key)}
                                            className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${filtroTipo === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
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
                            <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando bibliografía...</p>
                        </div>
                    ) : itemsPagina.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                            <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><BookOpen size={20} /></div>
                            <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay documentos con ese filtro</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mt-6 flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                        <th className="pb-3 font-black">Título</th>
                                        <th className="pb-3 font-black">Tipo</th>
                                        <th className="pb-3 font-black">Subido por</th>
                                        <th className="pb-3 font-black">Fecha</th>
                                        <th className="pb-3 font-black text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scout-border">
                                    {itemsPagina.map((item) => (
                                        <tr key={item.id} className="group hover:bg-scout-bg-panel transition-colors">
                                            <td className="py-4 pr-4">
                                                <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{item.nombre}</p>
                                            </td>
                                            <td className="py-4 pr-4"><TipoBadge tipo={item.tipo} /></td>
                                            <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{item.user?.name || 'Sin asignar'}</td>
                                            <td className="py-4 pr-4">
                                                <span className="text-[9px] text-scout-muted flex items-center gap-1 whitespace-nowrap">
                                                    <Clock size={11} /> {new Date(item.created_at).toLocaleDateString('es-AR')}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {item.tipo === 'archivo' ? (
                                                        <a
                                                            href={item.url_descarga}
                                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                            title="Descargar"
                                                        >
                                                            <DownloadIcon size={13} />
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href={item.url_publica}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                            title="Abrir link"
                                                        >
                                                            <ExternalLink size={13} />
                                                        </a>
                                                    )}
                                                    <button onClick={() => setExpandedId(item.id)} className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Ver detalle">
                                                        <Eye size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (window.confirm('¿Estás seguro de eliminar este documento?')) handleEliminar(item.id); }}
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

                    {itemsFiltrados.length > ITEMS_PER_PAGE && (
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

            {/* MODAL DE DETALLE */}
            {itemExpandido && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                    <div className="relative bg-scout-bg-card w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300 text-left">
                        <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform cursor-pointer">
                            <X size={20} />
                        </button>
                        <TipoBadge tipo={itemExpandido.tipo} />
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight mt-4 mb-4 text-scout-primary">
                            {itemExpandido.nombre}
                        </h2>
                        <p className="text-scout-muted leading-relaxed text-sm md:text-base whitespace-pre-line mb-8">
                            {itemExpandido.descripcion || 'Sin descripción.'}
                        </p>

                        {itemExpandido.tipo === 'archivo' ? (
                            <a
                                href={itemExpandido.url_descarga}
                                className="inline-flex items-center gap-2 bg-scout-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-scout-primary-hover transition-colors"
                            >
                                <DownloadIcon size={14} /> Descargar Archivo
                            </a>
                        ) : (
                            <a
                                href={itemExpandido.url_publica}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-scout-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-scout-primary-hover transition-colors"
                            >
                                <ExternalLink size={14} /> Abrir Link
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bibliografia;

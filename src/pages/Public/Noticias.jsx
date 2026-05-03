import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NOTICIAS_MOCK } from '../../data/noticias';
import imgDefault from '../../assets/noticia-default.jpg';

const Noticias = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = NOTICIAS_MOCK.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / limit);
    
    const startIndex = (currentPage - 1) * limit;
    const currentNoticias = isAll ? NOTICIAS_MOCK : NOTICIAS_MOCK.slice(startIndex, startIndex + limit);

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    // Ajuste de Ingeniería: El layout fijo SOLO aplica en Escritorio (md)
    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        /* En mobile (default) siempre es min-h-screen y scroll. En desktop (md) aplicamos el h-screen si es fixed */
        <div className={`bg-neutral-50 font-sans selection:bg-black selection:text-white min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>
            
            {/* 1. HEADER */}
            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-6'} bg-white/80 backdrop-blur-md border-b border-neutral-200 flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full">
                    <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                        Noticias <span className="text-black/20 italic">Distritales</span>
                    </h1>
                </div>
            </header>

            {/* 2. MAIN */}
            <main className={`max-w-5xl mx-auto px-6 flex flex-col w-full ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>
                
                {/* TOOLBAR: Evitamos el h-[4vh] en mobile para que no se solape */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-2 ${isFixedLayout ? 'md:h-[4vh]' : ''}`}>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Página {currentPage} de {totalPages} • {totalItems} comunicados
                    </p>
                    <div className="flex items-center gap-2">
                        {/* CORRECCIÓN LÍNEA 50: 'all' entre comillas */}
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button 
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${
                                    itemsPerPage === opt ? 'bg-black text-white border-black' : 'bg-white text-neutral-400 border-neutral-200'
                                }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID: En mobile siempre 1 columna y altura automática */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentNoticias.map((noticia) => (
                        <article 
                            key={noticia.id} 
                            className={`group relative bg-white rounded-[1.5rem] overflow-hidden border border-neutral-100 transition-all duration-300 flex flex-col md:flex-row ${
                                expandedId === noticia.id 
                                ? 'fixed inset-4 md:inset-x-40 md:top-10 md:bottom-10 z-50 shadow-2xl overflow-y-auto' 
                                : `hover:shadow-lg ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto'}`
                            }`}
                        >
                            {/* IMAGEN */}
                            <div className={`relative overflow-hidden flex-shrink-0 w-full h-40 md:h-full md:w-[25%]`}>
                                <img 
                                    src={noticia.img || imgDefault} 
                                    alt={noticia.titulo} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-black/80 backdrop-blur-xl text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        {noticia.categoria}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENIDO */}
                            <div className="p-4 md:p-6 flex flex-col justify-center flex-grow overflow-hidden">
                                <span className="text-[8px] font-bold text-neutral-300 uppercase mb-1">
                                    {new Date(noticia.fecha).toLocaleDateString()}
                                </span>

                                <h2 className="font-bold tracking-tight uppercase leading-tight text-sm md:text-base mb-1 line-clamp-2">
                                    {noticia.titulo}
                                </h2>

                                <p className="text-[10px] text-neutral-500 leading-tight line-clamp-3 md:line-clamp-2">
                                    {noticia.contenido}
                                </p>

                                <div className="mt-2 pt-2 border-t border-neutral-50">
                                    <button 
                                        onClick={() => toggleExpand(noticia.id)}
                                        className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-black group-hover:gap-2 transition-all"
                                    >
                                        {expandedId === noticia.id ? 'Cerrar' : 'Ver más'} 
                                        <ArrowRight size={10} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 3. PAGINACIÓN: Solo visible si no hay scroll bloqueado o si estamos fuera de fixed */}
                {!isAll && totalPages > 1 && (
                    <footer className={`flex justify-center items-center gap-3 px-6 mt-6 md:mt-0 ${isFixedLayout ? 'md:h-[10vh]' : 'py-8'}`}>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-100 shadow-sm">
                            <span className="text-[9px] font-black uppercase text-neutral-400 mr-2">Páginas:</span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 md:w-8 md:h-8 text-[9px] md:text-[10px] font-black rounded-full border transition-all ${
                                        currentPage === page 
                                        ? 'bg-black text-white border-black shadow-lg scale-110' 
                                        : 'bg-white text-neutral-400 border-neutral-100 hover:border-black'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>

            {expandedId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setExpandedId(null)} />
            )}
        </div>
    );
};

export default Noticias;
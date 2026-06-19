import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import imgDefault from '../../assets/noticia-default.jpg';

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch('/api/news?solo_publicadas=true')
            .then(res => res.json())
            .then(data => setNoticias(data))
            .catch(err => console.error('Error al cargar noticias:', err));
    }, []);

    const handleExpandir = (id) => {
        setExpandedId(id);
        fetch(`/api/news/${id}`).catch(() => { });
    };

    const totalItems = noticias.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentNoticias = isAll ? noticias : noticias.slice(startIndex, startIndex + limit);

    // Layout fijo para evitar scroll en desktop
    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    // Noticia expandida para el modal
    const noticiaExpandida = noticias.find(n => n.id === expandedId);

    return (
        <div className={`bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>

            {/* 1. HEADER */}
            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-8'} bg-scout-bg-card/80 backdrop-blur-md border-b border-scout-border flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-scout-primary tracking-tighter uppercase leading-none">
                        Noticias <span className="text-scout-primary/20 italic">Distritales</span>
                    </h1>
                </div>
            </header>

            {/* 2. MAIN */}
            <main className={`max-w-6xl mx-auto px-6 flex flex-col ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>

                {/* TOOLBAR */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-2 ${isFixedLayout ? 'md:h-[4vh]' : ''}`}>
                    <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest text-left">
                        Página {currentPage} de {totalPages || 1} • {totalItems} comunicados
                    </p>
                    <div className="flex items-center gap-2">
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${itemsPerPage === opt
                                        ? 'bg-scout-primary text-white border-scout-primary shadow-md'
                                        : 'bg-scout-bg-card text-scout-muted border-scout-border hover:border-scout-primary'
                                    }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID (Adaptado al diseño de Cursos) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentNoticias.map((n) => (
                        <article
                            key={n.id}
                            onClick={() => handleExpandir(n.id)}
                            className={`group relative bg-scout-bg-card rounded-[2rem] overflow-hidden border border-scout-border transition-all duration-300 flex flex-col md:flex-row cursor-pointer hover:shadow-xl ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto py-4 md:py-0'}`}
                        >
                            {/* Caja de Imagen Izquierda */}
                            <div className={`relative overflow-hidden flex-shrink-0 w-full h-32 md:h-full md:w-[35%] bg-scout-bg-panel`}>
                                <img
                                    src={n.imagen || imgDefault}
                                    alt={n.titulo}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-black/50 backdrop-blur-md text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        {n.fecha}
                                    </span>
                                </div>
                            </div>

                            {/* Contenido Derecha */}
                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[7px] font-bold text-scout-muted uppercase mb-1">
                                    {n.categoria || 'General'}
                                </span>
                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2 text-scout-primary">
                                    {n.titulo}
                                </h2>
                                <p className="text-[10px] text-scout-muted leading-tight line-clamp-2">
                                    {n.contenido || n.copete}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* PAGINACIÓN */}
                {!isAll && totalPages > 1 && (
                    <footer className={`flex justify-center items-center gap-3 px-6 mt-6 md:mt-0 ${isFixedLayout ? 'md:h-[10vh]' : 'py-8'}`}>
                        <div className="flex items-center gap-2 bg-scout-bg-card px-4 py-2 rounded-full border border-scout-border shadow-sm">
                            <span className="text-[9px] font-black uppercase text-scout-muted mr-2">Páginas:</span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(page); }}
                                    className={`w-7 h-7 md:w-8 md:h-8 text-[9px] md:text-[10px] font-black rounded-full border transition-all ${currentPage === page
                                            ? 'bg-scout-primary text-white border-scout-primary shadow-lg scale-110'
                                            : 'bg-scout-bg-card text-scout-muted border-scout-border hover:border-scout-primary'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>

            {/* MODAL */}
            {expandedId && noticiaExpandida && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                    <div className="relative bg-scout-bg-card w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                        <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                            <X size={20} />
                        </button>
                        <div className="md:w-1/2 h-64 md:h-auto bg-scout-bg-panel">
                            <img
                                src={noticiaExpandida.imagen || imgDefault}
                                className="w-full h-full object-cover"
                                alt={noticiaExpandida.titulo}
                            />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-scout-muted block mb-4 text-left">
                                {noticiaExpandida.categoria || 'General'} • {noticiaExpandida.fecha}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-8 text-scout-primary text-left">
                                {noticiaExpandida.titulo}
                            </h2>
                            <p className="text-scout-muted leading-relaxed text-sm md:text-base text-left">
                                {noticiaExpandida.contenido || noticiaExpandida.cuerpo}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Noticias;
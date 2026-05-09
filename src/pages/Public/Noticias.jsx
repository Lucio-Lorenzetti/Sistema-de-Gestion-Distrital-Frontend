import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight, X } from 'lucide-react';
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

    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        <div className={`bg-neutral-50 font-sans min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>
            
            {/* HEADER */}
            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-8'} bg-white/80 backdrop-blur-md border-b border-neutral-200 flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                        Noticias <span className="text-black/20 italic">Distritales</span>
                    </h1>
                </div>
            </header>

            <main className={`max-w-6xl mx-auto px-6 flex flex-col ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>
                
                {/* TOOLBAR */}
                <div className={`flex justify-between items-center mb-4 px-2 ${isFixedLayout ? 'md:h-[4vh]' : ''}`}>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Página {currentPage} de {totalPages} • {totalItems} comunicados
                    </p>
                    <div className="flex items-center gap-2">
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button key={opt} onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }} className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${itemsPerPage === opt ? 'bg-black text-white border-black' : 'bg-white text-neutral-400'}`}>
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID DE NOTICIAS */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentNoticias.map((n) => (
                        <article key={n.id} onClick={() => setExpandedId(n.id)} className={`group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 transition-all duration-300 flex flex-row cursor-pointer hover:shadow-xl ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto py-4'}`}>
                            <div className="relative overflow-hidden flex-shrink-0 w-1/3 md:w-[25%] h-full bg-neutral-200">
                                <img src={n.img || imgDefault} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[7px] font-bold text-neutral-300 uppercase mb-1">{new Date(n.fecha).toLocaleDateString()}</span>
                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2">{n.titulo}</h2>
                                <p className="text-[10px] text-neutral-500 leading-tight line-clamp-2">{n.contenido}</p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* PAGINACIÓN */}
                {!isAll && totalPages > 1 && (
                    <footer className={`flex justify-center items-center gap-3 px-6 mt-6 md:mt-0 ${isFixedLayout ? 'md:h-[10vh]' : 'py-8'}`}>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-100 shadow-sm">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 text-[9px] font-black rounded-full border transition-all ${currentPage === page ? 'bg-black text-white border-black' : 'bg-white text-neutral-400'}`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>

            {/* --- SÚPER MODAL DE AMPLIACIÓN (NOTICIAS) --- */}
            {expandedId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                    
                    <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                        <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                            <X size={20} />
                        </button>

                        <div className="md:w-1/2 h-64 md:h-auto bg-neutral-100">
                            <img src={NOTICIAS_MOCK.find(n => n.id === expandedId)?.img || imgDefault} className="w-full h-full object-cover" />
                        </div>

                        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 block mb-4">
                                {NOTICIAS_MOCK.find(n => n.id === expandedId)?.categoria} • {new Date(NOTICIAS_MOCK.find(n => n.id === expandedId)?.fecha).toLocaleDateString()}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-8">
                                {NOTICIAS_MOCK.find(n => n.id === expandedId)?.titulo}
                            </h2>
                            <p className="text-neutral-500 leading-relaxed text-sm md:text-base">
                                {NOTICIAS_MOCK.find(n => n.id === expandedId)?.contenido}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Noticias;
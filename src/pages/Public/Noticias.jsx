import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import imgDefault from '../../assets/noticia-default.jpg';
import api from '../../api/axios';

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        api.get('/news?solo_publicadas=true')
            .then(res => setNoticias(res.data))
            .catch(err => console.error('Error al cargar noticias:', err));
    }, []);

    const handleExpandir = (id) => {
        setExpandedId(id);
    };

    const totalItems = noticias.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : parseInt(itemsPerPage);
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentNoticias = isAll ? noticias : noticias.slice(startIndex, startIndex + limit);

    const noticiaExpandida = noticias.find(n => n.id === expandedId);

    return (
        <div className="bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white min-h-screen">

            <header className="py-8 bg-scout-bg-card/80 backdrop-blur-md border-b border-scout-border flex flex-col justify-center px-6 md:px-20">
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-scout-primary tracking-tighter uppercase leading-none">
                        Noticias <span className="text-scout-primary/20 italic">Distritales</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 flex flex-col py-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentNoticias.map((n) => (
                        <article
                            key={n.id}
                            onClick={() => handleExpandir(n.id)}
                            className="group relative bg-scout-bg-card rounded-[2rem] overflow-hidden border border-scout-border transition-all duration-300 flex flex-col md:flex-row cursor-pointer hover:shadow-xl md:h-[20vh]"
                        >
                            <div className="relative overflow-hidden flex-shrink-0 w-full h-32 md:h-full md:w-[35%] bg-scout-bg-panel">
                                <img src={n.imagen || imgDefault} alt={n.titulo} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <h2 className="font-bold text-xs md:text-sm mb-1 text-scout-primary line-clamp-2">{n.titulo}</h2>
                                <p className="text-[10px] text-scout-muted line-clamp-2">{n.copete}</p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* PAGINACIÓN */}
                {!isAll && totalPages > 1 && (
                    <footer className="flex justify-center items-center gap-3 px-6 py-8 mt-6">
                        <div className="flex items-center gap-2 bg-scout-bg-card px-4 py-2 rounded-full border border-scout-border">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 text-[10px] font-black rounded-full ${currentPage === page ? 'bg-scout-primary text-white' : 'bg-transparent text-scout-muted'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>

            {expandedId && noticiaExpandida && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-scout-bg-card w-full max-w-5xl rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                        <button
                            onClick={() => setExpandedId(null)}
                            className="absolute top-6 right-6 p-2 bg-scout-primary text-white rounded-full z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="md:w-1/2 h-64 md:h-auto">
                            <img
                                src={noticiaExpandida.imagen || imgDefault}
                                className="w-full h-full object-cover rounded-2xl"
                                alt={noticiaExpandida.titulo}
                            />
                        </div>

                        <div className="md:w-1/2 p-6 md:pl-12 overflow-y-auto text-left">
                            <h2 className="text-3xl font-black uppercase text-scout-primary mb-6">
                                {noticiaExpandida.titulo}
                            </h2>

                            {noticiaExpandida.copete && (
                                <p className="text-lg font-bold text-scout-primary mb-6 border-l-4 border-scout-primary pl-4">
                                    {noticiaExpandida.copete}
                                </p>
                            )}

                            {noticiaExpandida.contenido ? (
                                <p className="text-scout-muted whitespace-pre-line text-sm md:text-base leading-relaxed">
                                    {noticiaExpandida.contenido}
                                </p>
                            ) : (
                                <p className="text-scout-muted italic text-sm">Sin contenido adicional.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Noticias;
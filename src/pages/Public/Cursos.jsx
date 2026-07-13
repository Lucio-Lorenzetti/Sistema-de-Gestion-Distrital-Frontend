import React, { useState, useEffect } from 'react';
import { ChevronUp, ArrowLeft, ArrowRight, GraduationCap, Calendar, MapPin, DollarSign, User, ExternalLink, X, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get('/api/courses')
            .then(res => setCursos(res.data))
            .catch(err => console.error('Error al cargar cursos:', err));
    }, []);

    const totalItems = cursos.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (currentPage - 1) * limit;
    const currentCursos = isAll ? cursos : cursos.slice(startIndex, startIndex + limit);

    // Layout fijo solo cuando estamos en 4 y no hay modal abierto
    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        <div className={`bg-[var(--color-scout-bg-panel)] font-sans selection:bg-[var(--color-scout-primary)] selection:text-white min-h-screen`}>

            <header className="py-8 bg-[var(--color-scout-bg-card)]/80 backdrop-blur-md border-b border-[var(--color-scout-border)] flex flex-col justify-center px-6 md:px-20">
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-[var(--color-scout-primary)] tracking-tighter uppercase leading-none">
                        Cursos de <span className="text-[var(--color-scout-primary)]/20 italic">Formación</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 flex flex-col py-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-2">
                    <p className="text-[10px] font-bold text-[var(--color-scout-muted)] uppercase tracking-widest text-left">
                        Página {currentPage} de {totalPages || 1} • {totalItems} propuestas educativas
                    </p>
                    <div className="flex items-center gap-2">
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${itemsPerPage === opt
                                    ? 'bg-[var(--color-scout-primary)] text-white border-[var(--color-scout-primary)] shadow-md'
                                    : 'bg-[var(--color-scout-bg-card)] text-[var(--color-scout-muted)] border-[var(--color-scout-border)] hover:border-[var(--color-scout-primary)]'
                                    }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCursos.map((curso) => (
                        <article
                            key={curso.id}
                            onClick={() => setExpandedId(curso.id)}
                            className="group relative bg-[var(--color-scout-bg-card)] rounded-[2rem] overflow-hidden border border-[var(--color-scout-border)] transition-all duration-300 flex flex-col md:flex-row cursor-pointer hover:shadow-xl h-44 md:h-40 w-full"
                        >
                            <div className="relative overflow-hidden flex-shrink-0 w-full h-32 md:h-full md:w-[25%] bg-[var(--color-scout-primary)] flex items-center justify-center text-white">
                                <GraduationCap size={32} className="opacity-20 group-hover:scale-110 transition-transform" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        NIVEL {curso.nivel}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[7px] font-bold text-[var(--color-scout-muted)] uppercase mb-1">
                                    {curso.modalidad} • {curso.ramas}
                                </span>
                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2 text-[var(--color-scout-primary)]">
                                    {curso.titulo}
                                </h2>
                                <p className="text-[10px] text-[var(--color-scout-muted)] leading-tight line-clamp-2">
                                    {curso.resumen}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {totalPages > 1 && (
                    <footer className="flex justify-center items-center gap-3 px-6 py-8 mt-25">
                        <div className="flex items-center gap-2 bg-[var(--color-scout-bg-card)] px-4 py-2 rounded-full border border-[var(--color-scout-border)] shadow-sm">
                            <span className="text-[9px] font-black uppercase text-[var(--color-scout-muted)] mr-2">Páginas:</span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(page); }}
                                    className={`w-7 h-7 md:w-8 md:h-8 text-[9px] md:text-[10px] font-black rounded-full border transition-all ${currentPage === page
                                        ? 'bg-[var(--color-scout-primary)] text-white border-[var(--color-scout-primary)] shadow-lg scale-110'
                                        : 'bg-[var(--color-scout-bg-card)] text-[var(--color-scout-muted)] border-[var(--color-scout-border)] hover:border-[var(--color-scout-primary)]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>
            {expandedId && (() => {
                const c = cursos.find(item => item.id === expandedId);
                if (!c) return null;
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-[var(--color-scout-primary)]/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                        <div className="relative bg-[var(--color-scout-bg-card)] w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 text-left">
                            <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-[var(--color-scout-primary)] text-white rounded-full hover:scale-110 transition-transform">
                                <X size={20} />
                            </button>
                            <div className="md:w-2/5 bg-[var(--color-scout-primary)] flex flex-col items-center justify-center text-white p-12 text-center space-y-6 flex-shrink-0">
                                <GraduationCap size={80} className="opacity-20" />
                                <div>
                                    {/*<span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2 text-white">Nivel del Curso</span>
                                    <p className="text-2xl font-black uppercase">{c.nivel}</p>*/}
                                </div>
                                <a href={c.link_formulario} target="_blank" rel="noopener noreferrer" className="w-full bg-[var(--color-scout-bg-card)] text-[var(--color-scout-primary)] py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-[var(--color-scout-border)] transition-all">
                                    Inscribirse <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="md:w-3/5 p-8 md:p-16 overflow-y-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-scout-muted)] block mb-4">{c.ramas}</span>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-10 text-[var(--color-scout-primary)]">{c.titulo}</h2>
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10 border-y border-[var(--color-scout-border)] py-10">
                                    <div className="space-y-1"><p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Fecha</p><div className="flex items-center gap-2 text-sm font-bold text-[var(--color-scout-primary)]"><Calendar size={16} /> {c.fecha_fin}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Lugar</p><div className="flex items-center gap-2 text-sm font-bold text-[var(--color-scout-primary)]"><MapPin size={16} /> {c.lugar}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Costo</p><div className="flex items-center gap-2 text-sm font-bold text-[var(--color-scout-primary)]"><DollarSign size={16} /> {c.costo}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Modalidad</p><div className="flex items-center gap-2 text-sm font-bold text-[var(--color-scout-primary)]"><Layers size={16} /> {c.modalidad}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Formador</p><div className="flex items-center gap-2 text-sm font-bold text-[var(--color-scout-primary)]"><User size={16} /> {c.formador}</div></div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Resumen del Curso</p>
                                    <p className="text-[var(--color-scout-muted)] leading-relaxed text-sm md:text-base">{c.descripcion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default Cursos;
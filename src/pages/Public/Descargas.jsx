import React, { useState } from 'react';
import { FileText, Download, ArrowLeft, X, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESCARGAS_MOCK = [
    { id: 1, titulo: "FICHA MÉDICA INDIVIDUAL 2026", categoria: "Salud", peso: "1.2 MB", contenido: "Formulario oficial obligatorio para todos los beneficiarios y educadores del Distrito. Debe ser presentada por duplicado y firmada por médico matriculado.", version: "v2.1", url: "ficha_medica_2026.pdf" },
    { id: 2, titulo: "AUTORIZACIÓN DE SALIDA GRUPAL", categoria: "Legales", peso: "450 KB", contenido: "Plantilla para permisos de viaje y salidas fuera de la sede. Incluye las cláusulas de responsabilidad civil vigentes según estatuto.", version: "v1.0", url: "autorizacion_salida.pdf" },
    { id: 3, titulo: "REGLAMENTO DE UNIFORME", categoria: "Institucional", peso: "3.5 MB", contenido: "Manual detallado sobre el uso correcto de insignias, pañuelos y vestimenta oficial del Distrito 3.", version: "v4.2", url: "reglamento_uniforme.pdf" },
    { id: 4, titulo: "PROTOCOLO DE EMERGENCIAS", categoria: "Seguridad", peso: "2.1 MB", contenido: "Guía rápida de actuación ante accidentes en campamento. Contiene los números de emergencia locales.", version: "v2.0", url: "protocolo_emergencias.pdf" },
    { id: 5, titulo: "PLANILLA DE ASISTENCIA", categoria: "Administración", peso: "120 KB", contenido: "Formato estándar para el control de asistencia semanal de las unidades scout.", version: "v3.1", url: "planilla_asistencia.pdf" },
    { id: 6, titulo: "PROGRAMA EDUCATIVO: RAMA SCOUT", categoria: "Educativo", peso: "4.2 MB", contenido: "Documento técnico que detalla los objetivos educativos para la Rama Scout.", version: "v1.5", url: "programa_rama_scout.pdf" }
];

const Descargas = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const API_STORAGE_URL = "http://localhost:8000/storage/descargas/";

    const totalItems = DESCARGAS_MOCK.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (currentPage - 1) * limit;
    const currentItems = isAll ? DESCARGAS_MOCK : DESCARGAS_MOCK.slice(startIndex, startIndex + limit);

    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        <div className={`bg-[var(--color-scout-bg-panel)] font-sans selection:bg-[var(--color-scout-primary)] selection:text-white min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>

            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-8'} bg-[var(--color-scout-bg-card)]/80 backdrop-blur-md border-b border-[var(--color-scout-border)] flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-[var(--color-scout-primary)] tracking-tighter uppercase leading-none">
                        Repositorio <span className="text-[var(--color-scout-primary)]/20 italic">Digital PDF</span>
                    </h1>
                </div>
            </header>

            <main className={`max-w-6xl mx-auto px-6 flex flex-col ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>

                <div className={`flex justify-between items-center mb-4 px-2 ${isFixedLayout ? 'md:h-[4vh]' : ''}`}>
                    <p className="text-[10px] font-bold text-[var(--color-scout-muted)] uppercase tracking-widest text-left">
                        Página {currentPage} de {totalPages} • {totalItems} archivos oficiales
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

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentItems.map((file) => (
                        <article
                            key={file.id}
                            onClick={() => setExpandedId(file.id)}
                            className={`group relative bg-[var(--color-scout-bg-card)] rounded-[2rem] overflow-hidden border border-[var(--color-scout-border)] transition-all duration-300 flex flex-row cursor-pointer hover:shadow-xl ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto py-4'}`}
                        >
                            <div className="relative overflow-hidden flex-shrink-0 w-1/3 md:w-[25%] h-full bg-[var(--color-scout-accent-light)] flex items-center justify-center text-[var(--color-scout-accent)] border-r border-[var(--color-scout-accent)]/20">
                                <FileText size={32} className="group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-[var(--color-scout-accent)]/10 backdrop-blur-xl text-[var(--color-scout-accent)] text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                        {file.categoria}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[8px] font-bold text-[var(--color-scout-muted)] uppercase mb-1">{file.peso}</span>
                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2 text-[var(--color-scout-primary)]">
                                    {file.titulo}
                                </h2>
                                <p className="text-[10px] text-[var(--color-scout-muted)] leading-tight line-clamp-2">
                                    {file.contenido}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {!isAll && totalPages > 1 && (
                    <footer className={`flex justify-center items-center gap-3 px-6 mt-6 md:mt-0 ${isFixedLayout ? 'md:h-[10vh]' : 'py-8'}`}>
                        <div className="flex items-center gap-2 bg-[var(--color-scout-bg-card)] px-4 py-2 rounded-full border border-[var(--color-scout-border)] shadow-sm">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(page); }}
                                    className={`w-7 h-7 text-[9px] font-black rounded-full border transition-all ${currentPage === page
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
                const f = DESCARGAS_MOCK.find(item => item.id === expandedId);
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-[var(--color-scout-primary)]/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />

                        <div className="relative bg-[var(--color-scout-bg-card)] w-full max-w-4xl max-h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 text-left">
                            <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-[var(--color-scout-primary)] text-white rounded-full hover:rotate-90 transition-all">
                                <X size={20} />
                            </button>

                            <div className="md:w-1/3 bg-[var(--color-scout-accent)] flex flex-col items-center justify-center text-white p-12 text-center space-y-6 flex-shrink-0">
                                <FileText size={80} className="opacity-20" />
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2 text-white">Tamaño del archivo</span>
                                    <p className="text-2xl font-black uppercase">{f.peso}</p>
                                </div>
                                <a
                                    href={`${API_STORAGE_URL}${f.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[var(--color-scout-bg-card)] text-[var(--color-scout-accent)] py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
                                >
                                    Bajar PDF <Download size={14} />
                                </a>
                            </div>

                            <div className="md:w-2/3 p-8 md:p-16 overflow-y-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-scout-muted)] block mb-4">{f.categoria}</span>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-10 text-[var(--color-scout-primary)]">{f.titulo}</h2>

                                <div className="space-y-8 border-y border-[var(--color-scout-border)] py-10 mb-8">
                                    <div className="flex gap-4">
                                        <Info className="text-[var(--color-scout-muted)]" />
                                        <div>
                                            <p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Descripción del documento</p>
                                            <p className="text-[var(--color-scout-muted)] leading-relaxed text-sm">{f.contenido}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <ShieldCheck className="text-[var(--color-scout-muted)]" />
                                        <div>
                                            <p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest">Información de integridad</p>
                                            <p className="text-sm font-bold uppercase text-[var(--color-scout-primary)]">Versión: {f.version} • Origen verificado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default Descargas;
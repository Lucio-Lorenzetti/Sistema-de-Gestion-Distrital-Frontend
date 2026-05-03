import React, { useState } from 'react';
import { FileText, Download, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESCARGAS_MOCK = [
    { id: 1, titulo: "FICHA MÉDICA INDIVIDUAL 2026", categoria: "Salud", peso: "1.2 MB", contenido: "Formulario oficial obligatorio para todos los beneficiarios y educadores del Distrito. Debe ser presentada por duplicado.", version: "v2.1", url: "ficha_medica_2026.pdf" },
    { id: 2, titulo: "AUTORIZACIÓN DE SALIDA GRUPAL", categoria: "Legales", peso: "450 KB", contenido: "Plantilla para permisos de viaje y salidas fuera de la sede. Incluye las cláusulas de responsabilidad civil vigentes.", version: "v1.0", url: "autorizacion_salida.pdf" },
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

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    // Ajuste matemático: Solo aplicamos el layout "No-Scroll" en escritorio con 4 noticias
    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        <div className={`bg-neutral-50 font-sans selection:bg-black selection:text-white min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>
            
            {/* 1. HEADER (15% alto en desktop) */}
            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-8'} bg-white/80 backdrop-blur-md border-b border-neutral-200 flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                        Repositorio <span className="text-black/20 italic">Digital PDF</span>
                    </h1>
                </div>
            </header>

            {/* 2. MAIN (75% alto en desktop) */}
            <main className={`max-w-6xl mx-auto px-6 flex flex-col ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>
                
                {/* TOOLBAR COMPACTA */}
                <div className={`flex justify-between items-center mb-2 px-2 ${isFixedLayout ? 'md:h-[4vh]' : 'mb-4'}`}>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-left">
                        Página {currentPage} de {totalPages} • {totalItems} archivos
                    </p>
                    <div className="flex items-center gap-2">
                        {/* CORRECCIÓN: 'all' con comillas */}
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button 
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${
                                    itemsPerPage === opt ? 'bg-black text-white border-black' : 'bg-white text-neutral-400'
                                }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID: 2 Columnas x 2 Filas estrictas */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentItems.map((file) => (
                        <article 
                            key={file.id} 
                            className={`group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 transition-all duration-300 flex flex-col md:flex-row ${
                                expandedId === file.id 
                                ? 'fixed inset-4 md:inset-x-40 md:top-10 md:bottom-10 z-50 shadow-2xl overflow-y-auto' 
                                : `hover:shadow-lg ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto'}`
                            }`}
                        >
                            {/* ICON BOX IZQUIERDA (Simula la imagen de noticias) */}
                            <div className={`relative overflow-hidden flex-shrink-0 w-full h-32 md:h-full md:w-[25%] bg-neutral-50 flex items-center justify-center text-red-500 border-r border-neutral-50`}>
                                <FileText size={24} className="group-hover:scale-110 transition-transform" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-black/80 backdrop-blur-xl text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        {file.categoria}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENIDO DERECHA */}
                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[8px] font-bold text-neutral-300 uppercase mb-1">
                                    {file.peso}
                                </span>

                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2">
                                    {file.titulo}
                                </h2>

                                <p className="text-[10px] text-neutral-500 leading-tight line-clamp-2">
                                    {file.contenido}
                                </p>

                                <div className="mt-2 pt-2 border-t border-neutral-50 flex items-center justify-between">
                                    <button 
                                        onClick={() => toggleExpand(file.id)}
                                        className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-black hover:underline"
                                    >
                                        {expandedId === file.id ? 'Cerrar' : 'Detalles'}
                                    </button>
                                    
                                    <a 
                                        href={`${API_STORAGE_URL}${file.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[7px] md:text-[8px] font-black uppercase bg-black text-white px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
                                    >
                                        Bajar <Download size={10} />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 3. PAGINACIÓN (10% alto en desktop) */}
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

            {/* Modal Overlay */}
            {expandedId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setExpandedId(null)} />
            )}
        </div>
    );
};

export default Descargas;
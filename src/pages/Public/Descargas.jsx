import React, { useState } from 'react';
import { FileText, Download, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESCARGAS_MOCK = [
    { id: 1, titulo: "FICHA MÉDICA INDIVIDUAL 2026", categoria: "Salud", peso: "1.2 MB", contenido: "Formulario oficial obligatorio para todos los beneficiarios y educadores del Distrito. Debe ser presentada por duplicado y firmada por médico matriculado para autorizar cualquier actividad scout presencial.", version: "v2.1", url: "ficha_medica_2026.pdf" },
    { id: 2, titulo: "AUTORIZACIÓN DE SALIDA GRUPAL", categoria: "Legales", peso: "450 KB", contenido: "Plantilla para permisos de viaje y salidas fuera de la sede. Incluye las cláusulas de responsabilidad civil vigentes según el estatuto nacional de Scouts de Argentina para el año 2026.", version: "v1.0", url: "autorizacion_salida.pdf" },
    { id: 3, titulo: "REGLAMENTO DE UNIFORME", categoria: "Institucional", peso: "3.5 MB", contenido: "Manual detallado sobre el uso correcto de insignias, pañuelos y vestimenta oficial del Distrito 3. Incluye la guía técnica de colocación de parches de progresión y especialidades.", version: "v4.2", url: "reglamento_uniforme.pdf" },
    { id: 4, titulo: "PROTOCOLO DE EMERGENCIAS", categoria: "Seguridad", peso: "2.1 MB", contenido: "Guía rápida de actuación ante accidentes en campamento. Contiene los números de emergencia locales de Bahía Blanca y el procedimiento de comunicación oficial del Distrito.", version: "v2.0", url: "protocolo_emergencias.pdf" },
    { id: 5, titulo: "PLANILLA DE ASISTENCIA", categoria: "Administración", peso: "120 KB", contenido: "Formato estándar para el control de asistencia semanal de las unidades. Esencial para el reporte estadístico que se solicita al final de cada ciclo lectivo por la dirección distrital.", version: "v3.1", url: "planilla_asistencia.pdf" },
    { id: 6, titulo: "PROGRAMA EDUCATIVO: RAMA SCOUT", categoria: "Educativo", peso: "4.2 MB", contenido: "Documento técnico que detalla los objetivos educativos y las áreas de desarrollo para la Rama Scout durante el ciclo lectivo vigente, incluyendo competencias por etapa.", version: "v1.5", url: "programa_rama_scout.pdf" },
    { id: 7, titulo: "GUÍA DE INSIGNIAS DE PROGRESIÓN", categoria: "Educativo", peso: "2.8 MB", contenido: "Catálogo visual de todas las insignias de progresión personal y especialidades. Incluye los requisitos mínimos técnicos para la entrega de cada reconocimiento institucional.", version: "v2.0", url: "guia_insignias.pdf" },
    { id: 8, titulo: "ESTATUTO NACIONAL 2024", categoria: "Institucional", peso: "15 MB", contenido: "Cuerpo legal completo de nuestra asociación. Lectura fundamental para educadores y dirigentes en proceso de formación y toma de compromisos ante la asamblea distrital.", version: "v2024", url: "estatuto_nacional.pdf" },
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

    return (
        <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white pb-20">
            
            {/*Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 h-30 flex flex-col justify-center">
                <div className="max-w-5xl mx-auto px-6 w-full">
                    <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-colors mb-6">
                        <ArrowLeft size={12} /> Volver al Inicio
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-light text-black tracking-tight uppercase leading-none">
                        Repositorio <span className="font-black italic">Digital PDF</span>
                    </h1>
                    <div className="h-px w-12 bg-black mt-4 opacity-20" />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-6">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                        Documentación disponible: {totalItems} archivos
                    </p>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-neutral-400">Ver:</span>
                        {[4, 8, 12, 'all'].map((opt) => (
                            <button 
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[10px] font-black uppercase px-3 py-1 border transition-all ${
                                    itemsPerPage === opt 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-neutral-400 border-neutral-200 hover:border-black'
                                }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((file) => (
                        <article 
                            key={file.id} 
                            className={`group relative border border-neutral-200 p-4 transition-all bg-white/60 backdrop-blur-sm hover:shadow-lg ${
                                expandedId === file.id ? 'md:col-span-2 border-black bg-white' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40">
                                        {file.categoria}
                                    </span>
                                    <h2 className="text-lg font-bold tracking-tight uppercase leading-tight">
                                        {file.titulo}
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">
                                        <FileText size={12} /> PDF
                                    </div>
                                    <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase">
                                        {file.peso}
                                    </span>
                                </div>
                            </div>

                            <p className={`text-xs text-neutral-500 leading-relaxed mb-6 transition-all duration-300 ${
                                expandedId === file.id ? '' : 'line-clamp-2'
                            }`}>
                                {file.contenido}
                            </p>

                            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                                <button 
                                    onClick={() => toggleExpand(file.id)}
                                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                                >
                                    {expandedId === file.id ? 'Cerrar detalles' : 'Detalles técnicos'} 
                                    {expandedId === file.id ? <ChevronUp size={12}/> : <ChevronDown size={12} />}
                                </button>

                                <a 
                                    href={`${API_STORAGE_URL}${file.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
                                >
                                    Descargar <Download size={14} />
                                </a>
                            </div>

                            {expandedId === file.id && (
                                <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 flex gap-6 text-[10px] font-bold text-neutral-400 uppercase italic">
                                    <span>Revisión: {file.version}</span>
                                    <span>Integridad: Verificada</span>
                                    <span>Origen: Servidor D3</span>
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                {/* CORRECCIÓN 2: Indicador de página (Números 1, 2...) */}
                {!isAll && totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 text-[10px] font-black border transition-all ${
                                    currentPage === page ? 'bg-black text-white border-black' : 'bg-white text-neutral-400 border-neutral-200'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Descargas;
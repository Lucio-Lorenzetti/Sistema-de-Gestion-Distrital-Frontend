import React, { useState } from 'react';
import { ChevronUp, ArrowLeft, ArrowRight, GraduationCap, Calendar, MapPin, DollarSign, User, ExternalLink, X, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. 10 CURSOS DE PRUEBA (MOCK)
const CURSOS_MOCK = [
    { id: 1, titulo: "MÓDULO 1: INTRODUCCIÓN AL MOVIMIENTO", ramas: "Todas las ramas", fecha: "15/05/2026", nivel: "Inicial", costo: "$5.000", lugar: "Grupo 1 - Pompeya", modalidad: "Presencial", formador: "IM. Juan Perez", resumen: "Primer encuentro de formación para nuevos educadores. Bases del escultismo y método.", form_url: "https://forms.google.com" },
    { id: 2, titulo: "TÉCNICAS DE VIDA EN LA NATURALEZA", ramas: "Unidad Scout", fecha: "22/05/2026", nivel: "Intermedio", costo: "$7.500", lugar: "Campo Escuela D3", modalidad: "Presencial", formador: "IM. Ricardo Gomez", resumen: "Taller práctico de construcciones, pionerismo y seguridad en el campamento.", form_url: "https://forms.google.com" },
    { id: 3, titulo: "PSICOLOGÍA DEL JOVEN Y EL NIÑO", ramas: "Manada / Rovers", fecha: "05/06/2026", nivel: "Avanzado", costo: "$3.000", lugar: "Sede Distrito 3", modalidad: "Virtual", formador: "Lic. Marta Diaz", resumen: "Análisis de las etapas evolutivas y cómo adaptar el programa educativo.", form_url: "https://forms.google.com" },
    { id: 4, titulo: "GESTIÓN INSTITUCIONAL Y GRUPAL", ramas: "Dirigencia", fecha: "12/06/2026", nivel: "Intermedio", costo: "$4.000", lugar: "Grupo 48 - San Jorge", modalidad: "Híbrido", formador: "MS. Lucio Lorenzetti", resumen: "Herramientas administrativas para Jefes de Grupo y de Unidad.", form_url: "https://forms.google.com" },
    { id: 5, titulo: "PRIMEROS AUXILIOS EN ZONAS AGRESTES", ramas: "Todas las ramas", fecha: "20/06/2026", nivel: "Inicial", costo: "$6.000", lugar: "Parque de Mayo", modalidad: "Presencial", formador: "Dr. Carlos Paz", resumen: "Protocolos de emergencia y estabilización en contextos de naturaleza.", form_url: "https://forms.google.com" },
    { id: 6, titulo: "PROGRAMA EDUCATIVO: RAMA LOBATOS", ramas: "Manada", fecha: "02/07/2026", nivel: "Inicial", costo: "$3.500", lugar: "Virtual (Zoom)", modalidad: "Virtual", formador: "IM. Ana Valle", resumen: "Implementación del nuevo esquema de progresión para la rama Lobatos.", form_url: "https://forms.google.com" },
    { id: 7, titulo: "ANIMACIÓN DE LA UNIDAD SCOUT", ramas: "Caminantes", fecha: "10/07/2026", nivel: "Intermedio", costo: "$5.500", lugar: "Sede Distrito 3", modalidad: "Presencial", formador: "IM. Esteban Quito", resumen: "Linterazgo y motivación para jóvenes de 14 a 17 años.", form_url: "https://forms.google.com" },
    { id: 8, titulo: "TALLER DE ESPECIALIDADES", ramas: "Todas las ramas", fecha: "18/07/2026", nivel: "Avanzado", costo: "$2.000", lugar: "Google Meet", modalidad: "Virtual", formador: "IM. Sofia Luna", resumen: "Cómo guiar a los jóvenes en la elección y desarrollo de sus especialidades.", form_url: "https://forms.google.com" },
    { id: 9, titulo: "CAMPISMO Y ORIENTACIÓN", ramas: "Rovers", fecha: "25/07/2026", nivel: "Inicial", costo: "$6.500", lugar: "Sierra de la Ventana", modalidad: "Presencial", formador: "IM. Pablo Sierra", resumen: "Uso de brújula, GPS y lectura de mapas en terreno real.", form_url: "https://forms.google.com" },
    { id: 10, titulo: "DISEÑO DE PROYECTOS ROVERS", ramas: "Rovers", fecha: "01/08/2026", nivel: "Intermedio", costo: "$3.000", lugar: "Sede Distrito 3", modalidad: "Presencial", formador: "MS. Pedro Alva", resumen: "Metodología de proyectos para el servicio comunitario Rover.", form_url: "https://forms.google.com" }
];

const Cursos = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    // --- LÓGICA DE BACKEND (PREPARADA) ---
    /* const [cursos, setCursos] = useState([]);
    useEffect(() => {
        const fetchCursos = async () => {
            const res = await axios.get('http://localhost:8000/api/cursos');
            setCursos(res.data);
        };
        fetchCursos();
    }, []); 
    */

    const totalItems = CURSOS_MOCK.length;
    const isAll = itemsPerPage === 'all';
    const limit = isAll ? totalItems : itemsPerPage;
    const totalPages = Math.ceil(totalItems / limit);
    
    const startIndex = (currentPage - 1) * limit;
    const currentCursos = isAll ? CURSOS_MOCK : CURSOS_MOCK.slice(startIndex, startIndex + limit);

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    // Layout fijo para evitar scroll en escritorio con 4 items
    const isFixedLayout = itemsPerPage === 4 && !expandedId;

    return (
        <div className={`bg-neutral-50 font-sans selection:bg-black selection:text-white min-h-screen ${isFixedLayout ? 'md:h-screen md:overflow-hidden' : ''}`}>
            
            {/* 1. HEADER (IDÉNTICO A NOTICIAS) */}
            <header className={`${isFixedLayout ? 'md:h-[15vh]' : 'py-8'} bg-white/80 backdrop-blur-md border-b border-neutral-200 flex flex-col justify-center px-6 md:px-20`}>
                <div className="max-w-5xl mx-auto w-full text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                        Cursos de <span className="text-black/20 italic">Formación</span>
                    </h1>
                </div>
            </header>

            {/* 2. MAIN */}
            <main className={`max-w-6xl mx-auto px-6 flex flex-col ${isFixedLayout ? 'md:h-[75vh] md:justify-start md:pt-4' : 'py-6'}`}>
                
                {/* TOOLBAR COMPACTA */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-2 ${isFixedLayout ? 'md:h-[4vh]' : ''}`}>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-left">
                        Página {currentPage} de {totalPages} • {totalItems} propuestas educativas
                    </p>
                    <div className="flex items-center gap-2">
                        {[4, 6, 8, 'all'].map((opt) => (
                            <button 
                                key={opt}
                                onClick={() => { setItemsPerPage(opt); setCurrentPage(1); }}
                                className={`text-[8px] font-black uppercase px-3 py-1 border rounded-full transition-all ${
                                    itemsPerPage === opt ? 'bg-black text-white border-black shadow-md' : 'bg-white text-neutral-400 border-neutral-200 hover:border-black'
                                }`}
                            >
                                {opt === 'all' ? 'Todo' : opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID: 2 Columnas x 2 Filas estrictas */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFixedLayout ? 'md:h-[68vh]' : ''}`}>
                    {currentCursos.map((curso) => (
                        <article 
                            key={curso.id} 
                            onClick={() => setExpandedId(curso.id)}
                            className={`group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 transition-all duration-300 flex flex-col md:flex-row cursor-pointer hover:shadow-xl ${isFixedLayout ? 'md:h-[20vh]' : 'h-auto py-4 md:py-0'}`}
                        >
                            {/* Visual Box */}
                            <div className={`relative overflow-hidden flex-shrink-0 w-full h-32 md:h-full md:w-[25%] bg-neutral-900 flex items-center justify-center text-white`}>
                                <GraduationCap size={32} className="opacity-20 group-hover:scale-110 transition-transform" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        NIVEL {curso.nivel}
                                    </span>
                                </div>
                            </div>

                            {/* Contenido Card */}
                            <div className="p-4 flex flex-col justify-center flex-grow overflow-hidden text-left">
                                <span className="text-[7px] font-bold text-neutral-300 uppercase mb-1">
                                    {curso.modalidad} • {curso.ramas}
                                </span>
                                <h2 className="font-bold tracking-tight uppercase leading-tight text-xs md:text-sm mb-1 line-clamp-2">
                                    {curso.titulo}
                                </h2>
                                <p className="text-[10px] text-neutral-500 leading-tight line-clamp-2">
                                    {curso.resumen}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 3. PAGINACIÓN (Fijada abajo en desktop) */}
                {!isAll && totalPages > 1 && (
                    <footer className={`flex justify-center items-center gap-3 px-6 mt-6 md:mt-0 ${isFixedLayout ? 'md:h-[10vh]' : 'py-8'}`}>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-100 shadow-sm">
                            <span className="text-[9px] font-black uppercase text-neutral-400 mr-2">Páginas:</span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(page); }}
                                    className={`w-7 h-7 md:w-8 md:h-8 text-[9px] md:text-[10px] font-black rounded-full border transition-all ${
                                        currentPage === page ? 'bg-black text-white border-black shadow-lg scale-110' : 'bg-white text-neutral-400'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </footer>
                )}
            </main>

            {/* --- SÚPER MODAL DE AMPLIACIÓN (IDÉNTICO A NOTICIAS) --- */}
            {expandedId && (() => {
                const c = CURSOS_MOCK.find(item => item.id === expandedId);
                if (!c) return null;
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
                        
                        <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 text-left">
                            <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                                <X size={20} />
                            </button>

                            <div className="md:w-2/5 bg-neutral-900 flex flex-col items-center justify-center text-white p-12 text-center space-y-6 flex-shrink-0">
                                <GraduationCap size={80} className="opacity-20" />
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2 text-white">Nivel del Curso</span>
                                    <p className="text-2xl font-black uppercase">{c.nivel}</p>
                                </div>
                                <a href={c.form_url} target="_blank" rel="noopener noreferrer" className="w-full bg-white text-black py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:invert transition-all">
                                    Inscribirse <ExternalLink size={14}/>
                                </a>
                            </div>

                            <div className="md:w-3/5 p-8 md:p-16 overflow-y-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 block mb-4">{c.ramas}*</span>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-10">{c.titulo}*</h2>
                                
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10 border-y border-neutral-100 py-10">
                                    <div className="space-y-1"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Fecha*</p><div className="flex items-center gap-2 text-sm font-bold"><Calendar size={16}/> {c.fecha}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Lugar*</p><div className="flex items-center gap-2 text-sm font-bold"><MapPin size={16}/> {c.lugar}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Costo*</p><div className="flex items-center gap-2 text-sm font-bold"><DollarSign size={16}/> {c.costo}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Modalidad</p><div className="flex items-center gap-2 text-sm font-bold"><Layers size={16}/> {c.modalidad}</div></div>
                                    <div className="space-y-1"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Formador</p><div className="flex items-center gap-2 text-sm font-bold"><User size={16}/> {c.formador}</div></div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Resumen del Curso</p>
                                    <p className="text-neutral-500 leading-relaxed text-sm md:text-base">{c.resumen}</p>
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
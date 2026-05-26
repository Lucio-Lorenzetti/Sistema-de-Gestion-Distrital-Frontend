import React from 'react';
import { ArrowRight, ChevronRight, FileText, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import bgHero from '../../assets/f-bienvenida.jpg'; 
import imgDefault from '../../assets/noticia-default.jpg';
import { NOTICIAS_MOCK } from '../../data/noticias';

// DATOS DE PRUEBA PARA CURSOS (MOCK)
const CURSOS_MOCK = [
    { id: 1, titulo: "Módulo 1: Introducción al Movimiento", nivel: "Inicial", modalidad: "Presencial" },
    { id: 2, titulo: "Técnicas de Vida en la Naturaleza", nivel: "Intermedio", modalidad: "Híbrido" },
    { id: 3, titulo: "Psicología del Niño y el Joven", nivel: "Avanzado", modalidad: "Virtual" },
    { id: 4, titulo: "Gestión y Administración de Grupo", nivel: "Dirigencia", modalidad: "Presencial" }
];

const Home = () => {
    return (
        <div className="bg-scout-bg-panel text-scout-primary font-sans selection:bg-scout-primary selection:text-white">
            
            {/* 1. HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-start px-6 md:px-20 overflow-hidden">
                <div 
                    className="absolute inset-0 z-0 bg-fixed"
                    style={{ 
                        backgroundImage: `url(${bgHero})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-black/50 md:bg-black/40 z-0" />
                
                <div className="relative z-10 max-w-4xl w-full text-left pt-20 md:pt-10">
                    <h1 className="text-4xl md:text-[90px] font-black tracking-tighter leading-[1] md:leading-[0.85] text-white uppercase mb-6 md:mb-8">
                        Gestión <br />
                        <span className="text-white/40 italic">Distrito 3.</span>
                    </h1>
                    
                    <p className="text-xs md:text-lg text-white/80 max-w-xl mb-10 md:mb-12 leading-relaxed font-medium uppercase tracking-wide">
                        Digitalizando la administración scout para potenciar el servicio. 
                        Eficiencia técnica para educadores del Distrito 3.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start justify-start gap-4 md:gap-6 mt-8 md:mt-16 w-full sm:w-auto">
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border-2 border-white/30 text-white font-black uppercase text-[10px] md:text-[12px] tracking-widest hover:bg-white hover:text-black transition-all backdrop-blur-md rounded-full text-center"
                        >
                            Comenzar Gestión
                        </Link>
                        <Link 
                            to="/noticias"
                            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border-2 border-white/30 text-white font-black uppercase text-[10px] md:text-[12px] tracking-widest hover:bg-white hover:text-black transition-all backdrop-blur-md rounded-full text-center"
                        >
                            Últimas Noticias
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN NOTICIAS */}
            <section className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                    <div className="space-y-2 md:space-y-4">
                        <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-scout-muted">Comunicación</p>
                        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-scout-primary">Noticias Recientes</h2>
                    </div>
                    <Link to="/noticias" className="flex items-center gap-3 text-[9px] md:text-[11px] font-black uppercase tracking-widest border-b-2 border-scout-primary/10 pb-2 hover:border-scout-primary transition-all">
                        Feed Completo <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {NOTICIAS_MOCK.slice(0, 3).map((n) => (
                        <div key={n.id} className="group bg-scout-bg-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-scout-border hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="h-48 md:h-56 bg-neutral-200 overflow-hidden relative flex items-center justify-center">
                                <img 
                                    src={n.img || imgDefault} 
                                    alt={n.titulo} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 md:top-6 left-4 md:left-6">
                                    <span className="bg-black/70 backdrop-blur-xl text-white text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest">
                                        {n.categoria}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8 space-y-3 md:space-y-4 flex-grow text-left">
                                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight leading-tight text-scout-primary">{n.titulo}</h3>
                                <p className="text-xs md:text-[13px] text-scout-muted leading-relaxed line-clamp-2">{n.contenido}</p>
                                <div className="pt-4 border-t border-scout-border">
                                    <Link to="/noticias" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Leer más <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. SECCIÓN CURSOS */}
            <section className="min-h-screen bg-scout-bg-panel flex flex-col justify-center py-16 md:py-24 px-6 md:px-8 border-y border-scout-border">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center text-left">
                    <div className="lg:col-span-5 space-y-6 md:space-y-10">
                        <div className="space-y-2 md:space-y-4">
                            <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-scout-muted">Capacitación</p>
                            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[1] md:leading-[0.85] text-scout-primary">
                                Esquema de <br /> <span className="text-scout-primary/20 italic">Formación.</span>
                            </h2>
                        </div>
                        <p className="text-sm md:text-md text-scout-muted leading-relaxed uppercase tracking-wider font-medium max-w-sm">
                            Mejorá tus herramientas educativas con los cursos presenciales y virtuales dictados en la Zona 22.
                        </p>
                        <Link to="/cursos" className="inline-flex items-center gap-4 bg-scout-primary text-white px-8 md:px-12 py-4 md:py-6 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:bg-scout-primary-hover transition-all shadow-xl">
                            Inscribirse a un curso <BookOpen size={18} />
                        </Link>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {CURSOS_MOCK.map((curso, i) => (
                            <div key={i} className="p-6 md:p-8 bg-scout-bg-card border border-scout-border rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between hover:border-scout-primary transition-all group cursor-pointer h-44 md:h-52 shadow-sm hover:shadow-2xl">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 md:p-4 bg-scout-bg-panel rounded-xl md:rounded-2xl group-hover:bg-scout-primary group-hover:text-white transition-colors text-scout-primary">
                                        <GraduationCap size={20} md:size={24} />
                                    </div>
                                    <span className="text-[8px] md:text-[9px] font-black text-scout-muted group-hover:text-scout-primary uppercase tracking-widest">
                                        {curso.modalidad}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[8px] md:text-[10px] font-bold text-scout-muted uppercase block mb-1">Nivel {curso.nivel}</span>
                                    <h3 className="text-sm md:text-md font-bold uppercase tracking-tight text-scout-primary">{curso.titulo}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FOOTER */}
            <footer className="py-12 md:py-24 text-center bg-scout-bg-card border-t border-scout-border">
                <p className="text-[10px] md:text-[12px] font-black text-scout-border uppercase tracking-[0.5em] md:tracking-[1.2em] px-4">
                    Scouts de Argentina • Distrito 3
                </p>
            </footer>
        </div>
    );
};

export default Home;
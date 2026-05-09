import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, MapPin, X, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. DATOS DE PRUEBA: CONSEJO (10 Integrantes para testear grid)
const CONSEJO_MOCK = [
    { id: 1, rol: "Director de Distrito", nombre: "Juan Pérez", mail: "director@gmail.com" },
    { id: 2, rol: "Asistente de Programa", nombre: "Marta Gómez", mail: "programa@gmail.com" },
    { id: 3, rol: "Asistente de Gestión", nombre: "Roberto Luz", mail: "gestion@gmail.com" },
    { id: 4, rol: "Asistente de Formación", nombre: "Ana Valle", mail: "formacion@gmail.com" },
    { id: 5, rol: "Secretario Distrital", nombre: "Lucía Sastre", mail: "secretaria@gmail.com" },
    { id: 6, rol: "Tesorero Distrital", nombre: "Marcos Paz", mail: "tesoreria@gmail.com" },
    { id: 7, rol: "Rama Castores", nombre: "Kevin Solo", mail: "castores@gmail.com" },
    { id: 8, rol: "Rama Lobatos", nombre: "Elena Rio", mail: "lobatos@gmail.com" },
    { id: 9, rol: "Rama Rovers", nombre: "Pedro Alva", mail: "rovers@gmail.com" },
    { id: 10, rol: "Comunicaciones", nombre: "Sonia Espejo", mail: "comu@gmail.com" },
];

// 2. DATOS DE PRUEBA: GRUPOS (Ordenados alfabéticamente)
const GRUPOS_MOCK = [
    { id: 1, nro: 8, nombre: "19 de Mayo", barrio: "Barrio Universitario", sede: "L. de la Torre 1200", info: "Grupo scout referente en la zona norte con más de 20 años de trayectoria.", link: "https://sites.google.com" },
    { id: 2, nro: 5, nombre: "Nuestra Señora de Fátima", barrio: "Barrio Fátima", sede: "Av. Alem 2300", info: "Especialistas en vida en la naturaleza y compromiso comunitario.", link: "https://sites.google.com" },
    { id: 3, nro: 1, nombre: "Nuestra Señora de Pompeya", barrio: "Barrio Pompeya", sede: "Av. Colón 80", info: "El primer grupo del distrito, cuna de grandes dirigentes del escultismo bahiense.", link: "https://sites.google.com" },
    { id: 4, nro: 15, nombre: "Perito Moreno", barrio: "Microcentro", sede: "Donado 400", info: "Grupo histórico fundado bajo los valores de servicio y hermandad.", link: "-" },
    { id: 5, nro: 22, nombre: "San Antonio de Padua", barrio: "Barrio San Antonio", sede: "Moreno 1500", info: "Enfoque educativo integral para todas las ramas y fuerte inserción barrial.", link: "https://sites.google.com" },
    { id: 6, nro: 3, nombre: "San Francisco de Asís", barrio: "Villa Mitre", sede: "Garibaldi 800", info: "Fuerte impronta solidaria y acompañamiento constante a las familias.", link: "-" },
    { id: 7, nro: 48, nombre: "San Jorge", barrio: "Centro", sede: "Gorriti 120", info: "Ubicado en el corazón de la ciudad, con amplia participación en foros juveniles.", link: "https://sites.google.com" },
    { id: 8, nro: 11, nombre: "San Pantaleón", barrio: "Barrio San Panta", sede: "Castelli 3200", info: "Dedicados a la formación de jóvenes líderes a través del juego y la acción.", link: "https://sites.google.com" },
    { id: 9, nro: 9, nombre: "San Pío X", barrio: "Barrio San Pío", sede: "Aguado 200", info: "Excelente trabajo en la progresión personal de los educandos.", link: "https://sites.google.com" },
];

const Distrito = () => {
    const [expandedGrupoId, setExpandedGrupoId] = useState(null);

    // --- LÓGICA DE BACKEND (PREPARADA Y COMENTADA) ---
    /* const [consejo, setConsejo] = useState([]);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        const loadDistritoData = async () => {
            try {
                const resConsejo = await axios.get('/api/consejo');
                const resGrupos = await axios.get('/api/grupos');
                
                // Los ordenamos alfabéticamente por nombre
                const sortedGrupos = resGrupos.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                
                setConsejo(resConsejo.data);
                setGrupos(sortedGrupos);
            } catch (error) {
                console.error("Error cargando datos de distrito", error);
            }
        };
        loadDistritoData();
    }, []); 
    */

    return (
        <div className="bg-neutral-50 font-sans selection:bg-black selection:text-white min-h-screen">
            
            {/* 1. SECCIÓN HERO: HEADER + MISIÓN + HISTORIA (100% ALTO) */}
            <div className="md:h-[calc(100vh-4.5rem)] flex flex-col">
                {/* HEADER (IDÉNTICO A NOTICIAS) */}
                <header className="md:h-[15vh] py-8 bg-white/80 backdrop-blur-md border-b border-neutral-200 flex flex-col justify-center px-6 md:px-20">
                    <div className="max-w-5xl mx-auto w-full text-left">
                        <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                            El <span className="text-black/20 italic">Distrito 3</span>
                        </h1>
                    </div>
                </header>

                {/* MISIÓN E HISTORIA (Resto de la pantalla) */}
                <main className="flex-grow flex items-center justify-center p-6 md:p-20">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                        <div className="space-y-6 text-left">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Nuestra Misión</h2>
                            <div className="h-1 w-12 bg-black mb-6" />
                            <p className="text-neutral-500 leading-relaxed text-sm md:text-lg">
                                Contribuir a la educación de los jóvenes, a través de un sistema de valores basado en la Ley y la Promesa Scout, para ayudar a construir un mundo mejor donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad.
                            </p>
                        </div>
                        <div className="space-y-6 text-left border-l border-neutral-200 md:pl-20">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Nuestra Historia</h2>
                            <div className="h-1 w-12 bg-black mb-6" />
                            <p className="text-neutral-500 leading-relaxed text-sm md:text-lg">
                                El Distrito 3 - Zona 13, con sede en Bahía Blanca, nace de la unión de grupos scouts históricos. Somos herederos de una tradición de servicio que se renueva año tras año, potenciando el impacto educativo en cada barrio.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* 2. CONSEJO DISTRITAL (Grid de 5 columnas en desktop) */}
            <section className="bg-white py-24 px-6 md:px-20 border-y border-neutral-100">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-16 flex items-center gap-4">
                        Consejo Distrital <div className="h-1 w-12 bg-black" />
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {CONSEJO_MOCK.map((pers) => (
                            <div key={pers.id} className="p-8 rounded-[2rem] border border-neutral-100 bg-neutral-50/50 hover:shadow-xl transition-all text-left">
                                <span className="text-[9px] font-black uppercase text-neutral-400 block mb-2">{pers.rol}</span>
                                <h3 className="text-sm font-bold uppercase mb-4 leading-tight">{pers.nombre}</h3>
                                <a href={`mailto:${pers.mail}`} className="text-[10px] font-black uppercase border-b border-black/10 hover:border-black transition-colors">Contactar</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. GRUPOS SCOUTS (Grid de 3 columnas) */}
            <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-16 flex items-center gap-4">
                    Grupos del Distrito <div className="h-1 w-12 bg-black" />
                </h2>
                {/* GRUPOS EN FILAS DE 3 (lg:grid-cols-3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GRUPOS_MOCK.map((grupo) => (
                        <article 
                            key={grupo.id} 
                            onClick={() => setExpandedGrupoId(grupo.id)}
                            className="group relative bg-white rounded-[2rem] border border-neutral-100 p-6 flex flex-row items-center justify-between cursor-pointer hover:shadow-xl transition-all md:h-[15vh]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                                    #{grupo.nro}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-bold uppercase tracking-tight leading-none mb-1">{grupo.nombre}</h3>
                                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={10}/> {grupo.barrio}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-300" />
                        </article>
                    ))}
                </div>
            </section>

            {/* --- SÚPER MODAL DE AMPLIACIÓN (IGUAL A NOTICIAS/CURSOS) --- */}
            {expandedGrupoId && (() => {
                const g = GRUPOS_MOCK.find(item => item.id === expandedGrupoId);
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setExpandedGrupoId(null)} />
                        <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 text-left">
                            <button onClick={() => setExpandedGrupoId(null)} className="absolute top-6 right-6 z-10 p-2 bg-black text-white rounded-full hover:rotate-90 transition-all">
                                <X size={20} />
                            </button>

                            <div className="md:w-1/3 bg-neutral-900 flex flex-col items-center justify-center text-white p-12 text-center space-y-6">
                                <div className="text-7xl font-black opacity-20">#{g.nro}</div>
                                <p className="text-xl font-black uppercase">Grupo Scout<br/>{g.nombre}</p>
                            </div>

                            <div className="md:w-2/3 p-8 md:p-16 overflow-y-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 block mb-4">Ficha Institucional</span>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-10">G.S. {g.nombre}</h2>
                                
                                <div className="space-y-8 border-y border-neutral-100 py-10 mb-8">
                                    <div className="flex gap-4">
                                        <MapPin className="text-neutral-300" />
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Sede y Dirección</p>
                                            <p className="text-sm font-bold uppercase">{g.sede} • {g.barrio}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Info className="text-neutral-300" />
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Acerca del Grupo</p>
                                            <p className="text-neutral-500 leading-relaxed text-sm">{g.info}</p>
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

export default Distrito;
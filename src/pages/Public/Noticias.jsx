import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NOTICIAS_MOCK = [
    { id: 1, titulo: "CONVOCATORIA ASAMBLEA DISTRITAL 2026", fecha: "2026-04-25", contenido: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ", categoria: "Institucional" },
    { id: 2, titulo: "ACTUALIZACIÓN DE FICHAS MÉDICAS", fecha: "2026-04-20", contenido: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", categoria: "Seguridad" },
    { id: 3, titulo: "CURSO DE FORMACIÓN: RAMA SCOUT", fecha: "2026-04-15", contenido: "Se invita a los educadores con esquema inicial completo a participar de las jornadas de formación presencial que se dictarán en la Zona 22. Los módulos abarcarán: Vida en la naturaleza, Progresión personal y Animación de la unidad.", categoria: "Formación" },
    { id: 4, titulo: "EVENTO: CELEBRACIÓN DE SAN JORGE", fecha: "2026-04-10", contenido: "Bajo el lema 'Construyendo el futuro', el Distrito 3 se reunirá el próximo 23 de abril para celebrar nuestro patrono en el Parque de Mayo. Se espera la participación de los 12 grupos scout con actividades para todas las ramas.", categoria: "Eventos" },
    { id: 5, titulo: "COMUNICADO SOBRE SEGUROS DE VIDA", fecha: "2026-04-05", contenido: "La oficina nacional ha enviado el nuevo protocolo de actuación ante accidentes. Es fundamental que cada Jefe de Grupo tenga una copia física del reporte de siniestro y el contacto de la aseguradora en su kit de primeros auxilios.", categoria: "Oficial" },
    { id: 6, titulo: "FORO DISTRITAL DE JÓVENES 2026", fecha: "2026-04-01", contenido: "El Foro Distrital es el espacio donde los jóvenes toman la palabra. Este año los ejes temáticos serán: Salud Mental en la Juventud, Liderazgo Ético y Sustentabilidad en Campamentos. Las conclusiones serán elevadas al Consejo de Zona.", categoria: "Participación" },
    { id: 7, titulo: "JORNADA DE SERVICIO: ARROYO NAPOSTÁ", fecha: "2026-03-28", contenido: "En el marco del compromiso ambiental scout, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. nos reuniremos en la zona del Paseo de las Esculturas para realizar una limpieza de residuos sólidos en la ribera del arroyo. Se proveerá de guantes y bolsas reforzadas a todos.", categoria: "Servicio" },
    { id: 8, titulo: "CIRCULAR: TRANSPORTE EN ACTIVIDADES", fecha: "2026-03-22", contenido: "Se recuerda a los Jefes de Unidad que toda unidad de transporte contratada debe presentar: VTV vigente para transporte de pasajeros, seguro de responsabilidad civil actualizado y habilitación de la CNRT para operar.", categoria: "Oficial" },
    { id: 9, titulo: "LANZAMIENTO DEL ROVER MOOT 2026", fecha: "2026-03-15", contenido: "Bajo el lema 'Remar contra la corriente', se abren las pre-inscripciones para el Moot Distrital. Contaremos con tres rutas de servicio y una jornada final de reflexión en el Campo Escuela para toda la rama.", categoria: "Eventos" },
    { id: 10, titulo: "SEMINARIO: PRIMEROS AUXILIOS AGRESTES", fecha: "2026-03-10", contenido: "Capacitación dictada por profesionales de la salud con experiencia en medicina de montaña. Se abordarán protocolos de estabilización, traslados improvisados y manejo de traumas en contextos de difícil acceso médico.", categoria: "Formación" },
    { id: 11, titulo: "BALANCE FINANCIERO ANUAL", fecha: "2026-03-05", contenido: "Dando cumplimiento a los estatutos, la tesorería distrital presenta el informe auditado del ejercicio anterior. El mismo detalla la inversión en materiales para el campo escuela y becas de formación para educadores.", categoria: "Institucional" },
    { id: 12, titulo: "MEJORAS EN EL CAMPO ESCUELA", fecha: "2026-02-25", contenido: "Gracias al aporte de los grupos y donaciones, hemos terminado la reconstrucción del sector de cocina común. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Se instalaron nuevas luminarias LED y se reforzó el cerco perimetral para mayor seguridad de las unidades.", categoria: "Infraestructura" },
    { id: 13, titulo: "FESTIVAL DE LA CANCIÓN SCOUT", fecha: "2026-02-18", contenido: "Buscamos la canción que representará al Distrito 3 en el certamen nacional. Las letras deben reflejar los valores de la ley scout y la identidad bahiense. Las audiciones se realizarán en el salón de actos del Grupo 12.", categoria: "Cultura" },
    { id: 14, titulo: "TALLER: REDES INSTITUCIONALES", fecha: "2026-02-10", contenido: "Capacitación para auxiliares de comunicación sobre el uso de marca y privacidad. Protocolos para el manejo de imágenes de menores en redes sociales y directrices de comunicación institucional para todos los grupos.", categoria: "Comunicación" },
    { id: 15, titulo: "CONCURSO: INSIGNIA DISTRITAL 2026", fecha: "2026-02-01", contenido: "El concurso está abierto a todas las ramas. El diseño debe incluir la Flor de Lis, la mención 'Distrito 3' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. y algún elemento representativo de la ciudad de Bahía Blanca. El ganador obtendrá un kit de campamento.", categoria: "Diseño" },
    { id: 16, titulo: "PLAN DE EMERGENCIAS DISTRITAL", fecha: "2026-01-25", contenido: "Dada la recurrencia de temporales en la zona, se ha actualizado la matriz de riesgo distrital. Se definen nuevos puntos de evacuación y un sistema de comunicación por radio frecuencia en caso de caída de redes.", categoria: "Seguridad" },
    { id: 17, titulo: "PROYECTO: HUERTA COMUNITARIA", fecha: "2026-01-18", contenido: "Iniciativa conjunta para transformar un baldío en un espacio de producción de alimentos y educación ambiental en el barrio Harding Green. Se invita a los grupos a donar semillas y herramientas de mano.", categoria: "Servicio" },
    { id: 18, titulo: "RESULTADOS ELECCIÓN CONSEJO", fecha: "2026-01-10", contenido: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Tras la asamblea electoral, se anuncian los nombres de quienes integrarán el Consejo Distrital. Se agradece la gestión saliente por su compromiso en la digitalización de procesos y se da la bienvenida a los nuevos comisionados.", categoria: "Institucional" }
];

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
                        Noticias <span className="font-black italic">Distritales</span>
                    </h1>
                    <div className="h-px w-12 bg-black mt-4 opacity-20" />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                        Mostrando {currentNoticias.length} de {totalItems} comunicados
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
                    {currentNoticias.map((noticia) => (
                        <article 
                            key={noticia.id} 
                            className={`group relative border border-neutral-200 p-5 transition-all bg-white/60 backdrop-blur-sm hover:shadow-lg ${
                                expandedId === noticia.id ? 'md:col-span-2 border-black bg-white' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                                    {noticia.categoria}
                                </span>
                                <span className="text-[9px] font-bold text-neutral-300">
                                    {new Date(noticia.fecha).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className={`text-lg font-bold tracking-tight uppercase leading-tight mb-2 ${
                                expandedId === noticia.id ? 'text-xl' : ''
                            }`}>
                                {noticia.titulo}
                            </h2>

                            {/* CORRECCIÓN 1: Lógica automática con line-clamp-2 */}
                            <p className={`text-xs text-neutral-500 leading-relaxed mb-4 transition-all duration-300 ${
                                expandedId === noticia.id ? '' : 'line-clamp-2'
                            }`}>
                                {noticia.contenido}
                            </p>

                            <button 
                                onClick={() => toggleExpand(noticia.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black border-b border-black/10 hover:border-black transition-all"
                            >
                                {expandedId === noticia.id ? 'Cerrar noticia' : 'Leer completa'} 
                                {expandedId === noticia.id ? <ChevronUp size={12}/> : <ChevronDown size={12} />}
                            </button>
                        </article>
                    ))}
                </div>

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

export default Noticias;
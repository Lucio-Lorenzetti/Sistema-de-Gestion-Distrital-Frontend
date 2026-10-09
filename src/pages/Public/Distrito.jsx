import React, { useState, useEffect } from 'react';
import { Mail, X, ArrowRight, User, MapPin, Phone, Info, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

// Tótem arriba y nombre real chico entre paréntesis; sin tótem, el nombre va arriba.
const NombreScout = ({ persona, className = '' }) => (
    <div className={className}>
        <h3 className="text-sm font-bold uppercase leading-tight text-[var(--color-scout-ink)]">{persona.totem || persona.name}</h3>
        {persona.totem && <p className="text-[10px] font-bold uppercase text-[var(--color-scout-muted)] mt-1">({persona.name})</p>}
    </div>
);

// "000" es el placeholder del seeder para grupos sin número cargado.
const numeroGrupo = (numero) => (numero && Number(numero) !== 0 ? `#${numero}` : 'S/N');

// El Jefe de Grupo puede cargar "@usuario" o el link completo.
const linkRed = (valor, base) => {
    if (/^https?:\/\//i.test(valor)) return valor;
    if (/^(www\.)?(instagram|facebook)\.com\//i.test(valor)) return `https://${valor}`;
    return `${base}${valor.replace(/^@/, '')}`;
};

// Lo que se muestra: "@usuario" si se puede sacar del link, si no "Ver perfil".
const textoRed = (valor) => {
    const usuario = valor
        .replace(/^https?:\/\//i, '')
        .replace(/^(www\.|m\.)?(instagram|facebook)\.com\//i, '')
        .replace(/^@/, '')
        .split(/[/?#]/)[0];
    return usuario && !/^profile\.php$/i.test(usuario) ? `@${usuario}` : 'Ver perfil';
};

// lucide-react ya no trae íconos de marcas.
const IconoInstagram = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const IconoFacebook = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

// Fila de la ficha del grupo; si el dato no está cargado no se muestra.
const DatoGrupo = ({ icono, label, children }) => {
    const Icono = icono;
    return (
    <div className="flex gap-4">
        <Icono className="text-[var(--color-scout-muted)] shrink-0" />
        <div className="min-w-0">
            <p className="text-[9px] font-black text-[var(--color-scout-muted)] uppercase tracking-widest mb-1">{label}</p>
            {children}
        </div>
    </div>
    );
};

// wa.me necesita el número internacional sin "+": para Argentina 549 + área + número.
// Se aceptan formatos locales tipo "0291 15-463-6319" o "2914636319".
const linkWhatsapp = (telefono) => {
    let digitos = telefono.replace(/\D/g, '');
    if (!digitos.startsWith('54')) {
        digitos = digitos.replace(/^0/, '');
        // El "15" de celular va después del código de área (2 a 4 dígitos); wa.me no lo usa.
        digitos = digitos.replace(/^(\d{2,4})15(\d{6,8})$/, (m, area, num) => (area.length + num.length === 10 ? area + num : m));
        digitos = `549${digitos}`;
    }
    return `https://wa.me/${digitos}?text=${encodeURIComponent('¡Hola! Te escribo desde la página del Distrito 3.')}`;
};

const claseLinkDato ='text-sm font-bold text-[var(--color-scout-ink)] hover:text-[var(--color-scout-primary)] transition-colors break-all';

const Distrito = () => {
    const [expandedGrupoId, setExpandedGrupoId] = useState(null);
    const [consejo, setConsejo] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get('/distrito')
            .then(({ data }) => {
                setConsejo(data.consejo);
                setGrupos(data.grupos);
            })
            .catch((err) => {
                console.error('Error al cargar datos del distrito:', err);
                setError(true);
            })
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        if (!expandedGrupoId) return;
        const cerrarConEscape = (e) => {
            if (e.key === 'Escape') setExpandedGrupoId(null);
        };
        const overflowPrevio = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', cerrarConEscape);
        return () => {
            document.body.style.overflow = overflowPrevio;
            window.removeEventListener('keydown', cerrarConEscape);
        };
    }, [expandedGrupoId]);

    const estadoVacio = (texto) => (
        <p className="text-sm text-[var(--color-scout-muted)] text-left">{texto}</p>
    );

    return (
        <div className="bg-[var(--color-scout-bg-panel)] font-sans selection:bg-[var(--color-scout-primary)] selection:text-white min-h-screen">

            <div className="md:h-[calc(100vh-4.5rem)] flex flex-col">
                <header className="md:h-[15vh] py-8 bg-[var(--color-scout-bg-card)]/80 backdrop-blur-md border-b border-[var(--color-scout-border)] flex flex-col justify-center px-6 md:px-20">
                    <div className="max-w-5xl mx-auto w-full text-left">
                        <h1 className="text-2xl md:text-4xl font-black text-[var(--color-scout-ink)] tracking-tighter uppercase leading-none">
                            El <span className="text-[var(--color-scout-primary)] italic">Distrito 3</span>
                        </h1>
                    </div>
                </header>

                <main className="flex-grow flex items-center justify-center p-6 md:p-20">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                        <div className="space-y-6 text-left">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[var(--color-scout-ink)]">Nuestra Misión</h2>
                            <div className="h-1 w-12 bg-[var(--color-scout-primary)] mb-6" />
                            <p className="text-[var(--color-scout-muted)] leading-relaxed text-sm md:text-lg">
                                Contribuir a la educación de los jóvenes, a través de un sistema de valores basado en la Ley y la Promesa Scout, para ayudar a construir un mundo mejor donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad.
                            </p>
                        </div>
                        <div className="space-y-6 text-left md:border-l border-[var(--color-scout-border)] md:pl-20">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[var(--color-scout-ink)]">Nuestra Historia</h2>
                            <div className="h-1 w-12 bg-[var(--color-scout-primary)] mb-6" />
                            <p className="text-[var(--color-scout-muted)] leading-relaxed text-sm md:text-lg">
                                El Distrito 3 - Zona 13, con sede en Bahía Blanca, nace de la unión de grupos scouts históricos. Somos herederos de una tradición de servicio que se renueva año tras año, potenciando el impacto educativo en cada barrio.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <section className="bg-[var(--color-scout-bg-card)] py-16 md:py-24 px-6 md:px-20 border-y border-[var(--color-scout-border)]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 md:mb-16 flex items-center gap-4 text-[var(--color-scout-ink)]">
                        Consejo Distrital <div className="h-1 w-12 bg-[var(--color-scout-primary)]" />
                    </h2>
                    {cargando ? estadoVacio('Cargando...') : error ? estadoVacio('No se pudo cargar el Consejo Distrital.') : consejo.length === 0 ? estadoVacio('Todavía no hay integrantes cargados.') : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {consejo.map((pers) => (
                            <div key={`${pers.user_id}-${pers.rol}-${pers.rama}`} className="p-8 rounded-[2rem] border border-[var(--color-scout-border)] bg-[var(--color-scout-bg-panel)]/50 hover:shadow-xl transition-all text-left">
                                <span className="text-[9px] font-black uppercase text-[var(--color-scout-muted)] block mb-2">{pers.rol}{pers.rama && ` · ${pers.rama}`}</span>
                                <NombreScout persona={pers} className="mb-4" />
                                <a href={`mailto:${pers.email}`} className="text-[10px] font-black uppercase text-[var(--color-scout-primary)] border-b border-[var(--color-scout-primary)]/10 hover:border-[var(--color-scout-primary)] transition-colors">Contactar</a>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-24 px-6 md:px-20 max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 md:mb-16 flex items-center gap-4 text-[var(--color-scout-ink)]">
                    Grupos del Distrito <div className="h-1 w-12 bg-[var(--color-scout-accent)]" />
                </h2>
                {cargando ? estadoVacio('Cargando...') : error ? estadoVacio('No se pudieron cargar los grupos.') : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grupos.map((grupo) => (
                        <article
                            key={grupo.id}
                            onClick={() => setExpandedGrupoId(grupo.id)}
                            className="group relative bg-[var(--color-scout-bg-card)] rounded-[2rem] border border-[var(--color-scout-border)] p-6 flex flex-row items-center justify-between cursor-pointer hover:shadow-xl transition-all md:h-[15vh]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 shrink-0 bg-[var(--color-scout-accent)] text-white rounded-xl overflow-hidden flex items-center justify-center font-black text-base group-hover:scale-110 transition-transform">
                                    {grupo.foto_url ? (
                                        <img src={grupo.foto_url} alt={grupo.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        numeroGrupo(grupo.numero)
                                    )}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-bold uppercase tracking-tight leading-none mb-1 text-[var(--color-scout-ink)]">{grupo.nombre}</h3>
                                    <p className="text-[9px] text-[var(--color-scout-muted)] font-bold uppercase tracking-widest">
                                        {grupo.jefe ? `Jefe: ${grupo.jefe.totem || grupo.jefe.name}` : 'Sin Jefe de Grupo'}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[var(--color-scout-muted)]" />
                        </article>
                    ))}
                </div>
                )}
            </section>

            {expandedGrupoId && (() => {
                const g = grupos.find(item => item.id === expandedGrupoId);
                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-[var(--color-scout-scrim)]/60 backdrop-blur-md" onClick={() => setExpandedGrupoId(null)} />
                        <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-300">
                            <button onClick={() => setExpandedGrupoId(null)} className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 bg-[var(--color-scout-primary)] text-white rounded-full hover:rotate-90 transition-all">
                                <X size={20} />
                            </button>
                        {/* En mobile scrollea el panel entero (columnas apiladas); en desktop, solo la columna de texto. */}
                        <div className="bg-[var(--color-scout-bg-card)] w-full max-h-[85vh] rounded-[2rem] md:rounded-[3rem] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row text-left">

                            {g.foto_url ? (
                                <div className="md:w-1/3 relative bg-[var(--color-scout-accent)] min-h-[14rem] shrink-0">
                                    <img src={g.foto_url} alt={g.nombre} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 inset-x-0 p-8 text-white text-center">
                                        <p className="text-3xl font-black">{numeroGrupo(g.numero)}</p>
                                        <p className="text-lg font-black uppercase">Grupo Scout<br />{g.nombre}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="md:w-1/3 bg-[var(--color-scout-accent)] flex flex-col items-center justify-center text-white p-8 md:p-12 text-center space-y-4 md:space-y-6 shrink-0">
                                    <div className="text-5xl md:text-7xl font-black opacity-20">{numeroGrupo(g.numero)}</div>
                                    <p className="text-xl font-black uppercase">Grupo Scout<br />{g.nombre}</p>
                                </div>
                            )}

                            <div className="md:w-2/3 p-6 md:p-16 md:overflow-y-auto">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-scout-muted)] block mb-4">Ficha Institucional</span>
                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 md:mb-10 break-words text-[var(--color-scout-ink)]">G.S. {g.nombre}</h2>

                                <div className="space-y-6 md:space-y-8 border-y border-[var(--color-scout-border)] py-6 md:py-10 mb-4 md:mb-8">
                                    {g.descripcion && (
                                        <DatoGrupo icono={Info} label="Acerca del Grupo">
                                            <p className="text-[var(--color-scout-muted)] leading-relaxed text-sm whitespace-pre-line">{g.descripcion}</p>
                                        </DatoGrupo>
                                    )}
                                    {g.direccion && (
                                        <DatoGrupo icono={MapPin} label="Sede">
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${g.direccion}, Bahía Blanca`)}`} target="_blank" rel="noopener noreferrer" className={claseLinkDato}>{g.direccion}</a>
                                        </DatoGrupo>
                                    )}
                                    {g.telefono && (
                                        <DatoGrupo icono={Phone} label="Teléfono">
                                            <a href={`tel:${g.telefono.replace(/[^\d+]/g, '')}`} className={claseLinkDato}>{g.telefono}</a>
                                        </DatoGrupo>
                                    )}
                                    {g.instagram && (
                                        <DatoGrupo icono={IconoInstagram} label="Instagram">
                                            <a href={linkRed(g.instagram, 'https://instagram.com/')} target="_blank" rel="noopener noreferrer" className={claseLinkDato}>{textoRed(g.instagram)}</a>
                                        </DatoGrupo>
                                    )}
                                    {g.facebook && (
                                        <DatoGrupo icono={IconoFacebook} label="Facebook">
                                            <a href={linkRed(g.facebook, 'https://facebook.com/')} target="_blank" rel="noopener noreferrer" className={claseLinkDato}>{textoRed(g.facebook)}</a>
                                        </DatoGrupo>
                                    )}
                                    <DatoGrupo icono={User} label="Jefe de Grupo">
                                        {g.jefe ? (
                                            <>
                                                <NombreScout persona={g.jefe} className="mb-4" />
                                                {g.telefono && g.telefono_whatsapp ? (
                                                    <a href={linkWhatsapp(g.telefono)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[var(--color-scout-primary)] border-b border-[var(--color-scout-primary)]/10 hover:border-[var(--color-scout-primary)] transition-colors">
                                                        <MessageCircle size={12} /> Contactar por WhatsApp
                                                    </a>
                                                ) : (
                                                    <a href={`mailto:${g.jefe.email}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[var(--color-scout-primary)] border-b border-[var(--color-scout-primary)]/10 hover:border-[var(--color-scout-primary)] transition-colors">
                                                        <Mail size={12} /> Contactar
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-[var(--color-scout-muted)]">Todavía no hay un Jefe de Grupo designado.</p>
                                        )}
                                    </DatoGrupo>
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
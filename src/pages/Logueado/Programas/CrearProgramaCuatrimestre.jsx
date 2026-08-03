// src/pages/Logueado/Programas/CrearProgramaCuatrimestre.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Send, ArrowLeft } from 'lucide-react';

// --- Helpers de fecha (parseo local, evita el corrimiento de un día por UTC) ---
const parseFechaLocal = (isoDate) => {
    if (!isoDate) return null;
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const formatDDMM = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
};

const obtenerSabados = (inicio, fin) => {
    const sabados = [];
    if (!inicio || !fin || inicio > fin) return sabados;
    const cursor = new Date(inicio);
    while (cursor <= fin) {
        if (cursor.getDay() === 6) sabados.push(formatDDMM(new Date(cursor)));
        cursor.setDate(cursor.getDate() + 1);
    }
    return sabados;
};

const generarTemplate = (inicio, fin) => {
    const sabados = obtenerSabados(inicio, fin);

    const intro = 'Este Template es para unificar criterios mínimos de un programa de cuatrimestre para el distrito, se pide que de base se respete la información solicitada, y en el caso de querer agregar cosas es bienvenido, dicho programa se generará a partir de los datos ingresados en el paso anterior más la descripción ingresada acá';

    const listaSabados = sabados.length > 0
        ? sabados.map((f) => `${f} - Actividad 1/Título X`).join('\n')
        : '(Seleccioná fecha de inicio y fecha de fin para generar los sábados automáticamente)';

    const anexo = 'Anexo 1/Título X:\nObjetivo de la Actividad: . . .\nDesarrollo de la actividad: . . .\nResponsables: . . .';

    return `${intro}\n\nSÁBADOS/FECHAS\n${listaSabados}\n\nANEXOS\n${anexo}`;
};

const CrearProgramaCuatrimestre = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosPasoUno = location.state;

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [contenido, setContenido] = useState('');
    const [error, setError] = useState(null);

    const sabadosCount = useMemo(() => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);
        return obtenerSabados(inicio, fin).length;
    }, [fechaInicio, fechaFin]);

    // Si entraron directo a esta URL sin pasar por el paso 1, no hay título/diagnóstico/etc.
    if (!datosPasoUno?.titulo) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-scout-bg-panel p-10 text-center">
                <p className="text-sm font-bold text-scout-muted uppercase tracking-tight">
                    Te faltó completar el primer paso.
                </p>
                <Link
                    to="/gestion-programas/crear"
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors"
                >
                    <ArrowLeft size={14} /> Volver a Crear Programa
                </Link>
            </div>
        );
    }

    const handleGenerarPlantilla = () => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);

        if (!inicio || !fin) {
            setError('Elegí fecha de inicio y fecha de fin antes de generar la plantilla.');
            return;
        }
        if (inicio > fin) {
            setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        setError(null);
        setContenido(generarTemplate(inicio, fin));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fechaInicio || !fechaFin) {
            setError('Completá fecha de inicio y fecha de fin.');
            return;
        }
        if (!contenido.trim()) {
            setError('Generá o escribí el contenido del programa antes de crear.');
            return;
        }

        setError(null);

        const payload = {
            ...datosPasoUno,
            fechaInicio,
            fechaFin,
            contenido,
        };

        // TODO (Fase 7 backend): conectar a POST /programas una vez que se agreguen
        // las columnas `tipo` y `educadores_a_cargo` a la tabla `programs`.
        console.log('Payload listo para el backend:', payload);
        navigate('/gestion-programas');
    };

    return (
        <div className="h-full w-full flex flex-col bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white p-6 md:p-10 overflow-hidden text-left">
            <div
                className="bg-scout-bg-panel text-left relative"
                style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem' }}
            >
                {/* HEADER */}
                <div className="border-b border-scout-border pb-4 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Panel de Control Privado • Gestión de Programas
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Programa de Cuatrimestre
                    </h1>
                    <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                        {datosPasoUno.titulo}
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 mt-4 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 uppercase tracking-wide shrink-0">
                        {error}
                    </div>
                )}

                {/* FORMULARIO PRINCIPAL */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col min-h-0 overflow-y-auto mt-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Fecha de Inicio de Cuatrimestre
                            </label>
                            <div className="relative">
                                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Fecha de Fin de Cuatrimestre
                            </label>
                            <div className="relative">
                                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 mb-2 shrink-0 flex-wrap gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                            Contenido del Programa {sabadosCount > 0 && `— ${sabadosCount} sábado${sabadosCount > 1 ? 's' : ''} en el rango`}
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerarPlantilla}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-primary text-scout-primary hover:bg-scout-primary hover:text-white transition-colors cursor-pointer"
                        >
                            <RefreshCw size={12} /> Generar plantilla con estas fechas
                        </button>
                    </div>

                    <textarea
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        required
                        placeholder="Elegí las fechas y tocá 'Generar plantilla', o escribí libremente acá."
                        className="w-full flex-1 border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[280px] whitespace-pre-wrap"
                    />

                    {/* BOTONES DE ACCIÓN */}
                    <div className="mt-8 pt-6 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
                        <Link
                            to="/gestion-programas/crear"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Volver
                        </Link>

                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md hover:shadow-lg cursor-pointer bg-scout-primary hover:bg-scout-primary-hover text-white"
                        >
                            Crear Programa <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearProgramaCuatrimestre;
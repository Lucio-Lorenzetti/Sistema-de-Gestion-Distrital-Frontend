// src/pages/Logueado/Programas/CrearProgramaCampamento.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Send, ArrowLeft, MapPin, Wallet, Bus } from 'lucide-react';
import api from '../../../api/axios';
import RichTextToolbar from '../../../components/ui/RichTextToolbar';
import {
    parseFechaLocal,
    obtenerDiasRango,
    linea,
    agregarTextoMultilinea,
    generarCronogramaDia,
    lineasToHtml,
    sincronizarActividades,
    DISCLAIMER_PLANTILLA,
} from './plantillaPrograma';

const buildTemplateLineas = (datos, inicio, fin) => {
    const dias = obtenerDiasRango(inicio, fin);
    const lineas = [];

    lineas.push(linea([{ text: DISCLAIMER_PLANTILLA.campamento, bold: false, color: '#9ca3af' }]));
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'Título', bold: true }]));
    agregarTextoMultilinea(lineas, datos.titulo);
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'Educadores a Cargo', bold: true }]));
    agregarTextoMultilinea(lineas, datos.educadoresACargo);
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'Diagnóstico', bold: true }]));
    agregarTextoMultilinea(lineas, datos.diagnostico);
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'Objetivo', bold: true }]));
    agregarTextoMultilinea(lineas, datos.objetivos);
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'CRONOGRAMA DE ACTIVIDADES', bold: true }]));

    let totalActividadesGeneradas = 0;

    if (dias.length > 0) {
        const contadorActividadRef = { val: 1 };

        dias.forEach((dia, index) => {
            lineas.push(
                linea([
                    { text: `${dia.nombreDia} ${dia.fechaFormatted}`, bold: true },
                ])
            );

            const horarios = generarCronogramaDia(
                index === 0,
                index === dias.length - 1,
                contadorActividadRef
            );
            horarios.forEach((h) => {
                // Le pone data-actividad-ref al texto "Actividad N" (no a la hora), así al
                // editarlo se sincroniza con el "Anexo Actividad N" de más abajo — ver
                // sincronizarActividades().
                const matchActividad = h.desc.match(/^Actividad (\d+)$/);
                lineas.push(
                    linea([
                        { text: `${h.hora} `, bold: true },
                        { text: h.desc, bold: !!matchActividad, actividadRef: matchActividad ? Number(matchActividad[1]) : undefined },
                    ])
                );
            });

            lineas.push(linea(''));
        });

        totalActividadesGeneradas = contadorActividadRef.val - 1;
    } else {
        lineas.push(
            linea(
                '(Seleccioná fecha de inicio y fecha de fin para generar el cronograma automáticamente)'
            )
        );
        lineas.push(linea(''));
    }

    lineas.push(linea([{ text: 'ANEXOS', bold: true }]));
    if (totalActividadesGeneradas > 0) {
        for (let i = 1; i <= totalActividadesGeneradas; i++) {
            lineas.push(linea([
                { text: 'Anexo ', bold: true },
                { text: `Actividad ${i}`, bold: true, actividadRef: i },
                { text: ':', bold: true },
            ]));
            lineas.push(linea('Objetivo de la Actividad: . . .'));
            lineas.push(linea('Desarrollo de la actividad: . . .'));
            lineas.push(linea('Responsables: . . .'));
            lineas.push(linea('Área de crecimiento: . . .'));
            lineas.push(linea(''));
        }
    } else {
        lineas.push(linea([{ text: 'Anexo 1 / Actividad X:', bold: true }]));
        lineas.push(linea('Objetivo de la Actividad: . . .'));
        lineas.push(linea('Desarrollo de la actividad: . . .'));
        lineas.push(linea('Responsables: . . .'));
        lineas.push(linea('Área de crecimiento: . . .'));
    }

    return lineas;
};

const CrearProgramaCampamento = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosPasoUno = location.state;
    const contenidoRef = useRef(null);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [lugar, setLugar] = useState('');
    const [valor, setValor] = useState('');
    const [transporte, setTransporte] = useState('');
    const [contenidoVacio, setContenidoVacio] = useState(true);
    const [error, setError] = useState(null);

    const diasCount = useMemo(() => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);
        return obtenerDiasRango(inicio, fin).length;
    }, [fechaInicio, fechaFin]);

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

        const hayContenido = contenidoRef.current?.innerText?.trim();
        if (hayContenido && !window.confirm('Esto va a reemplazar el contenido que ya escribiste. ¿Continuar?')) {
            return;
        }

        setError(null);
        const lineas = buildTemplateLineas(datosPasoUno, inicio, fin);
        if (contenidoRef.current) {
            contenidoRef.current.innerHTML = lineasToHtml(lineas);
        }
        setContenidoVacio(false);
    };

    const handleContenidoInput = () => {
        const texto = contenidoRef.current?.innerText ?? '';
        setContenidoVacio(texto.trim().length === 0);
        sincronizarActividades(contenidoRef.current);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fechaInicio || !fechaFin) {
            setError('Completá fecha de inicio y fecha de fin.');
            return;
        }

        const contenidoTexto = contenidoRef.current?.innerText?.trim() ?? '';
        if (!contenidoTexto) {
            setError('Generá o escribí el contenido del programa antes de crear.');
            return;
        }

        setError(null);

        const contenidoHtmlActual = contenidoRef.current.innerHTML;
        const payload = {
            ...datosPasoUno,
            tipo: 'campamento',
            fechaInicio,
            fecha_inicio: fechaInicio,
            fechaFin,
            fecha_fin: fechaFin,
            educadores_a_cargo: datosPasoUno.educadoresACargo,
            contenidoHtml: contenidoHtmlActual,
            contenido_html: contenidoHtmlActual,
            lugar,
            valor,
            transporte,
        };

        try {
            const response = await api.post('/programas', payload);

            if (response.status === 201 || response.status === 200) {
                navigate('/gestion-programas');
            }
        } catch (err) {
            console.error('Error al guardar el programa:', err);
            const errorMsg = err.response?.data?.message || 'Ocurrió un error al guardar el programa.';
            setError(errorMsg);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white p-6 md:p-10 overflow-hidden text-left">
            <div
                className="bg-scout-bg-panel text-left relative"
                style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem' }}
            >
                <div className="border-b border-scout-border pb-4 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Panel de Control Privado • Gestión de Programas
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Programa de Campamento
                    </h1>
                    <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                        {datosPasoUno.titulo}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 mt-4 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col min-h-0 overflow-y-auto mt-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Fecha de Inicio
                            </label>
                            <div className="relative">
                                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Fecha de Fin
                            </label>
                            <div className="relative">
                                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0 mt-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Lugar
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="text"
                                    value={lugar}
                                    onChange={(e) => setLugar(e.target.value)}
                                    placeholder="Ej: Predio Scout Bahía Blanca"
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Valor
                            </label>
                            <div className="relative">
                                <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="text"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    placeholder="Ej: $15.000"
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Transporte / Lugar de concentración
                            </label>
                            <div className="relative">
                                <Bus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted pointer-events-none" />
                                <input
                                    type="text"
                                    value={transporte}
                                    onChange={(e) => setTransporte(e.target.value)}
                                    placeholder="Ej: Sede del grupo, 8hs"
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 mb-2 shrink-0 flex-wrap gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                            Contenido del Programa {diasCount > 0 && `— ${diasCount} día${diasCount > 1 ? 's' : ''} de campamento`}
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerarPlantilla}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-primary text-scout-primary hover:bg-scout-primary hover:text-white transition-colors cursor-pointer"
                        >
                            <RefreshCw size={12} /> Generar plantilla con estas fechas
                        </button>
                    </div>

                    {contenidoVacio && (
                        <p className="text-xs text-scout-muted italic mb-2">
                            Vacío — tocá "Generar plantilla" o escribí libremente acá abajo.
                        </p>
                    )}

                    <RichTextToolbar />

                    <div
                        ref={contenidoRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContenidoInput}
                        className="w-full border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-ink font-normal focus:outline-none focus:border-scout-primary transition-colors mb-4 shrink-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                        style={{ minHeight: 280 }}
                    />

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

export default CrearProgramaCampamento;
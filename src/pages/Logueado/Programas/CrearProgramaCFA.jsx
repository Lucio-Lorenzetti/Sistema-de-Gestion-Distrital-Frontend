// src/pages/Logueado/Programas/CrearProgramaCFA.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Send, ArrowLeft, MapPin, Wallet, Bus } from 'lucide-react';
import api from '../../../api/axios';
import RichTextToolbar from '../../../components/ui/RichTextToolbar';
import {
    parseFechaLocal,
    obtenerDiasRango,
    distribuirEnFilas,
    linea,
    agregarTextoMultilinea,
    generarCronogramaDia,
    lineasToHtml,
    sincronizarActividades,
    DISCLAIMER_PLANTILLA,
} from './plantillaPrograma';

const buildTemplateDiaLineas = (datos, diaInfo, numeroDia, esPrimerDia, esUltimoDia) => {
    const lineas = [];

    lineas.push(
        linea([
            {
                text: `Programa CFA — Día ${numeroDia} (${diaInfo.nombreDia} ${diaInfo.fechaFormatted})`,
                bold: true,
                color: '#9ca3af',
            },
        ])
    );
    lineas.push(linea(''));

    // Solo el Día 1 incluye el bloque de Título, Educadores, Diagnóstico, Objetivos e Info Adicional
    if (esPrimerDia) {
        lineas.push(linea([{ text: DISCLAIMER_PLANTILLA.cfa, bold: false, color: '#9ca3af' }]));
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

        lineas.push(linea([{ text: 'Objetivo del Día', bold: true }]));
        agregarTextoMultilinea(lineas, datos.objetivos);
        lineas.push(linea(''));
    }

    lineas.push(linea([{ text: 'CRONOGRAMA DEL DÍA', bold: true }]));

    const contadorActividadRef = { val: 1 };
    const horarios = generarCronogramaDia(esPrimerDia, esUltimoDia, contadorActividadRef);

    horarios.forEach((h) => {
        const matchActividad = h.desc.match(/^Actividad (\d+)$/);
        lineas.push(
            linea([
                { text: `${h.hora} `, bold: true },
                { text: h.desc, bold: !!matchActividad, actividadRef: matchActividad ? Number(matchActividad[1]) : undefined },
            ])
        );
    });
    lineas.push(linea(''));

    const totalActividades = contadorActividadRef.val - 1;
    lineas.push(linea([{ text: 'ANEXOS', bold: true }]));

    if (totalActividades > 0) {
        for (let i = 1; i <= totalActividades; i++) {
            lineas.push(linea([
                { text: 'Anexo ', bold: true },
                { text: `Actividad ${i}`, bold: true, actividadRef: i },
                { text: ':', bold: true },
            ]));
            lineas.push(linea('Objetivo de la Actividad: '));
            lineas.push(linea('Desarrollo de la actividad: '));
            lineas.push(linea('Responsables: '));
            lineas.push(linea('Área de crecimiento: . . .'));
            lineas.push(linea(''));
        }
    } else {
        lineas.push(linea([{ text: 'Anexo 1 / Actividad X:', bold: true }]));
        lineas.push(linea('Objetivo de la Actividad: '));
        lineas.push(linea('Desarrollo de la actividad: '));
        lineas.push(linea('Responsables: '));
        lineas.push(linea('Área de crecimiento: . . .'));
        lineas.push(linea(''));
    }

    return lineas;
};

const CrearProgramaCFA = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosPasoUno = location.state;
    const contenidoRef = useRef(null);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [lugar, setLugar] = useState('');
    const [valor, setValor] = useState('');
    const [transporte, setTransporte] = useState('');
    const [diaActivoId, setDiaActivoId] = useState(null);
    const [contenidosPorDia, setContenidosPorDia] = useState({});
    const [error, setError] = useState(null);

    const dias = useMemo(() => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);
        return obtenerDiasRango(inicio, fin);
    }, [fechaInicio, fechaFin]);

    const filasDeDias = useMemo(() => distribuirEnFilas(dias), [dias]);

    useEffect(() => {
        if (dias.length > 0) {
            if (!diaActivoId || !dias.some((d) => d.id === diaActivoId)) {
                setDiaActivoId(dias[0].id);
            }
        } else {
            setDiaActivoId(null);
        }
    }, [dias, diaActivoId]);

    // Inyecta HTML únicamente al cambiar la solapa de día activo
    useEffect(() => {
        if (contenidoRef.current && diaActivoId) {
            contenidoRef.current.innerHTML = contenidosPorDia[diaActivoId] || '';
        }
    }, [diaActivoId]);

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

    const guardarContenidoActual = () => {
        if (contenidoRef.current && diaActivoId) {
            const htmlActual = contenidoRef.current.innerHTML;
            setContenidosPorDia((prev) => ({
                ...prev,
                [diaActivoId]: htmlActual,
            }));
        }
    };

    const handleCambiarDia = (nuevoDiaId) => {
        guardarContenidoActual();
        setDiaActivoId(nuevoDiaId);
    };

    const handleGenerarPlantillaTodas = () => {
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

        const hayContenido = Object.values(contenidosPorDia).some((html) => html?.replace(/<[^>]+>/g, '').trim())
            || contenidoRef.current?.innerText?.trim();
        if (hayContenido && !window.confirm('Esto va a reemplazar el contenido de todos los días. ¿Continuar?')) {
            return;
        }

        setError(null);

        const nuevosContenidos = {};

        dias.forEach((diaInfo, index) => {
            const esPrimerDia = index === 0;
            const esUltimoDia = index === dias.length - 1;
            const lineas = buildTemplateDiaLineas(
                datosPasoUno,
                diaInfo,
                index + 1,
                esPrimerDia,
                esUltimoDia
            );
            nuevosContenidos[diaInfo.id] = lineasToHtml(lineas);
        });

        setContenidosPorDia(nuevosContenidos);

        if (diaActivoId && nuevosContenidos[diaActivoId] && contenidoRef.current) {
            contenidoRef.current.innerHTML = nuevosContenidos[diaActivoId];
        }
    };

    // Actualiza silenciosamente el estado sin forzar innerHTML para no desplazar el cursor
    const handleContenidoInput = () => {
        sincronizarActividades(contenidoRef.current);
        if (contenidoRef.current && diaActivoId) {
            const html = contenidoRef.current.innerHTML;
            setContenidosPorDia((prev) => ({
                ...prev,
                [diaActivoId]: html,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fechaInicio || !fechaFin) {
            setError('Completá fecha de inicio y fecha de fin.');
            return;
        }

        if (dias.length === 0) {
            setError('Ingresá un rango de fechas válido.');
            return;
        }

        guardarContenidoActual();

        const contenidosConsolidados = dias.map((d, index) => ({
            dia: index + 1,
            fecha: d.id,
            nombreDia: d.nombreDia,
            nombre_dia: d.nombreDia,
            fechaFormatted: d.fechaFormatted,
            fecha_formatted: d.fechaFormatted,
            contenidoHtml: contenidosPorDia[d.id] || '',
            contenido_html: contenidosPorDia[d.id] || '',
        }));

        setError(null);

        const payload = {
            ...datosPasoUno,
            tipo: 'cfa',
            fechaInicio,
            fecha_inicio: fechaInicio,
            fechaFin,
            fecha_fin: fechaFin,
            educadores_a_cargo: datosPasoUno.educadoresACargo,
            dias: contenidosConsolidados,
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

    const diaActivoObj = dias.find((d) => d.id === diaActivoId);

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
                        Programa Campamento Anual (CFA)
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

                    <div className="flex items-center justify-between mt-6 shrink-0 flex-wrap gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                            Días del Campamento {dias.length > 0 && `(${dias.length} día${dias.length > 1 ? 's' : ''})`}
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerarPlantillaTodas}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-primary text-scout-primary hover:bg-scout-primary hover:text-white transition-colors cursor-pointer"
                        >
                            <RefreshCw size={12} /> Generar plantilla con estas fechas
                        </button>
                    </div>

                    {filasDeDias.length > 0 && (
                        <div className="mt-4 pb-4 border-b border-scout-border flex flex-col gap-2 shrink-0">
                            {filasDeDias.map((fila, indexFila) => (
                                <div key={indexFila} className="flex justify-center flex-wrap gap-2">
                                    {fila.map((d) => {
                                        const esActivo = d.id === diaActivoId;
                                        return (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => handleCambiarDia(d.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                                    esActivo
                                                        ? 'bg-scout-primary text-white shadow-sm'
                                                        : 'bg-scout-bg-panel text-scout-muted hover:text-scout-primary'
                                                }`}
                                            >
                                                {d.nombreDia} {d.fechaFormatted}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}

                    {diaActivoObj ? (
                        <>
                            <div className="mt-4 mb-2 shrink-0">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                                    Contenido — {diaActivoObj.nombreDia} {diaActivoObj.fechaFormatted}
                                </label>
                            </div>

                            <RichTextToolbar />

                            <div
                                ref={contenidoRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={handleContenidoInput}
                                className="w-full border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-ink font-normal focus:outline-none focus:border-scout-primary transition-colors mb-4 shrink-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                                style={{ minHeight: 280 }}
                            />
                        </>
                    ) : (
                        <div className="py-12 text-center text-xs text-scout-muted italic uppercase font-bold tracking-wider">
                            Seleccioná fecha de inicio y fecha de fin para ver y cargar el contenido día por día.
                        </div>
                    )}

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

export default CrearProgramaCFA;
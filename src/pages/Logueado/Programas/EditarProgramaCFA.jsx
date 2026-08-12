// src/pages/Logueado/Programas/EditarProgramaCFA.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Send } from 'lucide-react';
import api from '../../../api/axios';
import { useAuthStore } from '../../../store/useAuthStore';
import RichTextToolbar from '../../../components/ui/RichTextToolbar';

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

const NOMBRES_DIAS = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

const obtenerDiasRango = (inicio, fin) => {
    const dias = [];
    if (!inicio || !fin || inicio > fin) return dias;
    const cursor = new Date(inicio);
    while (cursor <= fin) {
        dias.push({
            id: cursor.toISOString().split('T')[0],
            nombreDia: NOMBRES_DIAS[cursor.getDay()],
            fechaFormatted: formatDDMM(new Date(cursor)),
        });
        cursor.setDate(cursor.getDate() + 1);
    }
    return dias;
};

const distribuirEnFilas = (dias) => {
    const total = dias.length;
    if (total === 0) return [];
    if (total <= 10) return [dias];

    const mitadArriba = Math.floor(total / 2);
    const fila1 = dias.slice(0, mitadArriba);
    const fila2 = dias.slice(mitadArriba);

    return [fila1, fila2];
};

const escapeHtml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

const linea = (parts) => (Array.isArray(parts) ? parts : [{ text: parts, bold: false }]);

const agregarTextoMultilinea = (lineasTarget, texto) => {
    if (!texto) {
        lineasTarget.push(linea(''));
        return;
    }
    const renglones = String(texto).split('\n');
    renglones.forEach((renglon) => {
        lineasTarget.push(linea(renglon));
    });
};

const generarCronogramaDia = (esPrimerDia, esUltimoDia, contadorActividadRef) => {
    const horarios = [];

    if (esPrimerDia) {
        horarios.push({ hora: '08:00hs', desc: 'Concentración' });
    } else {
        horarios.push({ hora: '08:00hs', desc: 'Diana / Desayuno' });
    }
    horarios.push({ hora: '09:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '11:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '13:00hs', desc: 'Almuerzo' });

    if (esUltimoDia) {
        horarios.push({ hora: '16:00hs', desc: 'Desconcentración' });
        return horarios;
    }

    horarios.push({ hora: '15:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '17:00hs', desc: 'Merienda' });
    horarios.push({ hora: '18:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '20:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '21:30hs', desc: 'Cena' });
    horarios.push({ hora: '23:00hs', desc: 'Silencio' });

    return horarios;
};

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

    if (esPrimerDia) {
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

        lineas.push(linea([{ text: 'INFORMACIÓN ADICIONAL', bold: true }]));
        lineas.push(linea('- Lugar: '));
        lineas.push(linea('- Valor: '));
        lineas.push(linea('- Transporte / Lugar de concentración: '));
        lineas.push(linea(''));
    }

    lineas.push(linea([{ text: 'CRONOGRAMA DEL DÍA', bold: true }]));

    const contadorActividadRef = { val: 1 };
    const horarios = generarCronogramaDia(esPrimerDia, esUltimoDia, contadorActividadRef);

    horarios.forEach((h) => {
        const esActividadGenerica = h.desc.startsWith('Actividad');
        lineas.push(
            linea([
                { text: `${h.hora} `, bold: true },
                { text: h.desc, bold: esActividadGenerica },
            ])
        );
    });
    lineas.push(linea(''));

    const totalActividades = contadorActividadRef.val - 1;
    lineas.push(linea([{ text: 'ANEXOS', bold: true }]));

    if (totalActividades > 0) {
        for (let i = 1; i <= totalActividades; i++) {
            lineas.push(linea([{ text: `Anexo Actividad ${i}:`, bold: true }]));
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

const lineasToHtml = (lineas) =>
    lineas
        .map((parts) => {
            const inner = parts
                .map((p) => {
                    const textoEscapado = escapeHtml(p.text);
                    const tagApertura = p.bold ? '<strong>' : '';
                    const tagCierre = p.bold ? '</strong>' : '';
                    const style = p.color ? ` style="color: ${p.color};"` : '';

                    if (p.color) {
                        return `<span${style}>${tagApertura}${textoEscapado}${tagCierre}</span>`;
                    }
                    return `${tagApertura}${textoEscapado}${tagCierre}`;
                })
                .join('');
            return `<div>${inner || '<br>'}</div>`;
        })
        .join('');

const EditarProgramaCFA = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const contenidoRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        educadoresACargo: '',
        diagnostico: '',
        objetivos: '',
    });
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [diaActivoId, setDiaActivoId] = useState(null);
    const [contenidosPorDia, setContenidosPorDia] = useState({});

    const dias = useMemo(() => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);
        return obtenerDiasRango(inicio, fin);
    }, [fechaInicio, fechaFin]);

    const filasDeDias = useMemo(() => distribuirEnFilas(dias), [dias]);

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const res = await api.get(`/programas/${id}`);
                const programa = res.data;
                const cronograma = programa.cronograma || {};
                // El backend puede mandar los días como array directo en "dias",
                // anidados en "cronograma.dias", o "cronograma" siendo directamente el array.
                const diasFuente =
                    programa.dias ||
                    cronograma.dias ||
                    (Array.isArray(cronograma) ? cronograma : []);

                setFormData({
                    titulo: programa.titulo || '',
                    educadoresACargo: programa.educadoresACargo || programa.educadores_a_cargo || '',
                    diagnostico: programa.diagnostico || '',
                    objetivos: programa.objetivos || '',
                });
                setFechaInicio(programa.fechaInicio || programa.fecha_inicio || '');
                setFechaFin(programa.fechaFin || programa.fecha_fin || '');

                const nuevosContenidos = {};
                diasFuente.forEach((d) => {
                    const fecha = d.fecha || d.fecha_dia || d.date;
                    if (fecha) nuevosContenidos[fecha] = d.contenidoHtml || d.contenido_html || '';
                });
                setContenidosPorDia(nuevosContenidos);
            } catch (err) {
                console.error('Error al cargar el programa:', err);
                setError('No se pudo cargar la información del programa.');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchPrograma();
    }, [id]);

    useEffect(() => {
        if (dias.length > 0) {
            if (!diaActivoId || !dias.some((d) => d.id === diaActivoId)) {
                setDiaActivoId(dias[0].id);
            }
        } else {
            setDiaActivoId(null);
        }
    }, [dias, diaActivoId]);

    useEffect(() => {
        if (contenidoRef.current && diaActivoId) {
            contenidoRef.current.innerHTML = contenidosPorDia[diaActivoId] || '';
        }
    }, [diaActivoId, isLoadingData]);

    if (isLoadingData) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-scout-bg-panel">
                <p className="text-scout-primary font-bold uppercase tracking-widest text-xs animate-pulse">Cargando programa...</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

        setError(null);

        const nuevosContenidos = {};

        dias.forEach((diaInfo, index) => {
            const esPrimerDia = index === 0;
            const esUltimoDia = index === dias.length - 1;
            const lineas = buildTemplateDiaLineas(
                formData,
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

    const handleContenidoInput = () => {
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
        setIsLoading(true);

        const payload = {
            ...formData,
            tipo: 'cfa',
            fechaInicio,
            fecha_inicio: fechaInicio,
            fechaFin,
            fecha_fin: fechaFin,
            educadores_a_cargo: formData.educadoresACargo,
            dias: contenidosConsolidados,
        };

        try {
            await api.put(`/programas/${id}`, payload);
            navigate('/gestion-programas');
        } catch (err) {
            console.error('Error al actualizar el programa:', err);
            const errorMsg = err.response?.data?.message || 'Ocurrió un error al actualizar el programa.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
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
                        Panel de Control Privado • Edición
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Editar Programa Campamento Final (CFA)
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Editando como: {user.name}
                        </p>
                    )}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 shrink-0">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Educadores a Cargo
                                </label>
                                <textarea
                                    name="educadoresACargo"
                                    value={formData.educadoresACargo}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Diagnóstico
                                </label>
                                <textarea
                                    name="diagnostico"
                                    value={formData.diagnostico}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Objetivo
                                </label>
                                <textarea
                                    name="objetivos"
                                    value={formData.objetivos}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0 mt-6">
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

                    <div className="flex items-center justify-between mt-6 shrink-0 flex-wrap gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                            Días del Campamento {dias.length > 0 && `(${dias.length} día${dias.length > 1 ? 's' : ''})`}
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerarPlantillaTodas}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-primary text-scout-primary hover:bg-scout-primary hover:text-white transition-colors cursor-pointer"
                        >
                            <RefreshCw size={12} /> Regenerar plantilla con estas fechas
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
                            to="/gestion-programas"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md hover:shadow-lg cursor-pointer ${isLoading ? 'bg-scout-muted cursor-not-allowed text-white' : 'bg-scout-primary hover:bg-scout-primary-hover text-white'}`}
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Programa'} <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarProgramaCFA;

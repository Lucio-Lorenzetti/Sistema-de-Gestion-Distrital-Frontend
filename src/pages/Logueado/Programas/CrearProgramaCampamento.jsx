// src/pages/Logueado/Programas/CrearProgramaCampamento.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';

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
            nombreDia: NOMBRES_DIAS[cursor.getDay()],
            fechaFormatted: formatDDMM(new Date(cursor)),
        });
        cursor.setDate(cursor.getDate() + 1);
    }
    return dias;
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

// ✅ Ahora recibe también esUltimoDia: si es el último día, corta después del
// almuerzo y cierra con Desconcentración a las 16:00hs (no hay merienda/cena/silencio,
// la gente se va ese día).
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

const buildTemplateLineas = (datos, inicio, fin) => {
    const dias = obtenerDiasRango(inicio, fin);
    const lineas = [];

    lineas.push(
        linea([
            {
                text: 'Este Template es para unificar criterios mínimos de un programa de campamento para el distrito, se pide que de base se respete la información solicitada, y en el caso de querer agregar cosas es bienvenido, dicho programa se generará a partir de los datos ingresados en el paso anterior más la descripción ingresada acá.',
                bold: false,
                color: '#9ca3af',
            },
        ])
    );
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

    lineas.push(linea([{ text: 'INFORMACIÓN ADICIONAL', bold: true }]));
    lineas.push(linea('- Lugar: '));
    lineas.push(linea('- Comidas: '));
    lineas.push(linea('- Valor: '));
    lineas.push(linea('- Transporte / Lugar de concentración: '));
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

            // ✅ le paso si es el último día del rango
            const horarios = generarCronogramaDia(
                index === 0,
                index === dias.length - 1,
                contadorActividadRef
            );
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
            lineas.push(linea([{ text: `Anexo Actividad ${i}:`, bold: true }]));
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

const CrearProgramaCampamento = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosPasoUno = location.state;
    const contenidoRef = useRef(null);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
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

        const payload = {
            ...datosPasoUno,
            tipo: 'campamento',
            fechaInicio,
            fechaFin,
            contenido: contenidoTexto,
        };

        try {
            const response = await axios.post('/api/programas', payload);

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
                    <div className="mb-4 mt-4 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 uppercase tracking-wide shrink-0">
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
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
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
                                    className="w-full border border-scout-border rounded-xl p-3 pl-10 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
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

                    <div
                        ref={contenidoRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContenidoInput}
                        className="w-full border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-normal focus:outline-none focus:border-scout-primary transition-colors mb-4 shrink-0"
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
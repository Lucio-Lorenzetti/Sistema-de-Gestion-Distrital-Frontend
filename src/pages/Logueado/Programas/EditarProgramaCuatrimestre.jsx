// src/pages/Logueado/Programas/EditarProgramaCuatrimestre.jsx
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

const buildTemplateLineas = (datos, inicio, fin) => {
    const sabados = obtenerSabados(inicio, fin);
    const lineas = [];

    lineas.push(
        linea([
            {
                text: 'Este Template es para unificar criterios mínimos de un programa de cuatrimestre para el distrito, se pide que de base se respete la información solicitada, y en el caso de querer agregar cosas es bienvenido, dicho programa se generará a partir de los datos ingresados más la descripción ingresada acá.',
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

    lineas.push(linea([{ text: 'SÁBADOS/FECHAS', bold: true }]));
    if (sabados.length > 0) {
        sabados.forEach((f, i) => {
            lineas.push([
                { text: f, bold: true },
                { text: ` - Actividad ${i + 1}/Título X`, bold: false },
            ]);
        });
    } else {
        lineas.push(linea('(Seleccioná fecha de inicio y fecha de fin para generar los sábados automáticamente)'));
    }
    lineas.push(linea(''));

    lineas.push(linea([{ text: 'ANEXOS', bold: true }]));
    if (sabados.length > 0) {
        sabados.forEach((f, i) => {
            lineas.push(linea([{ text: `Anexo ${i + 1}/Título X:`, bold: true }]));
            lineas.push(linea('Objetivo de la Actividad: . . .'));
            lineas.push(linea('Desarrollo de la actividad: . . .'));
            lineas.push(linea('Responsables: . . .'));
            lineas.push(linea('Área de crecimiento: . . .'));
            lineas.push(linea(''));
        });
    } else {
        lineas.push(linea([{ text: 'Anexo 1/Título X:', bold: true }]));
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

const textoPlanoAHtml = (texto) => {
    if (!texto) return '';
    return String(texto)
        .split('\n')
        .map((renglon) => `<div>${escapeHtml(renglon) || '<br>'}</div>`)
        .join('');
};

const EditarProgramaCuatrimestre = () => {
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
    const [contenidoInicialHtml, setContenidoInicialHtml] = useState('');
    const [contenidoVacio, setContenidoVacio] = useState(true);

    const sabadosCount = useMemo(() => {
        const inicio = parseFechaLocal(fechaInicio);
        const fin = parseFechaLocal(fechaFin);
        return obtenerSabados(inicio, fin).length;
    }, [fechaInicio, fechaFin]);

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const res = await api.get(`/programas/${id}`);
                const programa = res.data;

                setFormData({
                    titulo: programa.titulo || '',
                    educadoresACargo: programa.educadoresACargo || '',
                    diagnostico: programa.diagnostico || '',
                    objetivos: programa.objetivos || '',
                });
                setFechaInicio(programa.fechaInicio || '');
                setFechaFin(programa.fechaFin || '');
                // Los programas viejos guardaban texto plano en "contenido"; los nuevos ya traen "contenidoHtml".
                setContenidoInicialHtml(programa.contenidoHtml || textoPlanoAHtml(programa.contenido));
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
        if (!isLoadingData && contenidoRef.current) {
            contenidoRef.current.innerHTML = contenidoInicialHtml;
            setContenidoVacio(contenidoRef.current.innerText.trim().length === 0);
        }
    }, [isLoadingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
        const lineas = buildTemplateLineas(formData, inicio, fin);
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
            setError('Generá o escribí el contenido del programa antes de actualizar.');
            return;
        }

        setError(null);
        setIsLoading(true);

        const payload = {
            ...formData,
            tipo: 'cuatrimestre',
            fechaInicio,
            fechaFin,
            contenidoHtml: contenidoRef.current.innerHTML,
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

    if (isLoadingData) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-scout-bg-panel">
                <p className="text-scout-primary font-bold uppercase tracking-widest text-xs animate-pulse">Cargando programa...</p>
            </div>
        );
    }

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
                        Editar Programa de Cuatrimestre
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Editando como: {user.name}
                        </p>
                    )}
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
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
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
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
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
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
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
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
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
                            Contenido del Programa {sabadosCount > 0 && `— ${sabadosCount} sábado${sabadosCount > 1 ? 's' : ''} en el rango`}
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerarPlantilla}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-primary text-scout-primary hover:bg-scout-primary hover:text-white transition-colors cursor-pointer"
                        >
                            <RefreshCw size={12} /> Regenerar plantilla con estas fechas
                        </button>
                    </div>

                    {contenidoVacio && (
                        <p className="text-xs text-scout-muted italic mb-2">
                            Vacío — tocá "Regenerar plantilla" o escribí libremente acá abajo.
                        </p>
                    )}

                    <RichTextToolbar />

                    <div
                        ref={contenidoRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContenidoInput}
                        className="w-full border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-normal focus:outline-none focus:border-scout-primary transition-colors mb-4 shrink-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                        style={{ minHeight: 280 }}
                    />

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

export default EditarProgramaCuatrimestre;

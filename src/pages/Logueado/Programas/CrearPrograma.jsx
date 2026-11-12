// src/pages/Logueado/Programas/CrearPrograma.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, Send } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import Select from '../../../components/ui/Select';
import { getPermisos } from '../../../utils/permisos';
import { useRamasCatalogo } from '../../Dashboard/Panels/Usuarios/useRamasCatalogo';
import { useGruposCatalogo } from '../../Dashboard/Panels/Programas/useGruposCatalogo';
import AvisoAutoguardado from '../../../components/ui/AvisoAutoguardado';
import { leerBorrador, useAutoguardado } from '../../../hooks/useAutoguardado';

// A dónde redirige cada tipo, una vez que definamos cada sub-formulario.
const TIPO_OPTIONS = [
    { key: 'cuatrimestre', label: 'Programa de Cuatrimestre', route: '/gestion-programas/crear/cuatrimestre' },
    { key: 'campamento', label: 'Programa de Acantonamiento/Campamento', route: '/gestion-programas/crear/campamento' },
    { key: 'cfa', label: 'Programa Campamento Anual', route: '/gestion-programas/crear/cfa' },
];

const CrearPrograma = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const formRef = useRef(null);

    const [borrador] = useState(() => leerBorrador('programa-paso1'));
    const [titulo, setTitulo] = useState(borrador?.datos.titulo ?? '');
    const [educadoresACargo, setEducadoresACargo] = useState(borrador?.datos.educadoresACargo ?? '');
    const [diagnostico, setDiagnostico] = useState(borrador?.datos.diagnostico ?? '');
    const [objetivos, setObjetivos] = useState(borrador?.datos.objetivos ?? '');
    const [tipo, setTipo] = useState(borrador?.datos.tipo ?? null);

    // Rama y grupo del programa: para un Educador salen de su rol (el back los
    // toma del usuario y no los deja cambiar). Solo el Developer, que no tiene
    // rama propia, los elige acá.
    const esDeveloper = getPermisos(user).esDeveloper;
    const { catalogoRamas } = useRamasCatalogo();
    const { catalogoGrupos } = useGruposCatalogo();
    const [ramaId, setRamaId] = useState(borrador?.datos.ramaId ?? user?.rama_id ?? '');
    const [grupoId, setGrupoId] = useState(borrador?.datos.grupoId ?? user?.grupo_id ?? '');
    const ramaNombre = catalogoRamas.find((r) => String(r.id) === String(ramaId))?.nombre ?? user?.rama?.nombre;
    const grupoNombre = catalogoGrupos.find((g) => String(g.id) === String(grupoId))?.nombre ?? user?.grupo?.nombre;

    const aviso = useAutoguardado({
        clave: 'programa-paso1',
        datos: { titulo, educadoresACargo, diagnostico, objetivos, tipo, ramaId, grupoId },
        borrador,
        tieneContenido: (d) => Boolean(
            d.titulo.trim() || d.educadoresACargo.trim() || d.diagnostico.trim() || d.objetivos.trim() || d.tipo
        ),
    });
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        if (esDeveloper && (!ramaId || !grupoId)) {
            setError('Elegí la rama y el grupo a los que pertenece el programa.');
            return;
        }

        const tipoSeleccionado = TIPO_OPTIONS.find((t) => t.key === tipo);
        if (!tipoSeleccionado) {
            setError('Elegí el tipo de programa antes de continuar.');
            return;
        }

        setError(null);

        // No pega a la API acá — pasa los datos ya cargados al sub-formulario
        // correspondiente vía location.state, que es el que hace el POST real.
        navigate(tipoSeleccionado.route, {
            state: {
                titulo, educadoresACargo, diagnostico, objetivos, tipo,
                // Solo viajan si los eligió el Developer; para el resto el back los ignora.
                ...(esDeveloper ? { rama_id: Number(ramaId), grupo_id: Number(grupoId) } : {}),
            },
        });
    };

    return (
        <div className="min-h-full lg:h-full w-full flex flex-col bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white p-4 sm:p-6 md:p-10 lg:overflow-hidden text-left">
            <div
                className="bg-scout-bg-panel text-left relative flex flex-col lg:h-full lg:overflow-hidden p-0 sm:p-4"
            >
                {/* HEADER */}
                <div className="border-b border-scout-border pb-4 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Panel de Control Privado • Gestión de Programas
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Crear Programa
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Creando como: {user.name}
                            {ramaNombre ? ` • Rama ${ramaNombre}` : ''}
                            {grupoNombre ? ` • Grupo ${grupoNombre}` : ''}
                        </p>
                    )}
                </div>

                <AvisoAutoguardado {...aviso} />

                {/* ERROR */}
                {error && (
                    <div className="mb-4 mt-4 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                        {error}
                    </div>
                )}

                {/* FORMULARIO PRINCIPAL */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex-1 bg-scout-bg-card rounded-[2rem] border border-scout-border p-5 sm:p-8 shadow-sm flex flex-col min-h-0 overflow-y-auto mt-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

                        {/* COLUMNA IZQUIERDA: Título, Educadores a cargo, Tipo */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                    placeholder={"Ej: Programa Primer Cuatrimestre de " + (ramaNombre || 'Rama') + " (" + (grupoNombre || 'Grupo') + ")" + " 202x"}
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Educadores a Cargo
                                </label>
                                <textarea
                                    value={educadoresACargo}
                                    onChange={(e) => {
                                        setEducadoresACargo(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    required
                                    rows={2}
                                    placeholder={`Ej: Luis Rojas (Pointer Servicial) - I.M.
Fernando perez millan (San Bernardo Leal) - I.M.`}
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[65px]"
                                />
                            </div>

                            {esDeveloper && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 px-4 pt-4 pb-0 rounded-2xl border border-scout-primary/30 bg-scout-primary/5">
                                    <p className="sm:col-span-2 text-xs font-bold text-scout-muted leading-relaxed mb-4">
                                        Como Developer elegís a qué rama y grupo pertenece el programa. Para el resto de los usuarios sale de su rol.
                                    </p>
                                    <Select
                                        id="programa-rama"
                                        label="Rama"
                                        required
                                        value={ramaId}
                                        onChange={(e) => setRamaId(e.target.value)}
                                        options={catalogoRamas.map((r) => ({ value: r.id, label: r.nombre }))}
                                        placeholder="Elegí la rama"
                                    />
                                    <Select
                                        id="programa-grupo"
                                        label="Grupo"
                                        required
                                        value={grupoId}
                                        onChange={(e) => setGrupoId(e.target.value)}
                                        options={catalogoGrupos.map((g) => ({ value: g.id, label: g.nombre }))}
                                        placeholder="Elegí el grupo"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Tipo de Programa
                                </label>
                                <div className="flex flex-col gap-2">
                                    {TIPO_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => setTipo(opt.key)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left ${tipo === opt.key
                                                    ? 'border-scout-primary bg-scout-primary text-white'
                                                    : 'border-scout-border bg-scout-bg-panel/50 text-scout-muted hover:border-scout-primary/50'
                                                }`}
                                        >
                                            <ClipboardList size={16} className="shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: Diagnóstico y Objetivo */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Diagnóstico
                                </label>
                                <textarea
                                    value={diagnostico}
                                    onChange={(e) => setDiagnostico(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="Diagnóstico actual de la rama..."
                                    className="w-full flex-1 border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[80px]"
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Objetivo
                                </label>
                                <textarea
                                    value={objetivos}
                                    onChange={(e) => setObjetivos(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="¿Qué se busca lograr con este programa?"
                                    className="w-full flex-1 border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[80px]"
                                />
                            </div>
                        </div>

                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="mt-6 pt-4 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
                        <Link
                            to="/gestion-programas"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Cancelar
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

export default CrearPrograma;
// src/pages/Logueado/Programas/CrearPrograma.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, Send } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

// A dónde redirige cada tipo, una vez que definamos cada sub-formulario.
const TIPO_OPTIONS = [
    { key: 'cuatrimestre', label: 'Programa de Cuatrimestre', route: '/gestion-programas/crear/cuatrimestre' },
    { key: 'campamento', label: 'Programa de Acantonamiento/Campamento', route: '/gestion-programas/crear/campamento' },
    { key: 'cfa', label: 'Programa Campamento Final', route: '/gestion-programas/crear/cfa' },
];

const CrearPrograma = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const formRef = useRef(null);

    const [titulo, setTitulo] = useState('');
    const [educadoresACargo, setEducadoresACargo] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [objetivos, setObjetivos] = useState('');
    const [tipo, setTipo] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
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
            state: { titulo, educadoresACargo, diagnostico, objetivos, tipo },
        });
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
                        Crear Programa
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Creando como: {user.name}
                            {user.rama?.nombre ? ` • Rama ${user.rama.nombre}` : ''}
                            {user.grupo?.nombre ? ` • Grupo ${user.grupo.nombre}` : ''}
                        </p>
                    )}
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 mt-4 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 uppercase tracking-wide shrink-0">
                        {error}
                    </div>
                )}

                {/* FORMULARIO PRINCIPAL */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex-1 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col min-h-0 overflow-y-auto mt-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

                        {/* COLUMNA IZQUIERDA: Título, Educadores a cargo, Tipo */}
                        <div className="flex flex-col space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                    placeholder={"Ej: Programa de " + (user.rama?.nombre || 'Rama') + " " + (user.grupo?.nombre || 'Grupo') + " Primer Cuatrimestre 202x"}
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Educadores a Cargo
                                </label>
                                <input
                                    type="text"
                                    value={educadoresACargo}
                                    onChange={(e) => setEducadoresACargo(e.target.value)}
                                    required
                                    placeholder={`Ej: ${user.name} - I.M.`}
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Tipo de Programa
                                </label>
                                <div className="flex flex-col gap-3">
                                    {TIPO_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => setTipo(opt.key)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer text-left ${tipo === opt.key
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
                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Diagnóstico
                                </label>
                                <textarea
                                    value={diagnostico}
                                    onChange={(e) => setDiagnostico(e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="Ej: La rama actualmente se encuentra en..."
                                    className="w-full flex-1 border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[120px]"
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Objetivo
                                </label>
                                <textarea
                                    value={objetivos}
                                    onChange={(e) => setObjetivos(e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="¿Qué se busca lograr con este programa?"
                                    className="w-full flex-1 border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[120px]"
                                />
                            </div>
                        </div>

                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="mt-8 pt-6 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
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
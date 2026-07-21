import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, LinkIcon, Upload, ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useAuthorizedFetch } from '../../../hooks/useAuthorizedFetch';

const BIBLIOGRAFIA_ENDPOINT = '/api/bibliografia';

const CrearBibliografia = () => {
    const navigate = useNavigate();
    const { authorizedFetch } = useAuthorizedFetch();
    const user = useAuthStore((state) => state.user);
    const formRef = useRef(null);

    const [tipo, setTipo] = useState('archivo');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        if (tipo === 'archivo' && !archivo) {
            setError('Por favor, selecciona un archivo válido para subir.');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('tipo', tipo);
        if (tipo === 'archivo' && archivo) formData.append('archivo', archivo);
        if (tipo === 'link') formData.append('link', link);

        authorizedFetch(BIBLIOGRAFIA_ENDPOINT, {
            method: 'POST',
            body: formData,
        })
            .then(() => navigate('/library'))
            .catch((err) => {
                console.error('Error al publicar:', err);
                const errorMsg = err.response?.data?.message || err.message;
                setError('No se pudo publicar: ' + errorMsg);
            })
            .finally(() => setIsSubmitting(false));
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
                        Panel de Control Privado • Gestión de Bibliografia
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Crear Curso
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Publicando como: {user.name}
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
                        
                        {/* COLUMNA IZQUIERDA: Selector de tipo y Título */}
                        <div className="flex flex-col space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Tipo de Recurso
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTipo('archivo')}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                                            tipo === 'archivo'
                                                ? 'border-scout-primary bg-scout-primary text-white'
                                                : 'border-scout-border bg-scout-bg-panel/50 text-scout-muted hover:border-scout-primary/50'
                                        }`}
                                    >
                                        <FileText size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Archivo</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTipo('link')}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                                            tipo === 'link'
                                                ? 'border-scout-primary bg-scout-primary text-white'
                                                : 'border-scout-border bg-scout-bg-panel/50 text-scout-muted hover:border-scout-primary/50'
                                        }`}
                                    >
                                        <LinkIcon size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Link Externo</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                    Título del Documento
                                </label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    placeholder="Ej: Manual de Nudos Scout"
                                    className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>

                            {/* Carga dinámicamente el input de Archivo o Link según la selección */}
                            <div className="flex-1 flex flex-col">
                                {tipo === 'archivo' ? (
                                    <div className="flex-1 flex flex-col">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                            Archivo (PDF, Word, Excel — máx. 5MB)
                                        </label>
                                        <label className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-scout-border rounded-2xl p-6 cursor-pointer hover:border-scout-primary transition-colors bg-scout-bg-panel/50 min-h-[120px]">
                                            <Upload size={22} className="text-scout-muted" />
                                            <span className="text-xs font-bold text-scout-muted text-center px-2">
                                                {archivo ? archivo.name : 'Hacé clic para seleccionar un archivo'}
                                            </span>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                onChange={(e) => setArchivo(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                            URL del Recurso
                                        </label>
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            required={tipo === 'link'}
                                            placeholder="https://ejemplo.com/documento"
                                            className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: Descripción detallada */}
                        <div className="flex flex-col h-full">
                            <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">
                                Descripción Breve
                            </label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={6}
                                placeholder="¿De qué trata este documento o recurso educativo?"
                                className="w-full flex-1 border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none min-h-[180px]"
                            />
                        </div>

                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="mt-8 pt-6 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
                        <Link
                            to="/library"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md hover:shadow-lg cursor-pointer ${
                                isSubmitting
                                    ? 'bg-scout-muted cursor-not-allowed text-white'
                                    : 'bg-scout-primary hover:bg-scout-primary-hover text-white'
                            }`}
                        >
                            {isSubmitting ? 'Publicando...' : 'Publicar Documento'} <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearBibliografia;
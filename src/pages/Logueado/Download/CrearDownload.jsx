import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LinkIcon, Upload, ArrowLeft } from 'lucide-react';
import { useAuthorizedFetch } from '../../hooks/useAuthorizedFetch';

const BIBLIOGRAFIA_ENDPOINT = '/api/bibliografia';

const CrearBibliografia = () => {
    const navigate = useNavigate();
    const { authorizedFetch } = useAuthorizedFetch();
    const [tipo, setTipo] = useState('archivo');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
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
            headers: {}, // dejar que el navegador setee el boundary del multipart
        })
            .then(() => navigate('/bibliografia'))
            .catch((err) => {
                console.error('Error al publicar:', err);
                setError('No se pudo publicar. Verificá los datos e intentá de nuevo.');
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0">
                <button
                    onClick={() => navigate('/bibliografia')}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors mb-3 cursor-pointer"
                >
                    <ArrowLeft size={12} /> Volver a Bibliografía
                </button>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Gestión de Bibliografía
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                    Nueva Publicación
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mt-10 flex flex-col gap-6">
                {/* Selector de tipo */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setTipo('archivo')}
                        className={`flex items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer ${tipo === 'archivo' ? 'border-scout-primary bg-scout-primary text-white' : 'border-scout-border bg-scout-bg-card text-scout-muted hover:border-scout-primary/50'
                            }`}
                    >
                        <FileText size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Subir Archivo</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipo('link')}
                        className={`flex items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer ${tipo === 'link' ? 'border-scout-primary bg-scout-primary text-white' : 'border-scout-border bg-scout-bg-card text-scout-muted hover:border-scout-primary/50'
                            }`}
                    >
                        <LinkIcon size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Agregar Link</span>
                    </button>
                </div>

                {/* Título */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block mb-2">Título</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        placeholder="Ej: Manual de Nudos Scout"
                        className="w-full px-4 py-3 rounded-xl border border-scout-border bg-scout-bg-card text-sm text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block mb-2">Descripción breve</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={4}
                        placeholder="¿De qué trata este documento o recurso?"
                        className="w-full px-4 py-3 rounded-xl border border-scout-border bg-scout-bg-card text-sm text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors resize-none"
                    />
                </div>

                {/* Archivo o Link según selección */}
                {tipo === 'archivo' ? (
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block mb-2">Archivo (PDF, Word, Excel — máx. 5MB)</label>
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-scout-border rounded-2xl p-8 cursor-pointer hover:border-scout-primary transition-colors bg-scout-bg-card">
                            <Upload size={22} className="text-scout-muted" />
                            <span className="text-xs font-bold text-scout-muted">
                                {archivo ? archivo.name : 'Hacé clic para seleccionar un archivo'}
                            </span>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => setArchivo(e.target.files[0])}
                                required={tipo === 'archivo'}
                                className="hidden"
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block mb-2">URL del recurso</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required={tipo === 'link'}
                            placeholder="https://ejemplo.com/documento"
                            className="w-full px-4 py-3 rounded-xl border border-scout-border bg-scout-bg-card text-sm text-scout-primary font-medium focus:outline-none focus:border-scout-primary transition-colors"
                        />
                    </div>
                )}

                {error && (
                    <p className="text-xs font-bold text-scout-accent bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer w-fit"
                >
                    {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
    );
};

export default CrearBibliografia;
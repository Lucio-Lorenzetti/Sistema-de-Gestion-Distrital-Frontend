import React, { useState, useRef } from 'react';
import { UploadCloud, Send, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/useAuthStore';

const CrearNoticia = () => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCurrentDate = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().split('T')[0]; // Cortamos justo en la 'T'
    };

    const [formData, setFormData] = useState({
        titulo: '',
        fecha: getCurrentDate(),
        copete: '',
        cuerpo: ''
    });
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);

    const esFechaFutura = formData.fecha > getCurrentDate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (e) => {
        e.preventDefault();
        setImagen(null);
        setPreview(null);
    };

    const guardarNoticia = async (estadoDeseado) => {
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity(); // Esto muestra los carteles de "Complete este campo"
            return; // Corta la ejecución para que no envíe nada incompleto
        }
        setIsLoading(true);
        setError(null);

        const payload = new FormData();
        payload.append('titulo', formData.titulo);
        payload.append('estado', estadoDeseado);
        payload.append('copete', formData.copete); // Campo nuevo
        payload.append('contenido', formData.cuerpo);

        // Si hay imagen, la agregamos
        if (imagen) payload.append('imagen', imagen);

        // Si hay fecha (para Publicada o Programada), la mandamos
        if (formData.fecha) payload.append('publicado_at', formData.fecha);

        try {
            await axios.post('/api/news', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    // axios setea el multipart/form-data automáticamente
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error completo:', err.response);
            const errorMsg = err.response?.data?.message || err.message;
            setError(`No se pudo guardar la noticia como ${estadoDeseado}: ` + errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white p-6 md:p-10 overflow-hidden text-left">
            <div className="w-full max-w-6xl mx-auto flex flex-col h-full min-h-0">

                {/* HEADER */}
                <div className="mb-6 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Noticias Internas • Nueva noticia
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Crear Noticia
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1">
                            Publicando como: {user.name}
                        </p>
                    )}
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-4 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 uppercase tracking-wide shrink-0">
                        {error}
                    </div>
                )}

                <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex-1 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col min-h-0 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* COLUMNA IZQUIERDA */}
                        <div className="flex flex-col space-y-6">

                            {/* Título */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-3 block">
                                    Título de la noticia
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ej: Campamento de Verano 2026..."
                                    className="w-full border border-scout-border rounded-xl p-4 text-sm font-medium text-scout-primary focus:outline-none focus:border-scout-primary transition-colors bg-scout-bg-panel/50 placeholder:text-scout-muted/50"
                                    required
                                />
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-3 block">
                                    Fecha de publicación
                                </label>
                                <input
                                    type="date" // <-- Cambiado a fecha y hora
                                    name="fecha"
                                    value={formData.fecha}
                                    min={getCurrentDate()} // <-- Bloquea el pasado
                                    onChange={handleChange}
                                    className="w-full border border-scout-border rounded-xl p-4 text-sm font-medium text-scout-primary focus:outline-none focus:border-scout-primary transition-colors bg-scout-bg-panel/50"
                                    required
                                />
                            </div>

                            {/* Imagen */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted block">
                                        Imagen de portada
                                    </label>
                                    <span className="text-[9px] text-scout-muted/70 uppercase tracking-wider font-bold">
                                        (Opcional)
                                    </span>
                                </div>
                                <div className={`relative w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all h-[200px] overflow-hidden ${preview ? 'border-scout-primary p-2' : 'border-scout-border hover:bg-scout-bg-panel/50 p-6'}`}>
                                    {preview ? (
                                        <div className="relative w-full h-full rounded-xl overflow-hidden group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-12 h-12 bg-scout-bg-panel rounded-full flex items-center justify-center mb-3 text-scout-muted">
                                                <UploadCloud size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-scout-primary mb-1">
                                                Hacé clic para subir un archivo
                                            </p>
                                            <p className="text-[9px] font-medium text-scout-muted uppercase tracking-widest">
                                                JPG, PNG o GIF (Max. 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="flex flex-col space-y-6">

                            {/* Copete */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-3 block">
                                    Copete o Resumen
                                </label>
                                <textarea
                                    name="copete"
                                    value={formData.copete}
                                    onChange={handleChange}
                                    placeholder="Breve descripción que aparecerá en las tarjetas de inicio..."
                                    rows={3}
                                    className="w-full border border-scout-border rounded-xl p-4 text-sm font-medium text-scout-primary focus:outline-none focus:border-scout-primary transition-colors bg-scout-bg-panel/50 resize-none placeholder:text-scout-muted/50"
                                    required
                                />
                            </div>

                            {/* Cuerpo */}
                            <div className="flex-1 flex flex-col">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-3 block">
                                    Cuerpo de la Noticia
                                </label>
                                <textarea
                                    name="cuerpo"
                                    value={formData.cuerpo}
                                    onChange={handleChange}
                                    placeholder="Desarrollá aquí todo el contenido de la noticia..."
                                    className="w-full flex-1 min-h-[150px] border border-scout-border rounded-xl p-4 text-sm font-medium text-scout-primary focus:outline-none focus:border-scout-primary transition-colors bg-scout-bg-panel/50 resize-none placeholder:text-scout-muted/50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="button"
                            onClick={() => guardarNoticia('Borrador')}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm"
                        >
                            Guardar en Borrador
                        </button>

                        <button
                            type="button"
                            onClick={() => guardarNoticia('Programada')}
                            disabled={isLoading || !esFechaFutura}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${!esFechaFutura
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }`}
                            title={!esFechaFutura ? "Modificá el calendario a una fecha futura para programar" : "Programar publicación"}
                        >
                            Programar
                        </button>

                        <button
                            type="button"
                            onClick={() => guardarNoticia('Publicada')}
                            disabled={isLoading}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md hover:shadow-lg ${isLoading ? 'bg-scout-muted cursor-not-allowed text-white' : 'bg-scout-primary hover:bg-scout-primary-hover text-white'}`}
                        >
                            {isLoading ? 'Guardando...' : 'Publicar Ahora'} <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearNoticia;

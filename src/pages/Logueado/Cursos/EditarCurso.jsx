import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../../store/useAuthStore';

const CURSOS_ENDPOINT = '/api/courses';
const RAMAS_OPTIONS = ['Pre-menores', 'Manada', 'Unidad', 'Caminantes', 'Rovers'];

const getCurrentDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().split('T')[0];
};

const EditarCurso = () => {
    const { id } = useParams();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        link_formulario: '',
        categoria: 'Programa',
        ramas: [],
        fecha_cierre: '',
        fecha_fin: '',
        lugar: '',
        costo: '',
        modalidad: 'Presencial',
        formador: '',
    });

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const res = await axios.get(`${CURSOS_ENDPOINT}/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const curso = res.data;

                setFormData({
                    titulo: curso.titulo || '',
                    descripcion: curso.descripcion || '',
                    link_formulario: curso.link_formulario || '',
                    categoria: curso.categoria || 'Programa',
                    ramas: curso.ramas || [],
                    fecha_cierre: curso.fecha_cierre || '',
                    fecha_fin: curso.fecha_fin || '',
                });
            } catch (err) {
                console.error('Error al cargar curso:', err);
                setError('No se pudo cargar la información del curso.');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchCurso();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoriaChange = (categoria) => {
        setFormData(prev => ({
            ...prev,
            categoria,
            ramas: categoria === 'Programa' ? prev.ramas : [],
        }));
    };

    const toggleRama = (rama) => {
        setFormData(prev => {
            const yaExiste = prev.ramas.includes(rama);
            return {
                ...prev,
                ramas: yaExiste ? prev.ramas.filter(r => r !== rama) : [...prev.ramas, rama],
            };
        });
    };

    const guardarCurso = async () => {
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }
        if (formData.categoria === 'Programa' && formData.ramas.length === 0) {
            setError('Seleccioná al menos una rama para un curso de categoría "Programa".');
            return;
        }
        if (formData.fecha_fin < formData.fecha_cierre) {
            setError('La fecha del curso no puede ser anterior al cierre de inscripción.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const payload = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            link_formulario: formData.link_formulario,
            categoria: formData.categoria,
            ramas: formData.categoria === 'Programa' ? formData.ramas : [],
            fecha_cierre: formData.fecha_cierre,
            fecha_fin: formData.fecha_fin,
        };

        try {
            await axios.put(`${CURSOS_ENDPOINT}/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            navigate('/gestion-cursos/administrar');
        } catch (err) {
            console.error('Error completo:', err.response);
            const errorMsg = err.response?.data?.message || err.message;
            setError('No se pudo actualizar el curso: ' + errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-scout-bg-panel">
                <p className="text-scout-primary font-bold uppercase tracking-widest text-xs animate-pulse">Cargando curso...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-scout-bg-panel font-sans selection:bg-scout-primary selection:text-white p-6 md:p-10 overflow-hidden text-left">
            <div
                className="bg-scout-bg-panel text-left relative"
                style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1rem' }}
            >

                {/* HEADER */}
                <div className="border-b border-scout-border pb-4 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Panel de Control Privado • Gestión de Cursos
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
                        Editar Curso
                    </h1>
                    {user && (
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1 ml-9">
                            Editando como: {user.name}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* COLUMNA IZQUIERDA */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Título del curso</label>
                                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Cierre Inscrip.</label>
                                    <input type="date" name="fecha_cierre" value={formData.fecha_cierre} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Fecha Curso</label>
                                    <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Lugar</label>
                                    <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Modalidad</label>
                                    <select name="modalidad" value={formData.modalidad} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50 text-scout-primary">
                                        <option value="Presencial">Presencial</option>
                                        <option value="Virtual">Virtual</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Formador</label>
                                <input type="text" name="formador" value={formData.formador} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" />
                            </div>
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Link de inscripción</label>
                                <input type="url" name="link_formulario" value={formData.link_formulario} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Categoría</label>
                                    <div className="flex gap-2">
                                        {['Programa', 'Gestion'].map((cat) => (
                                            <button key={cat} type="button" onClick={() => handleCategoriaChange(cat)} className={`flex-1 text-[10px] font-black uppercase tracking-widest px-2 py-3 rounded-xl border transition-all ${formData.categoria === cat ? 'bg-scout-primary text-white border-scout-primary' : 'bg-scout-bg-panel/50 border-scout-border'}`}>
                                                {cat === 'Gestion' ? 'Gestión' : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Costo ($)</label>
                                    <input type="number" name="costo" value={formData.costo} onChange={handleChange} className="w-full border border-scout-border rounded-xl p-3 text-sm bg-scout-bg-panel/50" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Ramas destinatarias</label>
                                <div className={`flex flex-wrap gap-2 ${formData.categoria !== 'Programa' ? 'opacity-50' : ''}`}>
                                    {RAMAS_OPTIONS.map((rama) => (
                                        <button key={rama} type="button" onClick={() => toggleRama(rama)} disabled={formData.categoria !== 'Programa'} className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border ${formData.ramas.includes(rama) ? 'bg-scout-primary text-white border-scout-primary' : 'bg-scout-bg-panel border-scout-border'}`}>
                                            {rama}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2 block">Descripción</label>
                                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full flex-1 min-h-[100px] border border-scout-border rounded-xl p-4 text-sm bg-scout-bg-panel/50 resize-none" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-scout-border flex flex-wrap items-center justify-end gap-4 shrink-0">
                        <Link
                            to="/gestion-cursos/administrar"
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="button"
                            onClick={guardarCurso}
                            disabled={isLoading}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md hover:shadow-lg ${isLoading ? 'bg-scout-muted cursor-not-allowed text-white' : 'bg-scout-primary hover:bg-scout-primary-hover text-white'}`}
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Curso'} <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarCurso;

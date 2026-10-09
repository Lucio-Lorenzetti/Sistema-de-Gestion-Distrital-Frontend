// src/pages/Dashboard/Resumen/MiGrupoCard.jsx
// El Jefe de Grupo completa el perfil público de su grupo. Todo es opcional:
// en /distrito solo se muestra lo que esté cargado.
import { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, Users as UsersIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthorizedFetch } from '../../../hooks/useAuthorizedFetch';
import RecortarFotoModal from '../Panels/Usuarios/RecortarFotoModal';

const CAMPOS = [
    { key: 'numero', label: 'Número de grupo', placeholder: 'Ej: 034', maxLength: 5, soloDigitos: true },
    { key: 'direccion', label: 'Dirección de la sede', placeholder: 'Ej: Av. Colón 80, Barrio Pompeya' },
    { key: 'telefono', label: 'Teléfono de contacto', placeholder: 'Ej: 291 555-1234', maxLength: 50 },
    { key: 'instagram', label: 'Instagram', placeholder: '@grupo o link al perfil' },
    { key: 'facebook', label: 'Facebook', placeholder: 'Link a la página' },
];

const VACIO = { numero: '', direccion: '', telefono: '', instagram: '', facebook: '', descripcion: '' };

const inputClass = 'w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors';
const labelClass = 'text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block';

const MiGrupoCard = () => {
    const { authorizedFetch } = useAuthorizedFetch();
    const fotoInputRef = useRef(null);

    const [grupo, setGrupo] = useState(null);
    const [form, setForm] = useState(VACIO);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);
    const [ok, setOk] = useState(false);
    const [imagenARecortar, setImagenARecortar] = useState(null);
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [errorFoto, setErrorFoto] = useState(null);
    const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(true);

    const cargarForm = (g) => {
        setGrupo(g);
        // "000" es el placeholder de "sin número": en el form se ve vacío.
        setForm({
            ...Object.fromEntries(Object.keys(VACIO).map((k) => [k, g[k] ?? ''])),
            numero: Number(g.numero) === 0 ? '' : g.numero,
        });
        setTelefonoWhatsapp(g.telefono_whatsapp ?? true);
    };

    useEffect(() => {
        authorizedFetch('/mi-grupo')
            .then(cargarForm)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (key, soloDigitos = false) => (e) => {
        setOk(false);
        const valor = soloDigitos ? e.target.value.replace(/\D/g, '') : e.target.value;
        setForm((f) => ({ ...f, [key]: valor }));
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError(null);
        setOk(false);
        setGuardando(true);
        try {
            const body = {
                ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null])),
                telefono_whatsapp: telefonoWhatsapp,
            };
            cargarForm(await authorizedFetch('/mi-grupo', { method: 'PUT', body }));
            setOk(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleSeleccionarFoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImagenARecortar(reader.result);
        reader.readAsDataURL(file);
    };

    const handleGuardarFotoRecortada = async (blob) => {
        setErrorFoto(null);
        setSubiendoFoto(true);
        try {
            const formData = new FormData();
            formData.append('foto', blob, 'foto-grupo.jpg');
            const res = await authorizedFetch('/mi-grupo/foto', { method: 'POST', body: formData });
            setGrupo((g) => ({ ...g, foto_url: res.foto_url }));
            setImagenARecortar(null);
        } catch (err) {
            setErrorFoto(err.message);
        } finally {
            setSubiendoFoto(false);
            if (fotoInputRef.current) fotoInputRef.current.value = '';
        }
    };

    const handleQuitarFoto = async () => {
        setErrorFoto(null);
        setSubiendoFoto(true);
        try {
            await authorizedFetch('/mi-grupo/foto', { method: 'DELETE' });
            setGrupo((g) => ({ ...g, foto_url: null }));
        } catch (err) {
            setErrorFoto(err.message);
        } finally {
            setSubiendoFoto(false);
        }
    };

    if (cargando) {
        return (
            <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
            </div>
        );
    }

    if (!grupo) {
        return (
            <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
                <p className="text-xs font-bold text-scout-accent">{error || 'No se pudo cargar tu grupo.'}</p>
            </div>
        );
    }

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-primary">
                        <UsersIcon size={22} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-scout-ink uppercase tracking-tight">Mi Grupo · {grupo.nombre}</p>
                        <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest">
                            Lo que completes se muestra en la página pública del distrito
                        </p>
                    </div>
                </div>
                <Link
                    to="/distrito"
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors"
                >
                    <ExternalLink size={12} /> Ver página pública
                </Link>
            </div>

            <div className="h-px bg-scout-border mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Foto */}
                <div className="flex flex-col items-center text-center">
                    <p className={labelClass}>Foto del grupo</p>
                    <div className="w-40 h-40 rounded-[2rem] bg-scout-accent text-white flex items-center justify-center font-black text-3xl overflow-hidden border border-scout-border">
                        {grupo.foto_url ? (
                            <img src={grupo.foto_url} alt={grupo.nombre} className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={32} className="opacity-60" />
                        )}
                    </div>
                    {errorFoto && <p className="text-xs font-bold text-scout-accent mt-2">{errorFoto}</p>}
                    <div className="flex items-center gap-2 mt-4">
                        <input ref={fotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleSeleccionarFoto} />
                        <button
                            type="button"
                            onClick={() => fotoInputRef.current?.click()}
                            disabled={subiendoFoto}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer disabled:opacity-40"
                        >
                            <Camera size={12} /> {grupo.foto_url ? 'Cambiar' : 'Subir'}
                        </button>
                        {grupo.foto_url && (
                            <button
                                type="button"
                                onClick={handleQuitarFoto}
                                disabled={subiendoFoto}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-accent/30 text-scout-accent hover:bg-scout-accent-light transition-colors cursor-pointer disabled:opacity-40"
                            >
                                <Trash2 size={12} /> Quitar
                            </button>
                        )}
                    </div>
                </div>

                {/* Datos */}
                <form onSubmit={handleGuardar} className="lg:col-span-3">
                    {error && <p className="text-xs font-bold text-scout-accent mb-3">{error}</p>}
                    {ok && <p className="text-xs font-bold text-scout-success mb-3">Datos del grupo actualizados.</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CAMPOS.map(({ key, label, placeholder, maxLength, soloDigitos }) => (
                            <div key={key}>
                                <label className={labelClass}>{label}</label>
                                <input
                                    type="text"
                                    inputMode={soloDigitos ? 'numeric' : undefined}
                                    value={form[key]}
                                    onChange={handleChange(key, soloDigitos)}
                                    placeholder={placeholder}
                                    maxLength={maxLength ?? 255}
                                    className={inputClass}
                                />
                                {key === 'telefono' && (
                                    <label className="flex items-center gap-2 mt-2 text-xs font-bold text-scout-muted cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={telefonoWhatsapp}
                                            onChange={(e) => { setOk(false); setTelefonoWhatsapp(e.target.checked); }}
                                            className="accent-[var(--color-scout-primary)] cursor-pointer"
                                        />
                                        Este número tiene WhatsApp (el botón Contactar abre un chat)
                                    </label>
                                )}
                            </div>
                        ))}
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Presentación del grupo</label>
                            <textarea
                                value={form.descripcion}
                                onChange={handleChange('descripcion')}
                                placeholder="Contá brevemente quiénes son, desde cuándo están, qué los caracteriza..."
                                maxLength={2000}
                                rows={4}
                                className={`${inputClass} resize-y`}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="mt-4 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40"
                    >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>

            {imagenARecortar && (
                <RecortarFotoModal
                    imageSrc={imagenARecortar}
                    titulo="Ajustar foto del grupo"
                    cropShape="rect"
                    onCancel={() => { setImagenARecortar(null); if (fotoInputRef.current) fotoInputRef.current.value = ''; }}
                    onConfirmar={handleGuardarFotoRecortada}
                />
            )}
        </div>
    );
};

export default MiGrupoCard;

// src/pages/Dashboard/MiPerfil.jsx
import React, { useState, useRef } from 'react';
import { UserCircle, KeyRound, Camera, Trash2, ShieldPlus, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuthorizedFetch } from '../../hooks/useAuthorizedFetch';
import SolicitarRolModal from './Panels/Usuarios/SolicitarRolModal';
import RecortarFotoModal from './Panels/Usuarios/RecortarFotoModal';
import { claseColorRol } from './Panels/Usuarios/rolColores';
import { rolesVisibles, nombreRolConScope } from './Panels/Usuarios/rolDisplay';
import { useGruposCatalogo } from './Panels/Programas/useGruposCatalogo';
import { useRamasCatalogo } from './Panels/Usuarios/useRamasCatalogo';

const getIniciales = (name) =>
    (name || '?').trim().split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const MiPerfil = () => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const { authorizedFetch } = useAuthorizedFetch();
    const fotoInputRef = useRef(null);
    const { catalogoGrupos } = useGruposCatalogo();
    const { catalogoRamas } = useRamasCatalogo();

    const [name, setName] = useState(user?.name || '');
    const [totem, setTotem] = useState(user?.totem || '');
    const [email, setEmail] = useState(user?.email || '');
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);
    const [errorPerfil, setErrorPerfil] = useState(null);
    const [okPerfil, setOkPerfil] = useState(false);

    const [mostrarSolicitarRol, setMostrarSolicitarRol] = useState(false);
    const [solicitudEnviada, setSolicitudEnviada] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [guardandoPassword, setGuardandoPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState(null);
    const [okPassword, setOkPassword] = useState(false);

    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [errorFoto, setErrorFoto] = useState(null);
    const [imagenARecortar, setImagenARecortar] = useState(null);

    const handleGuardarPerfil = async (e) => {
        e.preventDefault();
        setErrorPerfil(null);
        setOkPerfil(false);
        setGuardandoPerfil(true);
        try {
            const actualizado = await authorizedFetch('/me/perfil', { method: 'PUT', body: { name, totem: totem || null, email } });
            setUser({ ...user, ...actualizado });
            setOkPerfil(true);
        } catch (err) {
            setErrorPerfil(err.message);
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const handleCambiarPassword = async (e) => {
        e.preventDefault();
        setErrorPassword(null);
        setOkPassword(false);
        setGuardandoPassword(true);
        try {
            await authorizedFetch('/me/password', {
                method: 'PUT',
                body: { current_password: currentPassword, password, password_confirmation: passwordConfirmation },
            });
            setCurrentPassword('');
            setPassword('');
            setPasswordConfirmation('');
            setOkPassword(true);
        } catch (err) {
            setErrorPassword(err.message);
        } finally {
            setGuardandoPassword(false);
        }
    };

    // No se sube el archivo tal cual: primero se recorta/reescala en
    // RecortarFotoModal — así el usuario elige qué parte de la foto queda
    // visible, y de paso una foto de cámara de varios MB baja a unos cientos
    // de KB, muy por debajo del límite del backend.
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
            formData.append('foto_perfil', blob, 'foto-perfil.jpg');
            const res = await authorizedFetch('/me/foto-perfil', { method: 'POST', body: formData });
            setUser({ ...user, foto_perfil_url: res.foto_perfil_url });
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
            await authorizedFetch('/me/foto-perfil', { method: 'DELETE' });
            setUser({ ...user, foto_perfil_url: null });
        } catch (err) {
            setErrorFoto(err.message);
        } finally {
            setSubiendoFoto(false);
        }
    };

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2rem' }}
        >
            <div className="border-b border-scout-border pb-3 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                    Panel de Control Privado • Mi Perfil
                </span>
                <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                    <UserCircle size={20} /> Mi Perfil
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6 w-full mx-auto" style={{ flex: 1, minHeight: 0 }}>
                {/* Columna izquierda: foto + contraseña */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col items-center text-center shrink-0">
                        <div className="w-24 h-24 rounded-full bg-scout-primary text-white flex items-center justify-center font-black text-2xl overflow-hidden border-4 border-scout-bg-panel shadow-sm">
                            {user?.foto_perfil_url ? (
                                <img src={user.foto_perfil_url} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                getIniciales(user?.name)
                            )}
                        </div>
                        <p className="text-sm font-black text-scout-ink mt-3">{user?.nombre_visible || user?.name}</p>

                        {errorFoto && <p className="text-xs font-bold text-scout-accent mt-2">{errorFoto}</p>}

                        <div className="flex items-center gap-2 mt-4">
                            <input ref={fotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleSeleccionarFoto} />
                            <button
                                type="button"
                                onClick={() => fotoInputRef.current?.click()}
                                disabled={subiendoFoto}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer disabled:opacity-40"
                            >
                                <Camera size={12} /> Cambiar
                            </button>
                            {user?.foto_perfil_url && (
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

                    <form onSubmit={handleCambiarPassword} className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex-1 min-h-0 overflow-y-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary mb-3 flex items-center gap-2">
                            <KeyRound size={13} /> Cambiar contraseña
                        </h2>
                        {errorPassword && <p className="text-xs font-bold text-scout-accent mb-3">{errorPassword}</p>}
                        {okPassword && <p className="text-xs font-bold text-scout-success mb-3">Contraseña actualizada correctamente.</p>}
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    minLength={8}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={guardandoPassword}
                            className="mt-4 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40"
                        >
                            {guardandoPassword ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </div>

                {/* Columna derecha: datos personales + mis roles, lado a lado */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-0">
                    <form onSubmit={handleGuardarPerfil} className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm overflow-y-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary mb-3">Datos personales</h2>
                        {errorPerfil && <p className="text-xs font-bold text-scout-accent mb-3">{errorPerfil}</p>}
                        {okPerfil && <p className="text-xs font-bold text-scout-success mb-3">Perfil actualizado correctamente.</p>}
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">Nombre y apellido</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">
                                    Tótem / Nombre de Caza <span className="normal-case font-medium text-scout-muted/70">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={totem}
                                    onChange={(e) => setTotem(e.target.value)}
                                    placeholder="Ej: Abeja Humilde"
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-1.5 block">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full border border-scout-border rounded-xl p-2.5 text-sm bg-scout-bg-panel/50 text-scout-ink font-medium focus:outline-none focus:border-scout-primary transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={guardandoPerfil}
                            className="mt-4 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40"
                        >
                            {guardandoPerfil ? 'Guardando...' : 'Guardar datos'}
                        </button>
                    </form>

                    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col overflow-y-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-scout-primary mb-3 flex items-center gap-2">
                            <ClipboardList size={13} /> Mis roles
                        </h2>

                        {solicitudEnviada && (
                            <p className="text-xs font-bold text-scout-success mb-3">
                                Solicitud enviada — queda pendiente de aprobación.
                            </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {rolesVisibles(user?.roles ?? []).length === 0 ? (
                                <span className="text-xs text-scout-muted font-medium">Sin roles asignados.</span>
                            ) : (
                                rolesVisibles(user?.roles ?? []).map((rol) => (
                                    <span key={rol.id} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${claseColorRol(rol.nombre)}`}>
                                        {nombreRolConScope(rol, { ramas: catalogoRamas, grupos: catalogoGrupos })}
                                    </span>
                                ))
                            )}
                        </div>

                        <p className="text-xs text-scout-muted font-medium mb-3">
                            ¿Cambiaste de rama/grupo o querés sumar otro rol? Alguien con la potestad correspondiente lo tiene que aprobar.
                        </p>

                        <button
                            type="button"
                            onClick={() => { setSolicitudEnviada(false); setMostrarSolicitarRol(true); }}
                            className="mt-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer"
                        >
                            <ShieldPlus size={12} /> Solicitar rol / cambio
                        </button>
                    </div>
                </div>
            </div>

            {mostrarSolicitarRol && (
                <SolicitarRolModal
                    onClose={() => setMostrarSolicitarRol(false)}
                    onSolicitado={async () => { setMostrarSolicitarRol(false); setSolicitudEnviada(true); }}
                />
            )}

            {imagenARecortar && (
                <RecortarFotoModal
                    imageSrc={imagenARecortar}
                    onCancel={() => { setImagenARecortar(null); if (fotoInputRef.current) fotoInputRef.current.value = ''; }}
                    onConfirmar={handleGuardarFotoRecortada}
                />
            )}
        </div>
    );
};

export default MiPerfil;

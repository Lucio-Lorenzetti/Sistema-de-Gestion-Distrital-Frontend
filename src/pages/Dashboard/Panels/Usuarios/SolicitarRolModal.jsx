// src/pages/Dashboard/Panels/Usuarios/SolicitarRolModal.jsx
// Para cualquier usuario ya activo: pedir un rol adicional, o un cambio de
// rama/grupo de un rol que ya tiene (ej. un Educador que pasa de rama, un Aux
// Prog Rama que se muda a otra rama). Si ya lo tenía, aprobar la solicitud
// actualiza el scope existente en vez de duplicarlo.
import React, { useState, useEffect, useMemo } from 'react';
import { X, ShieldPlus } from 'lucide-react';
import Select from '../../../../components/ui/Select';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import { useAuthStore } from '../../../../store/useAuthStore';
import { ordenarRamas } from '../../../../utils/ordenRamas';

const SolicitarRolModal = ({ onClose, onSolicitado }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const usuarioActual = useAuthStore((state) => state.user);
    const [roles, setRoles] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [ramas, setRamas] = useState([]);
    const [roleId, setRoleId] = useState('');
    const [grupoId, setGrupoId] = useState('');
    const [ramaId, setRamaId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            authorizedFetch('/roles/solicitables'),
            authorizedFetch('/grupos'),
            authorizedFetch('/ramas'),
        ]).then(([resRoles, resGrupos, resRamas]) => {
            setRoles(resRoles);
            setGrupos(resGrupos);
            setRamas(ordenarRamas(resRamas));
        }).catch((err) => setError(err.message));
    }, []);

    const rolSeleccionado = useMemo(
        () => roles.find((r) => String(r.id) === String(roleId)),
        [roles, roleId]
    );

    // Es común que alguien ya tenga un grupo/rama asignado (de otro rol, o de
    // este mismo antes de pedir el cambio) — traerlo precargado evita que
    // tenga que volver a elegir lo mismo que ya tiene. Igual lo puede cambiar.
    const handleSeleccionarRol = (nuevoRoleId) => {
        setRoleId(nuevoRoleId);
        const rol = roles.find((r) => String(r.id) === String(nuevoRoleId));
        setGrupoId(rol?.requiere_grupo && usuarioActual?.grupo_id ? String(usuarioActual.grupo_id) : '');
        setRamaId(rol?.requiere_rama && usuarioActual?.rama_id ? String(usuarioActual.rama_id) : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await authorizedFetch('/solicitudes-rol', {
                method: 'POST',
                body: {
                    role_id: roleId,
                    rama_id: rolSeleccionado?.requiere_rama ? ramaId : null,
                    grupo_id: rolSeleccionado?.requiere_grupo ? grupoId : null,
                },
            });
            await onSolicitado?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-scout-bg-card w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-scout-border animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer">
                    <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-1">
                    <ShieldPlus size={16} className="text-scout-primary" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-scout-ink">Solicitar Rol / Cambio</h2>
                </div>
                <p className="text-xs text-scout-muted font-medium mb-5">
                    Si ya tenés este rol, la solicitud actualiza tu rama/grupo (ej. cambiaste de rama). Alguien con la potestad correspondiente la tiene que aprobar.
                </p>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-scout-accent-light border border-scout-accent/20 rounded-xl text-xs font-bold text-scout-accent">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Select
                        label="Rol"
                        id="role_id"
                        value={roleId}
                        onChange={(e) => handleSeleccionarRol(e.target.value)}
                        options={roles.map((r) => ({ value: r.id, label: r.nombre }))}
                        required
                    />

                    {rolSeleccionado?.requiere_grupo && (
                        <Select
                            label="Grupo"
                            id="grupo_id"
                            value={grupoId}
                            onChange={(e) => setGrupoId(e.target.value)}
                            options={grupos.map((g) => ({ value: g.id, label: g.nombre }))}
                            required
                        />
                    )}

                    {rolSeleccionado?.requiere_rama && (
                        <Select
                            label="Rama"
                            id="rama_id"
                            value={ramaId}
                            onChange={(e) => setRamaId(e.target.value)}
                            options={ramas.map((r) => ({ value: r.id, label: r.nombre }))}
                            required
                        />
                    )}

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!roleId || isSubmitting}
                            className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                        >
                            {isSubmitting ? 'Enviando...' : 'Solicitar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SolicitarRolModal;

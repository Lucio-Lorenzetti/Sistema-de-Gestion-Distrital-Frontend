// src/pages/Dashboard/Panels/Usuarios/AsignarRolModal.jsx
// Solo Developer: asigna cualquier rol+scope directo a un usuario, sin pasar
// por el circuito de solicitud/aprobación.
import React, { useState, useEffect, useMemo } from 'react';
import { X, ShieldPlus } from 'lucide-react';
import Select from '../../../../components/ui/Select';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import { ordenarRamas } from '../../../../utils/ordenRamas';

const AsignarRolModal = ({ usuario, onClose, onAsignado }) => {
    const { authorizedFetch } = useAuthorizedFetch();
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
            authorizedFetch('/roles'),
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await authorizedFetch(`/usuarios/${usuario.id}/roles`, {
                method: 'POST',
                body: {
                    role_id: roleId,
                    rama_id: rolSeleccionado?.requiere_rama ? ramaId : null,
                    grupo_id: rolSeleccionado?.requiere_grupo ? grupoId : null,
                },
            });
            await onAsignado?.();
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
                    <h2 className="text-sm font-black uppercase tracking-widest text-scout-ink">Asignar Rol Directo</h2>
                </div>
                <p className="text-xs text-scout-muted font-medium mb-5">
                    Para "{usuario.name}" — sin pasar por solicitud ni aprobación.
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
                        onChange={(e) => { setRoleId(e.target.value); setGrupoId(''); setRamaId(''); }}
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
                            {isSubmitting ? 'Asignando...' : 'Asignar rol'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsignarRolModal;

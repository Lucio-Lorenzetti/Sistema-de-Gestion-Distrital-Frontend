// src/pages/Dashboard/Panels/Sistema/RolesMetadataTable.jsx
import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const CAMPOS_EDITABLES = ['requiere_rama', 'requiere_grupo', 'autosolicitable', 'unico_por_usuario', 'reemplazo_unico'];

const esIgual = (a, b) => CAMPOS_EDITABLES.every((campo) => (a[campo] ?? null) === (b[campo] ?? null));

const RolesMetadataTable = ({ roles, isLoading, onGuardado }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [borradores, setBorradores] = useState({});
    const [guardandoId, setGuardandoId] = useState(null);
    const [guardadoId, setGuardadoId] = useState(null);
    const [error, setError] = useState(null);

    // Reinicia los borradores cuando cambia la lista real de roles (carga inicial
    // o después de un refetch), sin pisar ediciones en curso de otra fila.
    useEffect(() => {
        setBorradores((prev) => {
            const siguiente = { ...prev };
            roles.forEach((rol) => {
                if (!siguiente[rol.id]) siguiente[rol.id] = { ...rol };
            });
            return siguiente;
        });
    }, [roles]);

    const handleCampoChange = (rolId, campo, valor) => {
        setBorradores((prev) => ({ ...prev, [rolId]: { ...prev[rolId], [campo]: valor } }));
    };

    const handleGuardar = async (rol) => {
        const borrador = borradores[rol.id];
        setError(null);
        setGuardandoId(rol.id);
        try {
            await authorizedFetch(`/roles/${rol.id}`, {
                method: 'PUT',
                body: {
                    requiere_rama: borrador.requiere_rama,
                    requiere_grupo: borrador.requiere_grupo,
                    autosolicitable: borrador.autosolicitable,
                    unico_por_usuario: borrador.unico_por_usuario,
                    reemplazo_unico: borrador.reemplazo_unico || null,
                },
            });
            await onGuardado?.();
            setGuardadoId(rol.id);
            setTimeout(() => setGuardadoId((actual) => (actual === rol.id ? null : actual)), 2000);
        } catch (err) {
            console.error('Error al guardar el rol:', err);
            setError(`No se pudo guardar "${rol.nombre}": ` + err.message);
        } finally {
            setGuardandoId(null);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            {error && (
                <div className="mb-5 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                    {error}
                </div>
            )}
            <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Roles del Sistema</h2>
            <p className="text-[10px] font-bold text-scout-muted uppercase tracking-widest mt-1 shrink-0">
                Metadata de cada rol: qué scope pide, si se puede autosolicitar, si reemplaza a alguien al designarlo.
            </p>
            <div className="h-px bg-scout-border shrink-0 mt-5" />

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando roles...</p>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6 flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                <th className="pb-3 font-black">Rol</th>
                                <th className="pb-3 font-black text-center">Requiere Rama</th>
                                <th className="pb-3 font-black text-center">Requiere Grupo</th>
                                <th className="pb-3 font-black text-center">Autosolicitable</th>
                                <th className="pb-3 font-black text-center">Único por usuario</th>
                                <th className="pb-3 font-black text-center">Reemplazo único</th>
                                <th className="pb-3 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-scout-border">
                            {roles.map((rol) => {
                                const borrador = borradores[rol.id] || rol;
                                const esDeveloper = rol.nombre.toLowerCase() === 'developer';
                                const dirty = !esIgual(borrador, rol);

                                return (
                                    <tr key={rol.id} className="group hover:bg-scout-bg-panel transition-colors">
                                        <td className="py-4 pr-4">
                                            <p className="text-xs font-bold text-scout-ink">{rol.nombre}</p>
                                        </td>
                                        {['requiere_rama', 'requiere_grupo', 'autosolicitable', 'unico_por_usuario'].map((campo) => (
                                            <td key={campo} className="py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={!!borrador[campo]}
                                                    disabled={esDeveloper}
                                                    onChange={(e) => handleCampoChange(rol.id, campo, e.target.checked)}
                                                    className="w-4 h-4 accent-scout-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                                />
                                            </td>
                                        ))}
                                        <td className="py-4 text-center">
                                            <select
                                                value={borrador.reemplazo_unico || ''}
                                                disabled={esDeveloper}
                                                onChange={(e) => handleCampoChange(rol.id, 'reemplazo_unico', e.target.value || null)}
                                                className="text-[10px] font-bold uppercase tracking-wide border border-scout-border rounded-lg px-2 py-1 bg-scout-bg-panel/50 text-scout-ink cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <option value="">Ninguno</option>
                                                <option value="grupo">Grupo</option>
                                                <option value="distrito">Distrito</option>
                                            </select>
                                        </td>
                                        <td className="py-4 text-right">
                                            {esDeveloper ? (
                                                <span className="text-[9px] font-bold text-scout-muted uppercase tracking-widest">No editable</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleGuardar(rol)}
                                                    disabled={!dirty || guardandoId === rol.id}
                                                    className={`inline-flex items-center gap-1.5 p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default ${
                                                        guardadoId === rol.id
                                                            ? 'border-scout-success/30 text-scout-success'
                                                            : 'border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel'
                                                    }`}
                                                    title="Guardar cambios"
                                                >
                                                    {guardadoId === rol.id ? <Check size={13} /> : <Save size={13} />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RolesMetadataTable;

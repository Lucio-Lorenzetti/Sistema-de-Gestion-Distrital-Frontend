// src/pages/Dashboard/Panels/Usuarios/UsuariosTable.jsx
import React, { useState, useMemo } from 'react';
import { Users, Trash2, ShieldPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import FiltroDropdown from '../Programas/FiltroDropdown';
import AsignarRolModal from './AsignarRolModal';
import { claseColorRol } from './rolColores';
import { rolesVisibles, nombreRolConScope } from './rolDisplay';

const ITEMS_PER_PAGE = 8;

const FILTROS_ALCANCE = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Distrito', label: 'Distrito' },
    { key: 'Grupos', label: 'Grupos' },
];

// El grupo/rama real de un usuario puede venir del caché (users.grupo_id/rama_id,
// que solo sincroniza la asignación de Educador) o del pivot de otro rol
// (Jefe de Grupo lleva grupo_id propio; Aux Prog Rama lleva rama_id propio).
const grupoIdDeUsuario = (usuario) =>
    usuario.grupo_id ?? (usuario.roles ?? []).find((r) => r.pivot?.grupo_id)?.pivot?.grupo_id ?? null;

const ramaIdDeUsuario = (usuario) =>
    usuario.rama_id ?? (usuario.roles ?? []).find((r) => r.pivot?.rama_id)?.pivot?.rama_id ?? null;

const UsuariosTable = ({ usuarios, isLoading, onCambio, grupos = [], ramas = [] }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const user = useAuthStore((state) => state.user);
    const roleNames = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
    const esDeveloper = roleNames.includes('developer');
    const esDirectorODeveloper = roleNames.includes('director') || esDeveloper;

    const [currentPage, setCurrentPage] = useState(1);
    const [filtroAlcance, setFiltroAlcance] = useState('Todos');
    const [filtroGrupoEspecifico, setFiltroGrupoEspecifico] = useState('Todos');
    const [filtroRama, setFiltroRama] = useState('Todos');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [usuarioAAsignar, setUsuarioAAsignar] = useState(null);
    const [error, setError] = useState(null);

    const opcionesGrupoEspecifico = useMemo(
        () => [{ key: 'Todos', label: 'Todos' }, ...grupos.map((g) => ({ key: String(g.id), label: g.nombre }))],
        [grupos]
    );
    const opcionesRama = useMemo(
        () => [{ key: 'Todos', label: 'Todos' }, ...ramas.map((r) => ({ key: r.nombre, label: r.nombre }))],
        [ramas]
    );

    const usuariosFiltrados = useMemo(() => {
        if (esDirectorODeveloper) {
            if (filtroAlcance === 'Distrito') return usuarios.filter((u) => !grupoIdDeUsuario(u));
            if (filtroAlcance === 'Grupos') {
                const deGrupo = usuarios.filter((u) => grupoIdDeUsuario(u));
                if (filtroGrupoEspecifico === 'Todos') return deGrupo;
                return deGrupo.filter((u) => Number(grupoIdDeUsuario(u)) === Number(filtroGrupoEspecifico));
            }
            return usuarios;
        }

        // Vista de Jefe de Grupo: filtro por rama (Educadores/Aux Prog Rama de su grupo).
        if (filtroRama === 'Todos') return usuarios;
        const ramaId = ramas.find((r) => r.nombre === filtroRama)?.id;
        return usuarios.filter((u) => Number(ramaIdDeUsuario(u)) === Number(ramaId));
    }, [usuarios, esDirectorODeveloper, filtroAlcance, filtroGrupoEspecifico, filtroRama, ramas]);

    const totalPages = Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE) || 1;
    const usuariosPagina = usuariosFiltrados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFiltroAlcanceChange = (key) => { setFiltroAlcance(key); setFiltroGrupoEspecifico('Todos'); setCurrentPage(1); };
    const handleFiltroGrupoEspecificoChange = (key) => { setFiltroGrupoEspecifico(key); setCurrentPage(1); };
    const handleFiltroRamaChange = (key) => { setFiltroRama(key); setCurrentPage(1); };

    const handleEliminar = async (usuario) => {
        if (!window.confirm(`¿Eliminar la cuenta de "${usuario.name}"? Se puede restaurar después desde la Papelera.`)) {
            return;
        }
        setEliminandoId(usuario.id);
        setError(null);
        try {
            await authorizedFetch(`/usuarios/${usuario.id}`, { method: 'DELETE' });
            await onCambio?.();
        } catch (err) {
            console.error('Error al eliminar el usuario:', err);
            setError('No se pudo eliminar el usuario: ' + err.message);
        } finally {
            setEliminandoId(null);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 420 }}>
            {error && (
                <div className="mb-5 px-5 py-4 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                    {error}
                </div>
            )}
            <div className="flex items-center justify-between shrink-0 flex-wrap gap-3">
                <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Usuarios</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    {esDirectorODeveloper ? (
                        <>
                            <FiltroDropdown options={FILTROS_ALCANCE} value={filtroAlcance} onChange={handleFiltroAlcanceChange} />
                            {filtroAlcance === 'Grupos' && (
                                <FiltroDropdown options={opcionesGrupoEspecifico} value={filtroGrupoEspecifico} onChange={handleFiltroGrupoEspecificoChange} />
                            )}
                        </>
                    ) : (
                        <FiltroDropdown options={opcionesRama} value={filtroRama} onChange={handleFiltroRamaChange} />
                    )}
                </div>
            </div>
            <div className="h-px bg-scout-border shrink-0 mt-5" />

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando usuarios...</p>
                </div>
            ) : usuariosPagina.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                    <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><Users size={20} /></div>
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay usuarios para mostrar</p>
                </div>
            ) : (
                <div className="overflow-x-auto mt-6 flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                <th className="pb-3 font-black">Nombre</th>
                                <th className="pb-3 font-black">Email</th>
                                <th className="pb-3 font-black">Roles</th>
                                <th className="pb-3 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-scout-border">
                            {usuariosPagina.map((usuario) => (
                                <tr key={usuario.id} className="group hover:bg-scout-bg-panel transition-colors">
                                    <td className="py-4 pr-4">
                                        <p className="text-xs font-bold text-scout-ink">{usuario.nombre_visible || usuario.name}</p>
                                        {!usuario.activo && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-scout-accent">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{usuario.email}</td>
                                    <td className="py-4 pr-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {rolesVisibles(usuario.roles ?? []).map((rol) => (
                                                <span key={rol.id} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap ${claseColorRol(rol.nombre)}`}>
                                                    {nombreRolConScope(rol, { ramas, grupos })}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {esDeveloper && Number(usuario.id) !== Number(user?.id) && (
                                                <>
                                                    <button
                                                        onClick={() => setUsuarioAAsignar(usuario)}
                                                        className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                                                        title="Asignar rol directo"
                                                    >
                                                        <ShieldPlus size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(usuario)}
                                                        disabled={eliminandoId === usuario.id}
                                                        className="p-1.5 rounded-lg border border-scout-accent/30 hover:bg-scout-accent-light text-scout-accent transition-colors cursor-pointer disabled:opacity-40"
                                                        title="Eliminar usuario"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {usuariosFiltrados.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
                    <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentPage} / {totalPages}</span>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
                    </div>
                </div>
            )}

            {usuarioAAsignar && (
                <AsignarRolModal
                    usuario={usuarioAAsignar}
                    onClose={() => setUsuarioAAsignar(null)}
                    onAsignado={async () => { setUsuarioAAsignar(null); await onCambio?.(); }}
                />
            )}
        </div>
    );
};

export default UsuariosTable;

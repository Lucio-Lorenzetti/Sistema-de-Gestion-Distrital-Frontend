// src/pages/Dashboard/Usuarios.jsx
import React, { useState } from 'react';
import { Users, Crown, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUsuarios } from './Panels/Usuarios/useUsuarios';
import { useSolicitudesRol } from './Panels/Usuarios/useSolicitudesRol';
import { useGruposCatalogo } from './Panels/Programas/useGruposCatalogo';
import { useRamasCatalogo } from './Panels/Usuarios/useRamasCatalogo';
import UsuariosTable from './Panels/Usuarios/UsuariosTable';
import SolicitudesRolTable from './Panels/Usuarios/SolicitudesRolTable';
import DesignarJefeGrupoModal from './Panels/Usuarios/DesignarJefeGrupoModal';
import DesignarDirectorModal from './Panels/Usuarios/DesignarDirectorModal';

const Usuarios = () => {
    const user = useAuthStore((state) => state.user);
    const { usuarios, isLoading: cargandoUsuarios, refetch: refetchUsuarios } = useUsuarios();
    const { solicitudes, isLoading: cargandoSolicitudes, refetch: refetchSolicitudes } = useSolicitudesRol();
    const { catalogoGrupos } = useGruposCatalogo();
    const { catalogoRamas } = useRamasCatalogo();

    const [mostrarDesignarJefe, setMostrarDesignarJefe] = useState(false);
    const [mostrarDesignarDirector, setMostrarDesignarDirector] = useState(false);

    const roles = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
    const esDirector = roles.includes('director');
    const esDeveloper = roles.includes('developer');
    const rolJefeDeGrupo = (user?.roles ?? []).find((r) => r.nombre.toLowerCase() === 'jefe de grupo');

    const puedeDesignarJefeDeGrupo = esDirector || esDeveloper || !!rolJefeDeGrupo;
    const puedeDesignarDirector = esDirector || esDeveloper;

    // Si el actor es Jefe de Grupo (y no Director/Developer), el grupo a designar
    // es siempre el suyo — mismo criterio que UserPolicy::designarJefeDeGrupo().
    const grupoFijo = !esDirector && !esDeveloper && rolJefeDeGrupo
        ? catalogoGrupos.find((g) => Number(g.id) === Number(rolJefeDeGrupo.pivot?.grupo_id))
        : null;

    const handleCambio = async () => {
        await Promise.all([refetchUsuarios(), refetchSolicitudes()]);
    };

    return (
        <div
            className="bg-scout-bg-panel text-left relative"
            style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
        >
            <div className="border-b border-scout-border pb-4 shrink-0 flex items-end justify-between flex-wrap gap-3">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
                        Panel de Control Privado • Gestión de Usuarios
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase flex items-center gap-2">
                        <Users size={20} /> {esDirector || esDeveloper ? 'Usuarios del Distrito' : 'Usuarios de tu Grupo'}
                    </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {puedeDesignarJefeDeGrupo && (
                        <button
                            onClick={() => setMostrarDesignarJefe(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-card transition-colors cursor-pointer"
                        >
                            <Crown size={12} /> Designar Jefe de Grupo
                        </button>
                    )}
                    {puedeDesignarDirector && (
                        <button
                            onClick={() => setMostrarDesignarDirector(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-card transition-colors cursor-pointer"
                        >
                            <UserPlus size={12} /> Designar Director
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-8 overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
                {(cargandoSolicitudes || solicitudes.length > 0) && (
                    <SolicitudesRolTable solicitudes={solicitudes} isLoading={cargandoSolicitudes} onCambio={handleCambio} />
                )}
                <UsuariosTable usuarios={usuarios} isLoading={cargandoUsuarios} onCambio={handleCambio} grupos={catalogoGrupos} ramas={catalogoRamas} />
            </div>

            {mostrarDesignarJefe && (
                <DesignarJefeGrupoModal
                    grupos={catalogoGrupos}
                    usuarios={usuarios}
                    grupoFijo={grupoFijo}
                    onClose={() => setMostrarDesignarJefe(false)}
                    onDesignado={async () => { setMostrarDesignarJefe(false); await handleCambio(); }}
                />
            )}

            {mostrarDesignarDirector && (
                <DesignarDirectorModal
                    usuarios={usuarios}
                    onClose={() => setMostrarDesignarDirector(false)}
                    onDesignado={async () => { setMostrarDesignarDirector(false); await handleCambio(); }}
                />
            )}
        </div>
    );
};

export default Usuarios;

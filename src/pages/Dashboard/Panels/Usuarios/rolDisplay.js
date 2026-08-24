// src/pages/Dashboard/Panels/Usuarios/rolDisplay.js
// Cómo se muestran los roles de un usuario en las pantallas de Usuarios/Mi Perfil.

// Si además de Educador el usuario es Jefe de Grupo, el de Jefe de Grupo ya
// implica su lugar en el grupo — mostrar los dos es redundante y confunde.
export const rolesVisibles = (roles = []) => {
    const esJefeDeGrupo = roles.some((r) => r.nombre.toLowerCase() === 'jefe de grupo');
    if (!esJefeDeGrupo) return roles;
    return roles.filter((r) => r.nombre.toLowerCase() !== 'educador');
};

// "Educador de Lobatos de Pompeya", "Jefe de Grupo de Pompeya", "Aux Prog Rama
// de Rovers" — nombres reales de rama/grupo en vez del genérico "(rama+grupo)".
// Roles sin scope (Director, Aux Prog General, Aux Comunicación, Developer)
// se muestran tal cual.
export const nombreRolConScope = (rol, { ramas = [], grupos = [] } = {}) => {
    const { rama_id: ramaId, grupo_id: grupoId } = rol.pivot || {};
    const nombreRama = ramas.find((r) => Number(r.id) === Number(ramaId))?.nombre;
    const nombreGrupo = grupos.find((g) => Number(g.id) === Number(grupoId))?.nombre;

    if (nombreRama && nombreGrupo) return `${rol.nombre} de ${nombreRama} de ${nombreGrupo}`;
    if (nombreRama) return `${rol.nombre} de ${nombreRama}`;
    if (nombreGrupo) return `${rol.nombre} de ${nombreGrupo}`;
    return rol.nombre;
};

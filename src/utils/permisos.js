// src/utils/permisos.js
//
// Qué secciones del panel privado puede abrir cada usuario. Espeja las Policies
// / checks inline del backend — el back es quien realmente autoriza; esto solo
// evita mostrar (o dejar entrar a) pantallas que después van a tirar 403.
//
// Se mira TODOS los roles del usuario, no el rol "principal" de useUserRole():
// un Jefe de Grupo que además es Aux Comunicación tiene que poder gestionar cursos.
//
// Developer bypassea todo en el back (Gate::before / hasRole()), así que acá
// también cuenta para todo.

const tieneAlguno = (roleNames, roles) => roles.some((r) => roleNames.includes(r));

export const getRoleNames = (user) => (user?.roles ?? []).map((r) => r.nombre.toLowerCase());

export const getPermisos = (user) => {
    const roleNames = getRoleNames(user);
    const esDeveloper = roleNames.includes('developer');
    const esDirector = roleNames.includes('director');
    const alguno = (roles) => esDeveloper || tieneAlguno(roleNames, roles);

    return {
        esDeveloper,
        esDirector,
        // NewsController / DownloadController (inline) + CoursePolicy.
        gestionarComunicacion: alguno(['director', 'aux comunicación', 'aux comunicacion']),
        // ProgramPolicy::viewAny().
        verProgramas: alguno(['educador', 'director', 'aux prog general', 'aux prog rama', 'jefe de grupo']),
        // ProgramPolicy::create().
        crearProgramas: alguno(['educador']),
        // UserPolicy::viewAny().
        gestionarUsuarios: alguno(['director', 'jefe de grupo']),
        // FeatureRequestController: Director propone, Developer triagea.
        peticionesMejora: esDirector || esDeveloper,
        // RolePolicy / Actualizaciones: solo Developer.
        sistema: esDeveloper,
    };
};

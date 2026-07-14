// src/pages/Dashboard/dashboard.permissions.js
export const ROLES = {
    DIRECTOR: 'director',
    JEFE_GRUPO: 'jefe_grupo',
    AUX_PROGRAMA: 'auxiliar_programa',
    AUX_COMUNICACION: 'auxiliar_comunicacion',
    EDUCADOR: 'educador',
};

// Qué RESUMEN (card compacta) ve cada rol en el Dashboard
export const RESUMEN_ACCESS = {
    noticias: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
    cursos: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
    documentacion: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
};

// Qué GESTIÓN completa (ruta /gestion-x) puede abrir cada rol
export const GESTION_ACCESS = {
    noticias: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
    cursos: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
    documentacion: [ROLES.AUX_COMUNICACION, ROLES.DIRECTOR],
    programas: [ROLES.AUX_PROGRAMA, ROLES.EDUCADOR, ROLES.JEFE_GRUPO, ROLES.DIRECTOR],
    usuarios: [ROLES.EDUCADOR, ROLES.JEFE_GRUPO, ROLES.DIRECTOR],
};

export const canAccess = (matrix, key, role) => matrix[key]?.includes(role) ?? false;
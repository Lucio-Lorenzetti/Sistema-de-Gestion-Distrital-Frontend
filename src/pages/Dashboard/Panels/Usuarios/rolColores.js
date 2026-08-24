// src/pages/Dashboard/Panels/Usuarios/rolColores.js
// Un color por rol para distinguirlos de un vistazo en las tablas de Usuarios.
// Mismo criterio que EstadoBadge.jsx: tonos "900" fijos + texto blanco, así
// se leen igual de bien en modo claro y oscuro sin necesidad de variantes.
const ROL_COLORES = {
    'director': 'bg-purple-900 text-white',
    'aux prog general': 'bg-blue-900 text-white',
    'aux prog rama': 'bg-blue-900 text-white', // mismo color que Aux Prog General, a propósito
    'aux comunicación': 'bg-pink-900 text-white',
    'jefe de grupo': 'bg-orange-900 text-white',
    'educador': 'bg-emerald-900 text-white',
    'developer': 'bg-black text-white',
};
const COLOR_DEFAULT = 'bg-scout-bg-panel border border-scout-border text-scout-muted';

export const claseColorRol = (nombreRol) => ROL_COLORES[nombreRol?.toLowerCase()] ?? COLOR_DEFAULT;

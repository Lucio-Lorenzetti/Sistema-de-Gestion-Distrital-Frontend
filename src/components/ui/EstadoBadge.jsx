// src/components/ui/EstadoBadge.jsx
// Única fuente de verdad para el color de cada estado — de CUALQUIER recurso
// que tenga estados. Para retocar un color, tocar solo este archivo.
//
// "text-scout-on-brand" (en vez de "text-white" fijo) es a propósito en los
// fondos scout-primary/scout-success: esos dos tokens se aclaran en modo
// oscuro (para que resalten sobre el fondo oscuro general) y ahí blanco deja
// de leerse bien — ese token pasa a negro solo en modo oscuro. Los fondos
// fijos (red-900, yellow-900, etc.) no cambian con el tema, así que blanco
// siempre les queda bien y no necesitan ese token.
const ESTADO_STYLES = {
    // Programas (Program.estado: borrador | enviado | aprobado | rechazado)
    Borrador: 'bg-scout-bg-panel text-scout-muted border border-scout-border',
    Enviado: 'bg-scout-primary/90 text-scout-on-brand',
    Aprobado: 'bg-scout-success text-scout-on-brand',
    Rechazado: 'bg-red-900 text-white',

    // Noticias (News.estado: Borrador | Programada | Publicada — Borrador se
    // comparte con Programas arriba, mismo estilo neutro)
    Programada: 'bg-scout-primary/90 text-scout-on-brand',
    Publicada: 'bg-scout-success text-scout-on-brand',

    // Cursos (Course.estado es calculado por fecha, no se persiste: Abierto | Cerrado | Finalizado)
    Abierto: 'bg-scout-success text-scout-on-brand',
    Cerrado: 'bg-yellow-900 text-white',
    Finalizado: 'bg-red-900 text-white',

    // Sin uso real hoy (no lo emite ningún recurso actual) — se deja por si se
    // retoma un estado de "revisión con observaciones" más adelante.
    Observado: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
};
const DEFAULT_STYLE = 'bg-scout-bg-panel text-scout-primary border border-scout-border';

const EstadoBadge = ({ estado }) => (
    <span
        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap ${ESTADO_STYLES[estado] ?? DEFAULT_STYLE}`}
    >
        {estado}
    </span>
);

export default EstadoBadge;

// src/components/ui/EstadoBadge.jsx
const ESTADO_STYLES = {
    Aprobado: 'bg-scout-success text-white',
    Publicada: 'bg-scout-success text-white',
    Observado: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Programada: 'bg-blue-100 text-blue-700 border border-blue-200',
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
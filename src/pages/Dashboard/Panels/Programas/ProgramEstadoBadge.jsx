// src/pages/Dashboard/Panels/Programas/ProgramEstadoBadge.jsx
import React from 'react';

// TODO: si tienen un EstadoBadge.jsx genérico, unificar con ese en vez de este local.
const ESTADO_STYLES = {
    borrador: 'bg-gray-100 text-gray-600 border-gray-200',
    revision: 'bg-amber-50 text-amber-700 border-amber-200',
    publicado: 'bg-green-50 text-scout-success border-green-200',
    rechazado: 'bg-red-50 text-scout-accent border-red-200',
};

const ProgramEstadoBadge = ({ estado }) => (
    <span
        className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${ESTADO_STYLES[estado] || 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
    >
        {estado}
    </span>
);

export default ProgramEstadoBadge;
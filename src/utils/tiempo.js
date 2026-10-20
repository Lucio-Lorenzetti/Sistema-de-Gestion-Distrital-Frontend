// src/utils/tiempo.js
// "hace 5 min", "hace 3 h", "hace 2 días" a partir de una fecha ISO.
export const tiempoRelativo = (iso) => {
    if (!iso) return null;

    const segundos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (segundos < 60) return 'hace instantes';

    const minutos = Math.round(segundos / 60);
    if (minutos < 60) return `hace ${minutos} min`;

    const horas = Math.round(minutos / 60);
    if (horas < 48) return `hace ${horas} h`;

    return `hace ${Math.round(horas / 24)} días`;
};

export const horasDesde = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 3_600_000 : null);

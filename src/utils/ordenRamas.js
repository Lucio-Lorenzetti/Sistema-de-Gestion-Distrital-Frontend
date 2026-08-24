// src/utils/ordenRamas.js
// Orden institucional de las ramas — NUNCA alfabético. Cualquier lugar de la
// app que liste/ordene ramas tiene que usar esto (antes vivía duplicado como
// constante local en ProgramasTable.jsx).
export const ORDEN_RAMAS = ['Castores', 'Lobatos', 'Unidad Scout', 'Caminantes', 'Rovers'];

// Reordena un array de ramas (objetos con .nombre, ej. lo que devuelve GET /ramas)
// según ORDEN_RAMAS. Ramas no reconocidas quedan al final, en el orden que vinieron.
export const ordenarRamas = (ramas) => {
    const indice = (nombre) => {
        const i = ORDEN_RAMAS.indexOf(nombre);
        return i === -1 ? ORDEN_RAMAS.length : i;
    };
    return [...ramas].sort((a, b) => indice(a.nombre) - indice(b.nombre));
};

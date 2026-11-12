// src/utils/enmascararEmail.js
//
// "lorenzettilucioadriel@gmail.com" -> "lo***@gmail.com"
//
// Se usa en las pantallas que explican a QUÉ dirección va el mail de recuperación.
// Siempre deja la misma cantidad de asteriscos, para no revelar cuántas letras
// tiene el correo, y se arma a partir de lo que escribió la persona (no de la
// base de datos), así que no delata si una cuenta existe o no.
export const enmascararEmail = (email = '') => {
    const limpio = String(email).trim();
    const arroba = limpio.lastIndexOf('@');
    if (arroba < 1) return limpio;

    const usuario = limpio.slice(0, arroba);
    const dominio = limpio.slice(arroba);
    return `${usuario.slice(0, 2)}***${dominio}`;
};

// src/components/ui/Avatar.jsx
import React from 'react';

const getIniciales = (name) =>
    (name || '?')
        .trim()
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

const SIZES = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
};

// Mismo patrón de iniciales que el avatar de MainLayout (círculo con
// fondo primary), reutilizado acá para los hilos de comentarios.
const Avatar = ({ name, size = 'sm' }) => (
    <div
        className={`shrink-0 rounded-full bg-scout-primary text-white flex items-center justify-center font-black border border-scout-primary-hover ${SIZES[size]}`}
    >
        {getIniciales(name)}
    </div>
);

export default Avatar;

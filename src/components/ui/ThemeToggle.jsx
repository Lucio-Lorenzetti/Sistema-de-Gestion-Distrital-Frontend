// src/components/ui/ThemeToggle.jsx
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

const useSystemPrefersDark = () => {
    const [prefersDark, setPrefersDark] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setPrefersDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return prefersDark;
};

// Ícono muestra el modo AL QUE SE PASARÍA si el usuario nunca eligió manualmente
// ('system'), toma como referencia lo que el SO está mostrando ahora mismo.
const ThemeToggle = ({ className = '' }) => {
    const preference = useThemeStore((s) => s.preference);
    const toggle = useThemeStore((s) => s.toggle);
    const systemPrefersDark = useSystemPrefersDark();

    const isDark = preference === 'system' ? systemPrefersDark : preference === 'dark';

    return (
        <button
            type="button"
            onClick={toggle}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={`p-2 rounded-lg text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer ${className}`}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default ThemeToggle;

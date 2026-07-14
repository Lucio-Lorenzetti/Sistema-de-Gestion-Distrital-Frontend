// src/hooks/useClickOutside.js
import { useEffect } from 'react';

export function useClickOutside(ref, onOutsideClick) {
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onOutsideClick();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, onOutsideClick]);
}
// src/store/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Debe coincidir con las clases que index.css usa para forzar el override
// manual (":root.theme-dark" / ":root.theme-light"). Sin clase = sigue al SO.
const applyPreferenceToDom = (preference) => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    if (preference === 'light') root.classList.add('theme-light');
    if (preference === 'dark') root.classList.add('theme-dark');
};

export const useThemeStore = create(
    persist(
        (set, get) => ({
            preference: 'system', // 'system' | 'light' | 'dark'

            setPreference: (preference) => {
                applyPreferenceToDom(preference);
                set({ preference });
            },

            // Invierte lo que se ve ahora mismo en pantalla. Si está en 'system',
            // parte de la preferencia actual del SO (no de un valor fijo), así el
            // primer click siempre pasa al modo contrario del que se está viendo.
            toggle: () => {
                const { preference, setPreference } = get();
                const efectivo = preference === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : preference;
                setPreference(efectivo === 'dark' ? 'light' : 'dark');
            },
        }),
        {
            name: 'scout-theme',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ preference: state.preference }),
            // index.html corre un script inline que ya aplica la clase antes del
            // primer paint (evita el flash); esto solo resincroniza el DOM si el
            // valor persistido cambió en otra pestaña.
            onRehydrateStorage: () => (state) => {
                if (state) applyPreferenceToDom(state.preference);
            },
        }
    )
);

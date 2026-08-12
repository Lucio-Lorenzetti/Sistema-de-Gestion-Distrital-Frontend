import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            // true hasta que checkSession() resuelva si el token persistido sigue siendo válido.
            // Arranca en true para que App no renderice el login de entrada mientras se rehidrata.
            isBootstrapping: true,

            setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),
            setToken: (token) => set({ token, isAuthenticated: !!token }),

            // Limpia el estado local sin pegarle al backend (la usa el interceptor de 401).
            clearSession: () => set({ user: null, token: null, isAuthenticated: false }),

            logout: async () => {
                try {
                    if (get().token) {
                        await api.post('/logout');
                    }
                } catch (error) {
                    console.error('Error al cerrar la sesión en el servidor:', error);
                } finally {
                    get().clearSession();
                }
            },

            // Valida el token persistido contra el backend al arrancar la app.
            checkSession: async () => {
                const token = get().token;
                if (!token) {
                    set({ isBootstrapping: false });
                    return;
                }
                try {
                    const res = await api.get('/me');
                    set({ user: res.data.user, isAuthenticated: true, isBootstrapping: false });
                } catch (error) {
                    get().clearSession();
                    set({ isBootstrapping: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

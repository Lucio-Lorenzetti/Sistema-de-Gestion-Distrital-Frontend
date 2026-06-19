import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('auth_token') || null, // ← se inicializa desde localStorage
    isAuthenticated: !!localStorage.getItem('auth_token'),
    setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),
    setToken: (token) => set({ token }),
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

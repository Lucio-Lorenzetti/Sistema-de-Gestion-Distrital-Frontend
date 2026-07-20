// src/hooks/useAuthorizedFetch.js
import { useAuthStore } from '../store/useAuthStore';

export function useAuthorizedFetch() {
    const authorizedFetch = async (url, options = {}) => {
        const token = useAuthStore.getState().token;
        const res = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers,
            },
        });

        if (!res.ok) {
            let detail = '';
            try {
                const errorBody = await res.json();
                detail = errorBody.message || JSON.stringify(errorBody.errors || errorBody);
            } catch {
                detail = res.statusText;
            }
            throw new Error(`Request failed: ${res.status} - ${detail}`);
        }

        return res.json();
    };

    return { authorizedFetch };
}
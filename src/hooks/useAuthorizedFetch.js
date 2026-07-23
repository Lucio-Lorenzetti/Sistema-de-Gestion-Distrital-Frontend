// src/hooks/useAuthorizedFetch.js
import api from '../api/axios';

export function useAuthorizedFetch() {
    const authorizedFetch = async (url, options = {}) => {
        const { method = 'GET', body, headers = {} } = options;

        // Verificamos si el cuerpo enviado es un FormData
        const isFormData = body instanceof FormData;

        try {
            const res = await api.request({
                url,
                method,
                data: body,
                headers: {
                    ...headers,
                    // Si es FormData, quitamos 'Content-Type' para que el navegador configure el multipart/form-data automáticamente
                    ...(isFormData ? { 'Content-Type': undefined } : {}),
                },
            });

            return res.data;
        } catch (err) {
            if (err.response) {
                const detail = err.response.data?.message || JSON.stringify(err.response.data?.errors || err.response.data) || err.response.statusText;
                throw new Error(`Request failed: ${err.response.status} - ${detail}`);
            }
            throw err;
        }
    };

    return { authorizedFetch };
}
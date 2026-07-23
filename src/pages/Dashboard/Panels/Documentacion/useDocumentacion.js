// src/pages/Dashboard/Panels/Documentacion/useDocumentacion.js
import { useState, useEffect } from 'react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const DOCUMENTACION_ENDPOINT = '/bibliografia'; // O '/documents' según la ruta que maneje tu backend

export function useDocumentacion() {
    const { authorizedFetch } = useAuthorizedFetch();
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        authorizedFetch(DOCUMENTACION_ENDPOINT)
            .then((data) => {
                setDocumentos(data);
                setError(null);
            })
            .catch((err) => {
                console.error('Error al cargar la documentación:', err);
                setError('No se pudo cargar la documentación.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [authorizedFetch]);

    return { documentos, loading, error };
}
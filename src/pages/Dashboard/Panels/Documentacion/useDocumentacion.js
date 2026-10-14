// src/pages/Dashboard/Panels/Documentacion/useDocumentacion.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

const DOCUMENTACION_ENDPOINT = '/bibliografia'; // O '/documents' según la ruta que maneje tu backend

export function useDocumentacion() {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: documentos = [], isLoading: loading, error } = useQuery({
        queryKey: ['documentacion'],
        queryFn: () => authorizedFetch(DOCUMENTACION_ENDPOINT),
    });

    return { documentos, loading, error: error ? 'No se pudo cargar la documentación.' : null };
}

// src/pages/Dashboard/Panels/Usuarios/usePapeleraUsuarios.js
import { useQuery } from '@tanstack/react-query';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';

// `habilitado`: solo Developer puede ver esta papelera (403 para cualquier
// otro rol) — el que llama pasa `false` si el usuario logueado no es
// Developer, para no disparar un fetch que sabemos de antemano que va a fallar.
export const usePapeleraUsuarios = (habilitado = true) => {
    const { authorizedFetch } = useAuthorizedFetch();

    const { data: usuarios = [], isLoading, refetch } = useQuery({
        queryKey: ['papelera-usuarios'],
        queryFn: () => authorizedFetch('/usuarios/papelera'),
        enabled: habilitado,
    });

    return { usuarios, isLoading, refetch };
};

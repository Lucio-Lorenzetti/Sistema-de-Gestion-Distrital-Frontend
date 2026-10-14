// src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

// staleTime en 0 (el default de la librería) a propósito: varias pantallas
// mutan datos con authorizedFetch directo, sin pasar por el hook que cachea
// esa misma lista (ej. RevisarPrograma aprueba/rechaza un programa sin tocar
// la caché de useProgramas) — con un staleTime largo, volver a la lista
// mostraba el estadoViejo hasta que venciera el caché. Con 0, cada
// remount vuelve a pedir datos frescos, exactamente como antes de esta
// migración. Lo que SÍ queda resuelto sin necesidad de staleTime es que dos
// componentes que piden lo mismo A LA VEZ (ej. dos tarjetas del Dashboard
// pidiendo /programas en simultáneo) comparten un único pedido en vez de
// duplicarlo — eso lo hace React Query solo, deduplicando pedidos en vuelo.
//
// Catálogos que de verdad no cambian desde la app (grupos, ramas) usan su
// propio staleTime largo en su hook — ver useGruposCatalogo.js/useRamasCatalogo.js.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

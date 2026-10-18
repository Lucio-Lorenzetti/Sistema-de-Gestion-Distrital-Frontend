// src/webmcp/useWebMcpPublicTools.js
import { useEffect } from 'react';
import { registerPublicWebMcpTools } from './publicTools';

// Se monta una sola vez desde PublicLayout — no desde MainLayout (panel
// privado): ver publicTools.js para el porqué del alcance.
export function useWebMcpPublicTools() {
    useEffect(() => {
        let controller;
        let cancelado = false;

        registerPublicWebMcpTools()
            .then((c) => {
                if (cancelado) {
                    c?.abort();
                } else {
                    controller = c;
                }
            })
            .catch((err) => console.error('Error al registrar herramientas WebMCP:', err));

        return () => {
            cancelado = true;
            controller?.abort();
        };
    }, []);
}

// src/pages/Dashboard/Panels/Documentacion/useDocumentacion.js
import { useState } from 'react';

const DOCUMENTOS_MOCK = [
    { id: 1, nombre: 'AUTORIZACIÓN DE SALIDA GRUPAL v1.0', fecha: '10/07/2026' },
    { id: 2, nombre: 'Reglamento Interno Distrital', fecha: '05/07/2026' },
    { id: 3, nombre: 'Protocolo de Seguridad en Campamentos', fecha: '28/06/2026' },
    { id: 4, nombre: 'Formulario de Inscripción 2026', fecha: '15/06/2026' },
];

export function useDocumentacion() {
    // TODO: reemplazar por fetch real cuando exista el endpoint /api/documents
    const [documentos] = useState(DOCUMENTOS_MOCK);
    return { documentos, loading: false };
}
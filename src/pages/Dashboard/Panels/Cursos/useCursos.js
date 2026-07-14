// src/pages/Dashboard/panels/cursos/useCursos.js
import { useState } from 'react';
import { CURSOS_MOCK } from '../../../../data/general.mocks';

export function useCursos() {
    // TODO: reemplazar por fetch real cuando exista el endpoint /api/courses
    const [cursos] = useState(CURSOS_MOCK);
    return { cursos, loading: false };
}
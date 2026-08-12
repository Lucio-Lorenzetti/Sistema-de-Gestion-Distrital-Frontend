// src/pages/Dashboard/Panels/Programas/programaLineas.js
// Parte el contenido de un programa en "líneas" direccionables (line_ref) para
// poder anclarles comentarios, al estilo de los comentarios de línea de un MR.

export const SECCION_LABELS = {
    titulo: 'Título',
    educadores: 'Educadores a Cargo',
    diagnostico: 'Diagnóstico',
    objetivos: 'Objetivos',
    cronograma: 'Cronograma',
};

// El HTML lo escriben educadores vía contentEditable y hoy se inyecta sin escapar
// en el PDF (pdf.blade.php), pero acá lo va a ver toda la rama en el navegador —
// se sanea antes de mostrarlo (scripts, handlers inline, hrefs/src con javascript:).
const sanearDocumento = (doc) => {
    doc.querySelectorAll('script').forEach((el) => el.remove());
    doc.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((attr) => {
            const nombre = attr.name.toLowerCase();
            const valor = attr.value.trim().toLowerCase();
            const esHandler = nombre.startsWith('on');
            const esUrlPeligrosa = (nombre === 'href' || nombre === 'src') && valor.startsWith('javascript:');
            if (esHandler || esUrlPeligrosa) {
                el.removeAttribute(attr.name);
            }
        });
    });
};

// Cada línea autorada en la plantilla se serializa como su propio <div>
// (ver lineasToHtml en CrearProgramaCampamento.jsx/CrearProgramaCFA.jsx).
// Los nodos que no son <div> (p. ej. una <ul> de una lista con viñetas) se
// tratan como una línea propia.
export const splitHtmlEnLineas = (html) => {
    if (!html) return [];

    const doc = new DOMParser().parseFromString(html, 'text/html');
    sanearDocumento(doc.body);

    const lineas = [];
    doc.body.childNodes.forEach((nodo) => {
        if (nodo.nodeType === Node.ELEMENT_NODE && nodo.tagName === 'DIV') {
            lineas.push(nodo.innerHTML || '<br>');
        } else if (nodo.nodeType === Node.ELEMENT_NODE) {
            lineas.push(nodo.outerHTML);
        } else if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim()) {
            lineas.push(nodo.textContent);
        }
    });

    return lineas;
};

const lineaCampo = (seccion, contenido) => ([{
    lineRef: `campo:${seccion}`,
    tipo: 'campo',
    contenido: contenido || '',
}]);

const obtenerDiasCfa = (cronograma) =>
    Array.isArray(cronograma) ? cronograma : cronograma?.dias || [];

// Devuelve las secciones del programa en orden de lectura, cada una con su
// lista de líneas comentables ({ lineRef, tipo: 'campo'|'html', contenido }).
export const getLineasPrograma = (programa) => {
    if (!programa) return [];

    const secciones = [];

    secciones.push({ seccion: 'titulo', label: SECCION_LABELS.titulo, lineas: lineaCampo('titulo', programa.titulo) });

    if (programa.educadores_a_cargo) {
        secciones.push({ seccion: 'educadores', label: SECCION_LABELS.educadores, lineas: lineaCampo('educadores', programa.educadores_a_cargo) });
    }
    if (programa.diagnostico) {
        secciones.push({ seccion: 'diagnostico', label: SECCION_LABELS.diagnostico, lineas: lineaCampo('diagnostico', programa.diagnostico) });
    }
    if (programa.objetivos) {
        secciones.push({ seccion: 'objetivos', label: SECCION_LABELS.objetivos, lineas: lineaCampo('objetivos', programa.objetivos) });
    }

    const cronograma = programa.cronograma || {};

    if (programa.tipo === 'cfa') {
        obtenerDiasCfa(cronograma).forEach((dia, d) => {
            const html = dia?.contenidoHtml || dia?.contenido_html || '';
            const lineasHtml = splitHtmlEnLineas(html);
            if (!lineasHtml.length) return;

            secciones.push({
                seccion: `dia-${d}`,
                label: dia?.nombreDia && dia?.fechaFormatted ? `${dia.nombreDia} ${dia.fechaFormatted}` : `Día ${d + 1}`,
                lineas: lineasHtml.map((contenido, i) => ({ lineRef: `dia:${d}:${i}`, tipo: 'html', contenido })),
            });
        });
    } else {
        const html = cronograma.contenidoHtml || cronograma.contenido_html || '';
        const lineasHtml = splitHtmlEnLineas(html);
        if (lineasHtml.length) {
            secciones.push({
                seccion: 'cronograma',
                label: SECCION_LABELS.cronograma,
                lineas: lineasHtml.map((contenido, i) => ({ lineRef: `cronograma:${i}`, tipo: 'html', contenido })),
            });
        }
    }

    return secciones;
};

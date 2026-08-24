// src/pages/Dashboard/Panels/Programas/programaLineas.js
// Parte el contenido de un programa en "líneas" direccionables (line_ref) para
// poder anclarles comentarios, al estilo de los comentarios de línea de un MR.

export const SECCION_LABELS = {
    titulo: 'Título',
    educadores: 'Educadores a Cargo',
    diagnostico: 'Diagnóstico',
    objetivos: 'Objetivos',
    infoAdicional: 'Información Adicional',
    cronograma: 'Cronograma',
};

// Mismo criterio y misma lista que ProgramController::quitarSeccionesDuplicadas()
// en el backend (que ya limpia el PDF): el editor deja Título/Educadores a
// Cargo/Diagnóstico/Objetivo baqueados como texto libre en el cronograma, pero
// esos datos ya se muestran arriba desde los campos reales del programa — acá se
// recortan del texto libre antes de mostrarlo, para no repetirlos en pantalla.
const ENCABEZADOS_DUPLICADOS = ['Título', 'Educadores a Cargo', 'Diagnóstico', 'Objetivo'];

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

// Una línea es "encabezado en negrita" si es un único <strong>...</strong> sin
// nada más alrededor (p. ej. la línea generada por linea([{text:'Título', bold:true}])).
const esEncabezadoBold = (lineaHtml) => /^<strong>[\s\S]*<\/strong>$/i.test(lineaHtml.trim());

// Devuelve el set de índices (sobre el array YA generado por splitHtmlEnLineas,
// sin recortar) que hay que ocultar al mostrar el programa: mismo criterio que
// quitarSeccionesDuplicadas() en el backend — desde el encabezado buscado hasta
// el próximo encabezado en negrita (o el final). Importante: no se borran líneas
// del array ni se renumeran las siguientes, solo se marcan para no renderizarse
// — así un comentario ya anclado a un lineRef `cronograma:N`/`dia:D:N` posterior
// sigue apuntando a la misma línea real de siempre, en vez de correrse.
const indicesDuplicados = (lineasHtml, encabezados) => {
    const ocultar = new Set();

    encabezados.forEach((encabezado) => {
        const inicio = lineasHtml.findIndex(
            (html, i) => !ocultar.has(i) && esEncabezadoBold(html) && html.replace(/<[^>]+>/g, '').trim() === encabezado
        );
        if (inicio === -1) return;

        let fin = lineasHtml.length;
        for (let i = inicio + 1; i < lineasHtml.length; i++) {
            if (esEncabezadoBold(lineasHtml[i])) { fin = i; break; }
        }
        for (let i = inicio; i < fin; i++) ocultar.add(i);
    });

    return ocultar;
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

    // Solo Campamento y CFA piden Lugar/Valor/Transporte.
    if (programa.lugar || programa.valor || programa.transporte) {
        const lineas = [];
        if (programa.lugar) lineas.push({ lineRef: 'campo:lugar', tipo: 'campo', contenido: `Lugar: ${programa.lugar}` });
        if (programa.valor) lineas.push({ lineRef: 'campo:valor', tipo: 'campo', contenido: `Valor: ${programa.valor}` });
        if (programa.transporte) lineas.push({ lineRef: 'campo:transporte', tipo: 'campo', contenido: `Transporte: ${programa.transporte}` });
        secciones.push({ seccion: 'infoAdicional', label: SECCION_LABELS.infoAdicional, lineas });
    }

    const cronograma = programa.cronograma || {};

    if (programa.tipo === 'cfa') {
        obtenerDiasCfa(cronograma).forEach((dia, d) => {
            const html = dia?.contenidoHtml || dia?.contenido_html || '';
            const lineasHtml = splitHtmlEnLineas(html);
            if (!lineasHtml.length) return;
            const ocultar = indicesDuplicados(lineasHtml, ENCABEZADOS_DUPLICADOS);

            const lineas = lineasHtml
                .map((contenido, i) => ({ i, contenido }))
                .filter(({ i }) => !ocultar.has(i))
                .map(({ i, contenido }) => ({ lineRef: `dia:${d}:${i}`, tipo: 'html', contenido }));
            if (!lineas.length) return;

            secciones.push({
                seccion: `dia-${d}`,
                label: dia?.nombreDia && dia?.fechaFormatted ? `${dia.nombreDia} ${dia.fechaFormatted}` : `Día ${d + 1}`,
                lineas,
            });
        });
    } else {
        const html = cronograma.contenidoHtml || cronograma.contenido_html || '';
        const lineasHtml = splitHtmlEnLineas(html);
        if (lineasHtml.length) {
            const ocultar = indicesDuplicados(lineasHtml, ENCABEZADOS_DUPLICADOS);
            const lineas = lineasHtml
                .map((contenido, i) => ({ i, contenido }))
                .filter(({ i }) => !ocultar.has(i))
                .map(({ i, contenido }) => ({ lineRef: `cronograma:${i}`, tipo: 'html', contenido }));

            if (lineas.length) {
                secciones.push({ seccion: 'cronograma', label: SECCION_LABELS.cronograma, lineas });
            }
        }
    }

    return secciones;
};

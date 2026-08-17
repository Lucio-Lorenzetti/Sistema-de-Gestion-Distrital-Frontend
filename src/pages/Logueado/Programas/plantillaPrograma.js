// src/pages/Logueado/Programas/plantillaPrograma.js
// Compartido por los 6 formularios de Crear/Editar Programa (Cuatrimestre/Campamento/CFA).
// Antes estas funciones estaban copiadas letra por letra en cada archivo — cualquier
// fix había que aplicarlo 6 veces. Ver auditoría 2026-08-14 en Feature-Programa.md.

// --- Fechas ---

export const parseFechaLocal = (isoDate) => {
    if (!isoDate) return null;
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const formatDDMM = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
};

// Cuatrimestre: un sábado por semana en el rango.
export const obtenerSabados = (inicio, fin) => {
    const sabados = [];
    if (!inicio || !fin || inicio > fin) return sabados;
    const cursor = new Date(inicio);
    while (cursor <= fin) {
        if (cursor.getDay() === 6) sabados.push(formatDDMM(new Date(cursor)));
        cursor.setDate(cursor.getDate() + 1);
    }
    return sabados;
};

export const NOMBRES_DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Campamento/CFA: cada día del rango, con su nombre de día. `id` (fecha ISO) lo
// usa CFA como key de pestaña; Campamento simplemente lo ignora.
export const obtenerDiasRango = (inicio, fin) => {
    const dias = [];
    if (!inicio || !fin || inicio > fin) return dias;
    const cursor = new Date(inicio);
    while (cursor <= fin) {
        dias.push({
            id: cursor.toISOString().split('T')[0],
            nombreDia: NOMBRES_DIAS[cursor.getDay()],
            fechaFormatted: formatDDMM(new Date(cursor)),
        });
        cursor.setDate(cursor.getDate() + 1);
    }
    return dias;
};

// CFA: las pestañas de días se muestran en 1 o 2 filas (si son muchos días, se
// reparten en 2 para no desbordar el ancho).
export const distribuirEnFilas = (dias) => {
    const total = dias.length;
    if (total === 0) return [];
    if (total <= 10) return [dias];

    const mitadArriba = Math.floor(total / 2);
    return [dias.slice(0, mitadArriba), dias.slice(mitadArriba)];
};

// Horario tipo de un día de Campamento/CFA. contadorActividadRef.val se comparte entre
// días consecutivos para que "Actividad N" numere de forma correlativa en todo el programa.
export const generarCronogramaDia = (esPrimerDia, esUltimoDia, contadorActividadRef) => {
    const horarios = [];

    horarios.push({ hora: '08:00hs', desc: esPrimerDia ? 'Concentración' : 'Diana / Desayuno' });
    horarios.push({ hora: '09:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '11:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '13:00hs', desc: 'Almuerzo' });

    if (esUltimoDia) {
        horarios.push({ hora: '16:00hs', desc: 'Desconcentración' });
        return horarios;
    }

    horarios.push({ hora: '15:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '17:00hs', desc: 'Merienda' });
    horarios.push({ hora: '18:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '20:00hs', desc: `Actividad ${contadorActividadRef.val++}` });
    horarios.push({ hora: '21:30hs', desc: 'Cena' });
    horarios.push({ hora: '23:00hs', desc: 'Silencio' });

    return horarios;
};

// --- Armado de líneas (texto con negrita/color parcial) ---

export const escapeHtml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

export const linea = (parts) => (Array.isArray(parts) ? parts : [{ text: parts, bold: false }]);

// Convierte texto plano viejo (programas creados antes del editor rich-text) a
// divs por renglón, mismo shape que produce lineasToHtml — para poder cargarlo
// tal cual en el contentEditable al editar un programa legacy.
export const textoPlanoAHtml = (texto) => {
    if (!texto) return '';
    return String(texto)
        .split('\n')
        .map((renglon) => `<div>${escapeHtml(renglon) || '<br>'}</div>`)
        .join('');
};

export const agregarTextoMultilinea = (lineasTarget, texto) => {
    if (!texto) {
        lineasTarget.push(linea(''));
        return;
    }
    String(texto).split('\n').forEach((renglon) => {
        lineasTarget.push(linea(renglon));
    });
};

// Texto único por tipo (antes Crear y Editar del mismo tipo tenían cada uno el suyo,
// con redacciones distintas — unificado acá, una sola fuente).
export const DISCLAIMER_PLANTILLA = {
    cuatrimestre: 'Este programa fue generado mediante el Sistema de Gestión del Distrito 3 - Zona 13 - Scouts de Argentina. Esta plantilla tiene como objetivo unificar los criterios mínimos de un programa de cuatrimestre a nivel distrital. Se solicita respetar como base la información aquí requerida; toda información adicional que se considere pertinente es bienvenida. El programa se generará a partir de los datos ingresados en el paso anterior, junto con la descripción incorporada en esta sección.',
    campamento: 'Este programa fue generado mediante el Sistema de Gestión del Distrito 3 - Zona 13 - Scouts de Argentina. Esta plantilla tiene como objetivo unificar los criterios mínimos de un programa de campamento/acantonamiento a nivel distrital. Se solicita respetar como base la información aquí requerida; toda información adicional que se considere pertinente es bienvenida. El programa se generará a partir de los datos ingresados en el paso anterior, junto con la descripción incorporada en esta sección.',
    cfa: 'Este programa fue generado mediante el Sistema de Gestión del Distrito 3 - Zona 13 - Scouts de Argentina. Esta plantilla tiene como objetivo unificar los criterios mínimos de un programa de campamento/acantonamiento a nivel distrital. Se solicita respetar como base la información aquí requerida; toda información adicional que se considere pertinente es bienvenida. El programa se generará a partir de los datos ingresados en el paso anterior, junto con la descripción incorporada en esta sección.',
};

// `actividadRef` (si viene) envuelve esa parte en un <span data-actividad-ref="N">, para
// poder encontrarla después y mantenerla en sync con su contraparte (ver sincronizarActividades).
export const lineasToHtml = (lineas) =>
    lineas
        .map((parts) => {
            const inner = parts
                .map((p) => {
                    const textoEscapado = escapeHtml(p.text);
                    const tagApertura = p.bold ? '<strong>' : '';
                    const tagCierre = p.bold ? '</strong>' : '';

                    let contenido = `${tagApertura}${textoEscapado}${tagCierre}`;

                    if (p.color) {
                        contenido = `<span style="color: ${p.color};">${contenido}</span>`;
                    }
                    if (p.actividadRef != null) {
                        contenido = `<span data-actividad-ref="${p.actividadRef}">${contenido}</span>`;
                    }

                    return contenido;
                })
                .join('');
            return `<div>${inner || '<br>'}</div>`;
        })
        .join('');

// --- Sync en vivo de "Actividad N" entre el horario y el anexo ---

// Se llama en el onInput del contentEditable. Ubica en qué [data-actividad-ref] está
// el cursor ahora mismo (la que se está tipeando) y copia su texto a las demás
// apariciones del mismo N (normalmente son 2: la del horario y la del anexo).
// Si el usuario borró el <span> entero (reemplazó todo el texto sin dejar el marcador)
// no hay nada para sincronizar — es la limitación esperada de este enfoque liviano.
export const sincronizarActividades = (contenedor) => {
    if (!contenedor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let nodo = selection.getRangeAt(0).startContainer;
    let origen = null;
    while (nodo && nodo !== contenedor) {
        if (nodo.nodeType === Node.ELEMENT_NODE && nodo.hasAttribute?.('data-actividad-ref')) {
            origen = nodo;
            break;
        }
        nodo = nodo.parentNode;
    }
    if (!origen) return;

    const ref = origen.getAttribute('data-actividad-ref');
    const texto = origen.textContent;

    contenedor.querySelectorAll(`[data-actividad-ref="${ref}"]`).forEach((el) => {
        if (el !== origen && el.textContent !== texto) {
            el.textContent = texto;
        }
    });
};

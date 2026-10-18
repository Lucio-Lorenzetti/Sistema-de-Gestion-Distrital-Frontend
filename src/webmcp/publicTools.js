// src/webmcp/publicTools.js
//
// Experimental, a pedido del director del proyecto. WebMCP (https://developer.chrome.com/docs/ai/webmcp)
// es una propuesta de estándar (W3C, origin trial desde Chrome 149) que deja
// que una página declare "herramientas" que un agente de IA del navegador
// puede invocar directo, sin tener que leer la pantalla.
//
// Alcance a propósito acotado al sitio público:
// - Solo lectura (readOnlyHint: true en los 3), nada que mute datos.
// - Solo endpoints que YA son públicos (sin auth) — no se expone nada nuevo
//   que no se pueda ver navegando el sitio a mano.
// - Nunca se registra en el panel privado (ver dónde se llama este módulo).
//
// Si el navegador no soporta `document.modelContext` (hoy: todo salvo Chrome
// con el origin trial o el flag chrome://flags/#enable-webmcp-testing
// activado), esto no hace nada — ninguna de las funciones se ejecuta nunca.
// En producción hace falta además el token del origin trial para el dominio
// real (se registra en https://developer.chrome.com/origintrials); sin él,
// Chrome ignora el API igual que cualquier otro navegador.
import api from '../api/axios';

const esSoportado = () => typeof document !== 'undefined' && 'modelContext' in document;

export async function registerPublicWebMcpTools() {
    if (!esSoportado()) return null;

    const controller = new AbortController();
    const { signal } = controller;

    await document.modelContext.registerTool({
        name: 'buscar_noticias',
        description: 'Busca noticias publicadas del Distrito 3 - Zona 13 de Scouts de Argentina por texto en el título o el copete.',
        inputSchema: {
            type: 'object',
            properties: {
                texto: { type: 'string', description: 'Texto a buscar en el título o copete de la noticia' },
            },
        },
        annotations: { readOnlyHint: true },
        execute: async ({ texto } = {}) => {
            const noticias = await api.get('/news?solo_publicadas=true').then((r) => r.data);
            const filtradas = texto
                ? noticias.filter((n) =>
                    `${n.titulo} ${n.copete}`.toLowerCase().includes(texto.toLowerCase())
                )
                : noticias;
            return JSON.stringify(
                filtradas.slice(0, 10).map((n) => ({ titulo: n.titulo, copete: n.copete, fecha: n.fecha }))
            );
        },
    }, { signal });

    await document.modelContext.registerTool({
        name: 'listar_cursos_abiertos',
        description: 'Lista los cursos de formación del Distrito 3 - Zona 13 que están actualmente con inscripción abierta.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => {
            const cursos = await api.get('/courses').then((r) => r.data);
            // El estado lo calcula el backend (Course::getEstadoAttribute), así la herramienta
            // coincide siempre con lo que muestra el sitio.
            const abiertos = cursos.filter((c) => c.estado === 'Abierto');
            return JSON.stringify(
                abiertos.map((c) => ({ titulo: c.titulo, categoria: c.categoria, fecha_cierre: c.fecha_cierre }))
            );
        },
    }, { signal });

    await document.modelContext.registerTool({
        name: 'info_distrito',
        description: 'Devuelve el Consejo Distrital y la lista de grupos del Distrito 3 - Zona 13 de Scouts de Argentina, con su Jefe de Grupo.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => {
            const { consejo, grupos } = await api.get('/distrito').then((r) => r.data);
            return JSON.stringify({
                consejo: consejo.map((m) => ({ nombre: m.name, rol: m.rol, rama: m.rama })),
                grupos: grupos.map((g) => ({ numero: g.numero, nombre: g.nombre, jefe: g.jefe?.name ?? null })),
            });
        },
    }, { signal });

    return controller;
}

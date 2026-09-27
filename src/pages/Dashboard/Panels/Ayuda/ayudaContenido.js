// src/pages/Dashboard/Panels/Ayuda/ayudaContenido.js
// Contenido de la guía de uso, en texto plano — separado de la UI para poder
// corregir/ampliar sin tocar el componente. `roles` vacío = relevante para todos;
// si no, son los nombres de rol (en minúscula, igual que roleNames en Sidebar.jsx)
// para los que la sección arranca abierta por defecto.

export const SECCIONES_AYUDA = [
    {
        id: 'primeros-pasos',
        titulo: 'Primeros pasos',
        roles: [],
        bloques: [
            {
                subtitulo: 'Tu perfil',
                items: [
                    'En "Mi Perfil" podés cambiar tu nombre, tótem/nombre de caza, correo y contraseña.',
                    'La foto de perfil se recorta antes de subirse — elegís qué parte de la imagen queda visible.',
                ],
            },
            {
                subtitulo: 'Roles múltiples',
                items: [
                    'Podés tener más de un rol a la vez (por ejemplo, Educador y Aux Prog Rama), cada uno con su propio alcance (rama/grupo).',
                    'Para sumar un rol nuevo o cambiar de rama/grupo, usá "Solicitar rol / cambio" en Mi Perfil. Queda pendiente hasta que alguien con la potestad lo apruebe.',
                    'Si ya no ejercés un rol, podés renunciarlo vos mismo desde Mi Perfil (la "X" en la etiqueta del rol) — no hace falta pedirle a nadie que te lo saque.',
                ],
            },
        ],
    },
    {
        id: 'quien-aprueba-que',
        titulo: '¿Quién aprueba cada solicitud de rol?',
        roles: ['jefe de grupo', 'director'],
        bloques: [
            {
                subtitulo: '',
                items: [
                    'Solicitud de rol Educador → la aprueba el Jefe de Grupo del grupo pedido.',
                    'Cualquier otro rol (Aux Prog General, Aux Prog Rama, Aux Comunicación) → lo aprueba el Director.',
                    'Jefe de Grupo y Director no se solicitan: los designa directamente quien tiene la potestad (el Director, o el propio Jefe de Grupo/Director saliente al traspasar). Nunca hay dos personas con el mismo cargo en el mismo grupo/distrito a la vez.',
                ],
            },
        ],
    },
    {
        id: 'programas',
        titulo: 'Programas',
        roles: ['educador', 'jefe de grupo', 'aux prog rama', 'aux prog general', 'director'],
        bloques: [
            {
                subtitulo: 'Crear un programa',
                items: [
                    'Elegís el tipo (Cuatrimestre, Campamento o CFA) y el sistema genera una plantilla automática según las fechas.',
                    'Mientras el programa está en "Borrador", cualquier Educador de tu mismo grupo y rama puede editarlo junto con vos (armado colaborativo).',
                    'Se puede descargar en PDF en cualquier momento.',
                ],
            },
            {
                subtitulo: 'Flujo de aprobación',
                items: [
                    '"Enviar a revisión" saca el programa de Borrador — a partir de ahí queda congelado para edición.',
                    'Ya en revisión, se usa "Solicitar aprobación" para avisarle al auxiliar que está listo.',
                    'El auxiliar (Aux Prog Rama/General) o el Director lo "Aprueba" o lo "Rechaza" — un rechazo pide motivo obligatorio.',
                    'Un programa rechazado puede volver a "Borrador" para corregirlo y reenviarlo.',
                ],
            },
            {
                subtitulo: 'Comentarios y papelera',
                items: [
                    'Los comentarios se anclan a una línea puntual del programa, en hilos con respuesta y opción de resolver/reabrir.',
                    'Si eliminás un programa, va a tu Papelera personal — solo vos podés verlo y restaurarlo ahí.',
                ],
            },
        ],
    },
    {
        id: 'contenido-publico',
        titulo: 'Noticias, Cursos y Biblioteca',
        roles: ['aux comunicación', 'director'],
        bloques: [
            {
                subtitulo: '',
                items: [
                    'Noticias, Cursos y Biblioteca (documentos/links) se gestionan igual: crear, editar y eliminar desde su sección en el menú.',
                    'Lo que elimines va a la Papelera de esa sección (botón arriba de la tabla) — cualquiera con el mismo permiso puede restaurarlo, no es personal como la de Programas.',
                    'En Biblioteca, el archivo original se conserva aunque lo borres, así restaurarlo no pierde el documento.',
                ],
            },
        ],
    },
    {
        id: 'gestion-usuarios',
        titulo: 'Gestión de usuarios',
        roles: ['jefe de grupo', 'director', 'developer'],
        bloques: [
            {
                subtitulo: '',
                items: [
                    'En "Usuarios" aparecen las solicitudes de rol pendientes que te corresponde revisar (ver sección "¿Quién aprueba cada solicitud?").',
                    'Aprobar una solicitud activa la cuenta (si era una persona nueva) y le asigna el rol en un solo paso.',
                    'Rechazar pide un motivo, igual que rechazar un programa.',
                    'Jefe de Grupo ve solo su propio grupo; Director y Developer ven todo el distrito.',
                    'Los usuarios eliminados van a una papelera que solo Developer puede ver y restaurar.',
                ],
            },
        ],
    },
    {
        id: 'sistema',
        titulo: 'Panel de Sistema',
        roles: ['developer'],
        bloques: [
            {
                subtitulo: '',
                items: [
                    'Solo vos ves esta sección. Desde "Sistema" podés editar la metadata de cada rol: si requiere rama/grupo, si se puede autosolicitar, si reemplaza a alguien al designarlo.',
                    'El nombre del rol no se puede editar desde acá a propósito: se usa como texto fijo en varios chequeos de permisos del sistema.',
                ],
            },
        ],
    },
];

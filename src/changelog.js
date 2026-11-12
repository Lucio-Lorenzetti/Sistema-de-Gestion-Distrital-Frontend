// Historial de versiones que se muestra en Actualizaciones (solo Developer).
//
// Al sacar una versión nueva: subir APP_VERSION en src/version.js y agregar
// acá una entrada AL PRINCIPIO del array (la primera es la "actual").
// tipo: 'nuevo' | 'mejora' | 'fix'
export const CHANGELOG = [
  {
    version: '1.3.1',
    fecha: '2026-11-12',
    titulo: 'Reenviar el mail de recuperación',
    cambios: [
      { tipo: 'fix', texto: 'El botón "¿No recibiste el correo?" de la pantalla "Correo enviado" no hacía nada. Ahora reenvía el mail a la misma dirección (con una espera de 60 segundos entre envíos) y avisa cuando lo hizo o si algo falló.' },
      { tipo: 'mejora', texto: 'La pantalla "Correo enviado" muestra a qué dirección (enmascarada) se mandó el mail.' },
    ],
  },
  {
    version: '1.3.0',
    fecha: '2026-11-12',
    titulo: 'Seguridad de la cuenta',
    cambios: [
      { tipo: 'nuevo', texto: 'Recuperar la contraseña con confirmación: en vez de escribir el correo a ciegas, se muestra a qué dirección (enmascarada) se va a enviar el mail y se manda recién al aceptar. Si ya escribiste tu correo en el login, no hace falta repetirlo.' },
      { tipo: 'nuevo', texto: 'En Mi Perfil, botón "¿No recordás tu contraseña actual? Cambiala con un mail": te manda el link a la dirección registrada de tu cuenta, sin escribir nada.' },
      { tipo: 'nuevo', texto: 'Aviso por mail cuando cambia la contraseña de tu cuenta, y cuando cambia tu correo (este último va a la dirección anterior), para enterarte si no fuiste vos.' },
      { tipo: 'mejora', texto: 'Al cambiar la contraseña o el correo se cierran las sesiones abiertas en otros dispositivos. Al restablecer con el link del mail se cierran todas.' },
      { tipo: 'mejora', texto: 'Mensajes de error en español y sin textos técnicos en Mi Perfil, en el cambio de contraseña y en el restablecimiento (por ejemplo, cuando el link venció).' },
      { tipo: 'fix', texto: 'Cualquiera con la sesión abierta podía cambiar el correo de la cuenta sin confirmar y quedarse con ella usando "Olvidé mi contraseña". Ahora cambiar el correo exige la contraseña actual.' },
      { tipo: 'fix', texto: 'La tarjeta de contraseña de Mi Perfil mostraba una barra de scroll cuando aparecía un mensaje.' },
    ],
  },
  {
    version: '1.2.0',
    fecha: '2026-11-12',
    titulo: 'Autoguardado, programas del Developer y errores claros',
    cambios: [
      { tipo: 'nuevo', texto: 'Autoguardado al crear programas (Cuatrimestre, Campamento y CFA), noticias, cursos y material de la Biblioteca: lo que escribís se guarda solo en tu dispositivo.' },
      { tipo: 'nuevo', texto: 'Si cerrás la pestaña, se corta la conexión o se recarga la página, al volver a abrir el formulario recuperás lo que habías cargado, con la opción de descartarlo y empezar de cero.' },
      { tipo: 'mejora', texto: 'El borrador se borra solo cuando el contenido se guarda de verdad, y también se guarda al pasar el celular a otra app.' },
      { tipo: 'mejora', texto: 'Cada usuario ve solo sus borradores, y los que tienen más de 30 días se descartan solos.' },
      { tipo: 'mejora', texto: 'Las imágenes y archivos adjuntos (portada de noticia, PDF de Biblioteca) no se guardan: hay que volver a elegirlos, y el aviso lo recuerda.' },
      { tipo: 'nuevo', texto: 'El Developer puede crear programas eligiendo a qué rama y grupo pertenecen. Es el único que puede elegirlos: para el resto salen de su rol y el servidor no deja cambiarlos.' },
      { tipo: 'mejora', texto: 'Errores claros al guardar programas, noticias y cursos: mensajes en español que dicen qué falta o qué pasó (sin conexión, error del servidor, campo vacío), en vez de textos técnicos en inglés.' },
      { tipo: 'fix', texto: 'Crear un programa siendo Developer fallaba con un error del servidor porque no tenía rama asignada. Ahora se elige la rama y el grupo, y quien no tiene rama recibe un aviso que explica qué hacer.' },
    ],
  },
  {
    version: '1.1.0',
    fecha: '2026-11-12',
    titulo: 'Todo el sitio en mobile',
    cambios: [
      { tipo: 'nuevo', texto: 'Menú lateral del panel como drawer en celular: se abre con el botón de hamburguesa y se cierra solo al navegar.' },
      { tipo: 'nuevo', texto: 'Historial de versiones en Actualizaciones, con los cambios de cada una.' },
      { tipo: 'mejora', texto: 'Panel interno completo adaptado a celular: Dashboard, Programas, Cursos, Noticias, Biblioteca, Usuarios, Mi Perfil, Ayuda, Sistema y Actualizaciones.' },
      { tipo: 'mejora', texto: 'Formularios de crear y editar (programas, cursos, noticias, biblioteca) usables en pantallas chicas.' },
      { tipo: 'mejora', texto: 'En celular y tablet las pantallas ya no cortan el contenido: scrollean con normalidad. En desktop quedan igual que antes.' },
      { tipo: 'mejora', texto: 'Tablas con scroll horizontal en celular en vez de aplastarse; tarjetas y ventanas emergentes con menos margen interno.' },
      { tipo: 'mejora', texto: 'Barra superior compacta (solo avatar en celular) y campanita de notificaciones que usa todo el ancho disponible.' },
      { tipo: 'fix', texto: 'En iPhone/iPad los campos de formulario ya no hacen zoom automático al tocarlos.' },
      { tipo: 'fix', texto: 'La caja de ideas y el Asistente IA de Actualizaciones se veían diminutos al apilarse en celular.' },
    ],
  },
  {
    version: '1.0.0',
    fecha: '2026-09-27',
    titulo: 'Lanzamiento del sistema',
    // No se subió la versión a medida que se agregaban cosas: acá está todo
    // lo que se publicó desde el lanzamiento hasta el 25/10/2026.
    cambios: [
      { tipo: 'nuevo', texto: 'Programas: creación de Cuatrimestre, Campamento y CFA, edición, flujo de revisión y aprobación, comentarios, rechazo con motivo y papelera.' },
      { tipo: 'nuevo', texto: 'Corregir un programa comentado sin perder los comentarios, y tablero de novedades de revisión para el Auxiliar de Programa.' },
      { tipo: 'nuevo', texto: 'Usuarios y roles: gestión de usuarios, solicitud y renuncia de rol, designación de Director y Jefe de Grupo, edición de metadata de roles.' },
      { tipo: 'nuevo', texto: 'Permisos reales por rol: el menú y las rutas privadas muestran solo lo que cada rol puede usar.' },
      { tipo: 'nuevo', texto: 'Cursos, Noticias y Biblioteca con gestión interna y papelera de contenidos.' },
      { tipo: 'nuevo', texto: 'Perfil del grupo desde el Dashboard del Jefe de Grupo y página pública El Distrito con datos reales.' },
      { tipo: 'nuevo', texto: 'Mi Perfil, recuperación de contraseña y verificación de email.' },
      { tipo: 'nuevo', texto: 'Notificaciones (campanita), página de Ayuda por rol y modo claro/oscuro.' },
      { tipo: 'nuevo', texto: 'Actualizaciones: roadmap Developer/Director y Asistente IA (Gemini).' },
      { tipo: 'nuevo', texto: 'Panel del Developer con estado del sistema, errores recientes (con botón para vaciarlos), métricas y accesos técnicos.' },
      { tipo: 'nuevo', texto: 'Banner de la galería del CADIS 2026 en el Home, con enlace a Drive.' },
      { tipo: 'nuevo', texto: 'Herramientas experimentales de WebMCP en el sitio público.' },
      { tipo: 'mejora', texto: 'Sitio público, login y registro adaptados a mobile.' },
      { tipo: 'mejora', texto: 'Más velocidad: TanStack Query para catálogos, listas y papeleras, y sin pedido CORS extra en cada llamada a la API.' },
      { tipo: 'fix', texto: 'Educadores Registrados del Director con el dato real, noticias sin categoría y textos de Ayuda corregidos.' },
    ],
  },
];

// src/data/noticias.js
import imgDefault from '../assets/noticia-default.jpg';
import imgPrueba from '../assets/hero.png';

export const NOTICIAS_MOCK = [
    { 
        id: 1, 
        titulo: "CONVOCATORIA ASAMBLEA DISTRITAL 2026", 
        fecha: "2026-04-25", 
        contenido: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ", 
        categoria: "Institucional",
        img: imgPrueba // Aquí iría la URL de la imagen cuando la tengas
    },
    { 
        id: 2, 
        titulo: "ACTUALIZACIÓN DE FICHAS MÉDICAS", 
        fecha: "2026-04-20", 
        contenido: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...", 
        categoria: "Seguridad",
        img: null 
    },
    { 
        id: 3, 
        titulo: "CURSO DE FORMACIÓN: RAMA SCOUT", 
        fecha: "2026-04-15", 
        contenido: "Se invita a los educadores con esquema inicial completo a participar de las jornadas de formación presencial que se dictarán en la Zona 22. Los módulos abarcarán: Vida en la naturaleza, Progresión personal y Animación de la unidad.", 
        categoria: "Formación",
        img: imgPrueba 
    },
    { 
        id: 4, 
        titulo: "EVENTO: CELEBRACIÓN DE SAN JORGE", 
        fecha: "2026-04-10", 
        contenido: "Bajo el lema 'Construyendo el futuro', el Distrito 3 se reunirá el próximo 23 de abril para celebrar nuestro patrono en el Parque de Mayo. Se espera la participación de los 12 grupos scout con actividades para todas las ramas.", 
        categoria: "Eventos",
        img: imgPrueba 
    },
    { 
        id: 5, 
        titulo: "COMUNICADO SOBRE SEGUROS DE VIDA", 
        fecha: "2026-04-05", 
        contenido: "La oficina nacional ha enviado el nuevo protocolo de actuación ante accidentes. Es fundamental que cada Jefe de Grupo tenga una copia física del reporte de siniestro y el contacto de la aseguradora en su kit de primeros auxilios.", 
        categoria: "Oficial",
        img: null 
    },
    { 
        id: 6, 
        titulo: "FORO DISTRITAL DE JÓVENES 2026", 
        fecha: "2026-04-01", 
        contenido: "El Foro Distrital es el espacio donde los jóvenes toman la palabra. Este año los ejes temáticos serán: Salud Mental en la Juventud, Liderazgo Ético y Sustentabilidad en Campamentos. Las conclusiones serán elevadas al Consejo de Zona.", 
        categoria: "Participación",
        img: null 
    },
    { 
        id: 7, 
        titulo: "JORNADA DE SERVICIO: ARROYO NAPOSTÁ", 
        fecha: "2026-03-28", 
        contenido: "En el marco del compromiso ambiental scout, Lorem Ipsum is simply dummy text of the printing and typesetting industry. nos reuniremos en la zona del Paseo de las Esculturas para realizar una limpieza de residuos sólidos en la ribera del arroyo.", 
        categoria: "Servicio",
        img: null 
    },
    { 
        id: 8, 
        titulo: "CIRCULAR: TRANSPORTE EN ACTIVIDADES", 
        fecha: "2026-03-22", 
        contenido: "Se recuerda a los Jefes de Unidad que toda unidad de transporte contratada debe presentar: VTV vigente para transporte de pasajeros, seguro de responsabilidad civil actualizado y habilitación de la CNRT para operar.", 
        categoria: "Oficial",
        img: null 
    },
    { 
        id: 9, 
        titulo: "LANZAMIENTO DEL ROVER MOOT 2026", 
        fecha: "2026-03-15", 
        contenido: "Bajo el lema 'Remar contra la corriente', se abren las pre-inscripciones para el Moot Distrital. Contaremos con tres rutas de servicio y una jornada final de reflexión en el Campo Escuela para toda la rama.", 
        categoria: "Eventos",
        img: null 
    },
    { 
        id: 10, 
        titulo: "SEMINARIO: PRIMEROS AUXILIOS AGRESTES", 
        fecha: "2026-03-10", 
        contenido: "Capacitación dictada por profesionales de la salud con experiencia en medicina de montaña. Se abordarán protocolos de estabilización, traslados improvisados y manejo de traumas en contextos de difícil acceso médico.", 
        categoria: "Formación",
        img: null 
    },
    { 
        id: 11, 
        titulo: "BALANCE FINANCIERO ANUAL", 
        fecha: "2026-03-05", 
        contenido: "Dando cumplimiento a los estatutos, la tesorería distrital presenta el informe auditado del ejercicio anterior. El mismo detalla la inversión en materiales para el campo escuela y becas de formación para educadores.", 
        categoria: "Institucional",
        img: null 
    },
    { 
        id: 12, 
        titulo: "MEJORAS EN EL CAMPO ESCUELA", 
        fecha: "2026-02-25", 
        contenido: "Gracias al aporte de los grupos y donaciones, hemos terminado la reconstrucción del sector de cocina común. Se instalaron nuevas luminarias LED y se reforzó el cerco perimetral para mayor seguridad de las unidades.", 
        categoria: "Infraestructura",
        img: null 
    },
    { 
        id: 13, 
        titulo: "FESTIVAL DE LA CANCIÓN SCOUT", 
        fecha: "2026-02-18", 
        contenido: "Buscamos la canción que representará al Distrito 3 en el certamen nacional. Las letras deben reflejar los valores de la ley scout y la identidad bahiense. Las audiciones se realizarán en el salón de actos del Grupo 12.", 
        categoria: "Cultura",
        img: null 
    },
    { 
        id: 14, 
        titulo: "TALLER: REDES INSTITUCIONALES", 
        fecha: "2026-02-10", 
        contenido: "Capacitación para auxiliares de comunicación sobre el uso de marca y privacidad. Protocolos para el manejo de imágenes de menores en redes sociales y directrices de comunicación institucional para todos los grupos.", 
        categoria: "Comunicación",
        img: null 
    },
    { 
        id: 15, 
        titulo: "CONCURSO: INSIGNIA DISTRITAL 2026", 
        fecha: "2026-02-01", 
        contenido: "El concurso está abierto a todas las ramas. El diseño debe incluir la Flor de Lis, la mención 'Distrito 3' y algún elemento representativo de la ciudad de Bahía Blanca. El ganador obtendrá un kit de campamento.", 
        categoria: "Diseño",
        img: null 
    },
    { 
        id: 16, 
        titulo: "PLAN DE EMERGENCIAS DISTRITAL", 
        fecha: "2026-01-25", 
        contenido: "Dada la recurrencia de temporales en la zona, se ha actualizado la matriz de riesgo distrital. Se definen nuevos puntos de evacuación y un sistema de comunicación por radio frecuencia en caso de caída de redes.", 
        categoria: "Seguridad",
        img: null 
    },
    { 
        id: 17, 
        titulo: "PROYECTO: HUERTA COMUNITARIA", 
        fecha: "2026-01-18", 
        contenido: "Iniciativa conjunta para transformar un baldío en un espacio de producción de alimentos y educación ambiental en el barrio Harding Green. Se invita a los grupos a donar semillas y herramientas de mano.", 
        categoria: "Servicio",
        img: null 
    },
    { 
        id: 18, 
        titulo: "RESULTADOS ELECCIÓN CONSEJO", 
        fecha: "2026-01-10", 
        contenido: "Tras la asamblea electoral, se anuncian los nombres de quienes integrarán el Consejo Distrital. Se agradece la gestión saliente por su compromiso en la digitalización de procesos y se da la bienvenida a los nuevos comisionados.", 
        categoria: "Institucional",
        img: null 
    }
];
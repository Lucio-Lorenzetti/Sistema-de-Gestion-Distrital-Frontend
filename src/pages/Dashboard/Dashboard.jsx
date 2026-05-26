import React, { useState } from 'react'; 
import { useAuthStore } from '../../store/useAuthStore'; 
import { 
  Users, FileText, Newspaper, FolderDown, Award, 
  ChevronRight, MessageSquare, Shield, Milestone, Calendar, Clock,
  ChevronLeft, Plus, Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import MetricCard from '../../components/ui/MetricCard';

// =========================================================================
// DATOS DE PRUEBA (MOCK DATA)
// =========================================================================

const PROGRAMAS_RECIENTES_MOCK = [
  { id: 1, titulo: "Plan Anual de Grupo - Ciclo 2026", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hoy, 10:30" },
  { id: 2, titulo: "Proyecto de Campamento Distrital", rama: "Caminantes", grupo: "G.S. San Jorge", estado: "En Revisión", fecha: "Ayer" },
  { id: 3, titulo: "Ciclo de Programa Corto - Unidad Scout", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "En Revisión", fecha: "Hace 2 días" },
  { id: 4, titulo: "Planificación de Progresiones Pedagógicas", rama: "Manada", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 4 días" },
  { id: 5, titulo: "Estrategia de Crecimiento Institucional", rama: "General", grupo: "G.S. San Jorge", estado: "Revisado", fecha: "Hace 5 días" },
];

const ACTIVIDADES_RECIENTES_MOCK = [
  { id: 1, titulo: "Se actualizó el Repositorio Digital", desc: "Auxiliar de Comunicación subió 'AUTORIZACIÓN DE SALIDA GRUPAL v1.0'.", time: "Hace 2 horas" },
  { id: 2, titulo: "Nuevo curso publicado", desc: "Asistente de Formación abrió inscripciones para 'Técnicas de Vida en la Naturaleza'.", time: "Ayer" },
  { id: 3, titulo: "Noticia emitida", desc: "Se publicó en el portal público: 'Noticias Distritales - Mayo 2026'.", time: "Hace 2 días" },
];

const NOTICIAS_RECIENTES_MOCK = [
  { id: 1, titulo: "Gran Fogón Distrital de Apertura 2026", estado: "Publicada", fecha: "Hoy, 09:15", grupo: "Distrital", visitas: "142 vistas" },
  { id: 2, titulo: "Convocatoria a Asamblea General de Zona", estado: "Publicada", fecha: "Ayer", grupo: "Institucional", visitas: "89 vistas" },
  { id: 3, titulo: "Ficha Médica 2026: Recordatorio de Entrega", estado: "Borrador", fecha: "Hace 2 días", grupo: "Secretaría", visitas: "-" },
  { id: 4, titulo: "Resumen de Logros del Indaba Distrital", estado: "Publicada", fecha: "Hace 1 semana", grupo: "Formación", visitas: "210 vistas" },
];

const ITEMS_PER_PAGE = 3; 

const Dashboard = () => {
  const { user } = useAuthStore();
  const userName = user?.name || '-';

  const [currentProgPage, setCurrentProgPage] = useState(1);
  const [currentActPage, setCurrentActPage] = useState(1);
  const [currentNotPage, setCurrentNotPage] = useState(1);

  // DETECCIÓN INTERNA DE ROLES (Sincronizado con tu Seeder)
  const getFunctionalRole = () => {
    if (!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
      return 'educador';
    }
    const rolesList = user.roles.map(r => r.nombre.toLowerCase());
    
    if (rolesList.includes('director')) return 'director';
    if (rolesList.includes('jefe de grupo')) return 'jefe_grupo';
    if (rolesList.includes('aux prog general') || rolesList.includes('aux prog rama')) return 'auxiliar_programa';
    if (rolesList.includes('aux comunicación') || rolesList.includes('aux comunicacion')) return 'auxiliar_comunicacion';
    
    return 'educador';
  };

  const userRole = getFunctionalRole();

  const formatRoleDisplay = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles.map(r => r.nombre).join(' / ');
    }
    return 'Educador';
  };

  // MATEMÁTICA DE LAS PAGINACIONES
  const totalProgPages = Math.ceil(PROGRAMAS_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const currentProgramas = PROGRAMAS_RECIENTES_MOCK.slice((currentProgPage - 1) * ITEMS_PER_PAGE, currentProgPage * ITEMS_PER_PAGE);

  const totalActPages = Math.ceil(ACTIVIDADES_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const currentActividades = ACTIVIDADES_RECIENTES_MOCK.slice((currentActPage - 1) * ITEMS_PER_PAGE, currentActPage * ITEMS_PER_PAGE);

  const totalNotPages = Math.ceil(NOTICIAS_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const currentNoticias = NOTICIAS_RECIENTES_MOCK.slice((currentNotPage - 1) * ITEMS_PER_PAGE, currentNotPage * ITEMS_PER_PAGE);

  // 1. RENDerIZADOR DE MÉTRICAS (MÓDULO SUPERIOR)
  const renderRoleMetrics = () => {
    switch (userRole) {
      case 'director':
        return (
          <>
            <MetricCard icon={<Users />} title="Educadores Registrados" value="124 Activos" sub="Total en Distrito 3" color="border-scout-primary" />
            <MetricCard icon={<Milestone />} title="Programas Observados" value="42 Archivos" sub="Feedback enviado" color="border-scout-muted" />
            <MetricCard icon={<FileText />} title="Programas en Revisión" value="18 Pendientes" sub="Requieren atención" color="border-scout-muted" />
            <MetricCard icon={<Newspaper />} title="Circulares Emitidas" value="18 Oficiales" sub="Año lectivo 2026" color="border-scout-border" />
          </>
        );
      case 'jefe_grupo':
        return (
          <>
            <MetricCard icon={<Users />} title="Mis Educadores" value="14 Dirigentes" sub="G.S. Pompeya" color="border-scout-primary" />
            <MetricCard icon={<FileText />} title="Programas del Grupo" value="32 Subidos" sub="8 en estado borrador" color="border-scout-muted" />
            <MetricCard icon={<Newspaper />} title="Última Noticia" value="Aniversario Grupo" sub="Publicado hace 2 días" color="border-scout-muted" />
            <MetricCard icon={<Milestone />} title="Rendiciones Internas" value="Al Día" sub="Revisión de Distrito OK" color="border-scout-border" />
          </>
        );
      case 'auxiliar_programa':
        return (
          <>
            <MetricCard icon={<FileText />} title="Programas en Revisión" value="7 Pendientes" sub="Requieren feedback urgente" color="border-scout-primary" />
            <MetricCard icon={<Shield />} title="Total Aprobados" value="45 Programas" sub="Listos para ejecución" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Próximos Cursos" value="Módulo 1 e Híbrido" sub="Planificados para Mayo" color="border-scout-muted" />
            <MetricCard icon={<MessageSquare />} title="Notas de Revisión" value="12 Abiertas" sub="Intercambio activo" color="border-scout-border" />
          </>
        );
      case 'auxiliar_comunicacion':
        return (
          <>
            <MetricCard icon={<Newspaper />} title="Noticias Publicadas" value="24 Artículos" sub="Visibles en Home" color="border-scout-primary" />
            <MetricCard icon={<Edit3 />} title="Noticias en Borrador" value="3 Guardadas" sub="Pendientes de revisión" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Noticias de este Mes" value="8 Nuevas" sub="Mayo 2026" color="border-scout-muted" />
            
            {/*REQUERIMIENTO CUMPLIDO: Botón de acción integrado reemplazando la 4ta métrica */}
            <Link 
              to="/noticias-internas/crear" 
              className="bg-scout-primary text-white hover:bg-scout-primary-hover transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between text-left group cursor-pointer border border-scout-primary h-30 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus size={20} className="text-white" />
                </div>
                <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-">Acción Rápida</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">Nueva Noticia</h3>
              </div>
            </Link>
          </>
        );
      case 'educador':
      default:
        return (
          <>
            <MetricCard icon={<FileText />} title="Mis Programas" value="6 Subidos" sub="Rama Rovers • 2 en revisión" color="border-scout-primary" />
            <MetricCard icon={<Award />} title="Nivel de Formación" value="Intermedio" sub="Próximo paso: Avanzado" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Próximo Curso" value="22 Mayo - Nat." sub="Inscripto en Sistema" color="border-scout-muted" />
            <MetricCard icon={<MessageSquare />} title="Feedback Recibido" value="3 Notas" sub="De: Asistente de Programa" color="border-scout-border" />
          </>
        );
    }
  };

  // 2. RENDERIZADOR CONTENIDO CENTRAL (TABLAS DE CONTROL)
  const renderMainContent = () => {
    switch (userRole) {
      case 'auxiliar_comunicacion':
        return (
          <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm min-h-[320px]">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary">Noticias Recientes </h2>
                {NOTICIAS_RECIENTES_MOCK.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                      Pág. {currentNotPage} / {totalNotPages}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => setCurrentNotPage(prev => Math.max(prev - 1, 1))} disabled={currentNotPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                        <ChevronLeft size={14} />
                      </button>
                      <button onClick={() => setCurrentNotPage(prev => Math.min(prev + 1, totalNotPages))} disabled={currentNotPage === totalNotPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-px bg-scout-border" />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                      <th className="pb-3 font-black">Título de la Publicación</th>
                      <th className="pb-3 font-black">Categoría / Origen</th>
                      <th className="pb-3 font-black">Métrica / Alcance</th>
                      <th className="pb-3 font-black text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-scout-border">
                    {currentNoticias.map((noticia) => (
                      <tr key={noticia.id} className="group hover:bg-scout-bg-panel transition-colors">
                        <td className="py-4 pr-3">
                          <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{noticia.titulo}</p>
                          <span className="text-[9px] text-scout-muted flex items-center gap-1 mt-0.5"><Clock size={12} /> {noticia.fecha}</span>
                        </td>
                        <td className="py-4 text-xs font-bold uppercase tracking-wider text-scout-muted">{noticia.grupo}</td>
                        <td className="py-4 text-xs text-scout-primary font-medium">{noticia.visitas}</td>
                        <td className="py-4 text-right">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${noticia.estado === 'Publicada' ? 'bg-scout-success text-white' : 'bg-scout-bg-panel text-scout-primary border border-scout-border'}`}>
                            {noticia.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'director':
      case 'jefe_grupo':
      case 'auxiliar_programa':
      case 'educador':
      default:
        return (
          <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm min-h-[320px]">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary">Programas Recientes del Distrito</h2>
                {PROGRAMAS_RECIENTES_MOCK.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                      Pág. {currentProgPage} / {totalProgPages}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => setCurrentProgPage(prev => Math.max(prev - 1, 1))} disabled={currentProgPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                        <ChevronLeft size={14} />
                      </button>
                      <button onClick={() => setCurrentProgPage(prev => Math.min(prev + 1, totalProgPages))} disabled={currentProgPage === totalProgPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-px bg-scout-border" />
              {PROGRAMAS_RECIENTES_MOCK.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center mx-auto text-scout-muted"><FileText size={20} /></div>
                  <p className="text-sm font-bold text-scout-primary uppercase tracking-tight">No hay programas cargados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                        <th className="pb-3 font-black">Documento / Título</th>
                        <th className="pb-3 font-black">Rama / Unidad</th>
                        <th className="pb-3 font-black">Grupo Scout</th>
                        <th className="pb-3 font-black text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-scout-border">
                      {currentProgramas.map((prog) => (
                        <tr key={prog.id} className="group hover:bg-scout-bg-panel transition-colors">
                          <td className="py-4 pr-3">
                            <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{prog.titulo}</p>
                            <span className="text-[9px] text-scout-muted font-medium flex items-center gap-1 mt-0.5"><Clock size={12} /> {prog.fecha}</span>
                          </td>
                          <td className="py-4 text-xs font-bold uppercase tracking-wider text-scout-muted">{prog.rama}</td>
                          <td className="py-4 text-xs text-scout-muted font-medium">{prog.grupo}</td>
                          <td className="py-4 text-right">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${prog.estado === 'Revisado' ? 'bg-scout-success text-white' : 'bg-scout-bg-panel text-scout-primary border border-scout-border'}`}>
                              {prog.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // 3. RENDERIZADOR ACCESOS RÁPIDOS ADAPTATIVOS
  const renderQuickLinks = () => {
    switch (userRole) {
      case 'director':
          return (
          <>
            <QuickLink to="/gestion-documentos" label="Revisar Drive Distrital" />
            <QuickLink to="/gestion-cursos" label="Calendario de Cursos" />
          </>
        );
      case 'jefe_grupo':
      case 'auxiliar_programa':
      case 'educador':
      default:      
    }
  };

  // 4. RETORNO DE INTERFAZ ESTRUCTURAL LIMPIO Y ESCALABLE
  return (
    <div className="p-6 md:p-10 space-y-10 bg-scout-bg-panel min-h-screen text-left ${userRole === 'auxiliar_comunicacion' ? 'h-screen overflow-hidden' : 'min-h-screen'}"> 
      
      {/* SECCIÓN BIENVENIDA */}
      <div className="border-b border-scout-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
          Panel de Control Privado • Rol Asignado: {formatRoleDisplay()}
        </span>
        <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
          Buen día <span className="text-xl md:text-2xl text-scout-muted tracking-tight uppercase">{userName.split(' ')[0]}</span>
        </h1>
      </div>

      {/* METRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderRoleMetrics()}
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LLAMADO A LA TABLA SEGMENTADA POR ROL */}
        {renderMainContent()}

        {/*MODIFICACIÓN CORE: Ocultamos actividades y accesos rápidos únicamente para Comunicación */}
        {userRole !== 'auxiliar_comunicacion' && (
          <>
            {/* ACTIVIDAD RECIENTE (Exclusivo de Directores, Jefes y Educadores) */}
            <div className="lg:col-span-2 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 flex flex-col justify-between shadow-sm min-h-[310px]">
              <div className="space-y-6 w-full">
                <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Actividad del Sistema</h2>
                <div className="h-px bg-scout-border" />
                <div className="space-y-5">
                  {currentActividades.map((act) => (
                    <ActivityItem key={act.id} title={act.titulo} desc={act.desc} time={act.time} />
                  ))}
                </div>
              </div>

              {ACTIVIDADES_RECIENTES_MOCK.length > ITEMS_PER_PAGE && (
                <div className="flex justify-between items-center pt-6 border-t border-scout-border mt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                    Página {currentActPage} de {totalActPages}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentActPage(prev => Math.max(prev - 1, 1))} disabled={currentActPage === 1} className="p-2 border border-scout-border rounded-xl hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setCurrentActPage(prev => Math.min(prev + 1, totalActPages))} disabled={currentActPage === totalActPages} className="p-2 border border-scout-border rounded-xl hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACCESOS RÁPIDOS (Exclusivo de Directores, Jefes y Educadores) */}
            <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[310px]">
              <div className="space-y-4 w-full">
                <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Acceso Rápido</h2>
                <div className="h-px bg-scout-border" />
                <p className="text-xs text-scout-muted text-left leading-relaxed">
                  Módulos directos de consulta protegidos por tus credenciales de acceso institucional.
                </p>
              </div>
              <div className="space-y-2 w-full mt-4">
                {renderQuickLinks()}
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
};

const ActivityItem = ({ title, desc, time }) => (
  <div className="flex justify-between items-start gap-4 text-left text-xs">
    <div className="space-y-0.5">
      <p className="font-bold text-scout-primary uppercase tracking-tight">{title}</p>
      <p className="text-scout-muted leading-snug">{desc}</p>
    </div>
    <span className="text-[9px] font-black uppercase text-scout-muted tracking-wider whitespace-nowrap pt-0.5">{time}</span>
  </div>
);

const QuickLink = ({ to, label }) => (
  <Link to={to} className="w-full bg-scout-bg-panel border border-scout-border hover:bg-scout-primary hover:text-white text-scout-primary transition-all px-5 py-3.5 rounded-xl flex items-center justify-between group">
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
  </Link>
);

export default Dashboard;
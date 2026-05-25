import React, { useState } from 'react'; 
import { useAuthStore } from '../../store/useAuthStore'; 
import { 
  Users, FileText, Newspaper, FolderDown, Award, 
  ChevronRight, MessageSquare, Shield, Milestone, Calendar, Clock,
  ChevronLeft 
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
  { id: 6, titulo: "Calendario de Salidas Invernales", rama: "Caminantes", grupo: "G.S. Don Bosco", estado: "En Revisión", fecha: "Hace 6 días" },
  { id: 7, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 8, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 9, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 10, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 11, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 12, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 13, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
  { id: 14, titulo: "Proyecto de Servicio Comunitario", rama: "Rover", grupo: "G.S. Pompeya", estado: "Revisado", fecha: "Hace 1 semana" },
];

const ACTIVIDADES_RECIENTES_MOCK = [
  { id: 1, titulo: "Se actualizó el Repositorio Digital", desc: "Auxiliar de Comunicación subió 'AUTORIZACIÓN DE SALIDA GRUPAL v1.0'.", time: "Hace 2 horas" },
  { id: 2, titulo: "Nuevo curso publicado", desc: "Asistente de Formación abrió inscripciones para 'Técnicas de Vida en la Naturaleza'.", time: "Ayer" },
  { id: 3, titulo: "Noticia emitida", desc: "Se publicó en el portal público: 'Noticias Distritales - Mayo 2026'.", time: "Hace 2 días" },
  { id: 4, titulo: "Aprobación masiva de actas", desc: "El Director Distrital validó los balances de zona presentados.", time: "Hace 4 días" },
  { id: 5, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" },
  { id: 6, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" },
  { id: 7, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" },
  { id: 8, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" },
  { id: 9, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" },
  { id: 10, titulo: "Mantenimiento programado", desc: "Se sincronizaron los servidores de archivos de la base Supabase.", time: "Hace 5 días" }
];

const ITEMS_PER_PAGE = 3; 

const Dashboard = () => {
  const { user } = useAuthStore();
  const userName = user?.name || '-';

  const [currentProgPage, setCurrentProgPage] = useState(1);
  const [currentActPage, setCurrentActPage] = useState(1);

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

  // Paginación Programas
  const totalProgPages = Math.ceil(PROGRAMAS_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const indexOfLastProg = currentProgPage * ITEMS_PER_PAGE;
  const indexOfFirstProg = indexOfLastProg - ITEMS_PER_PAGE;
  const currentProgramas = PROGRAMAS_RECIENTES_MOCK.slice(indexOfFirstProg, indexOfLastProg);

  // Paginación Actividades
  const totalActPages = Math.ceil(ACTIVIDADES_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const indexOfLastAct = currentActPage * ITEMS_PER_PAGE;
  const indexOfFirstAct = indexOfLastAct - ITEMS_PER_PAGE;
  const currentActividades = ACTIVIDADES_RECIENTES_MOCK.slice(indexOfFirstAct, indexOfLastAct);

  const renderRoleMetrics = () => {
    switch (userRole) {
      case 'director':
        return (
          <>
            <MetricCard icon={<Users />} title="Educadores Registrados" value="124 Activos" sub="Total en Distrito 3" color="border-black" />
            <MetricCard icon={<Milestone />} title="Programas Observados" value="42 Archivos" sub="Feedback enviado" color="border-neutral-800" />
            <MetricCard icon={<FileText />} title="Programas en Revisión" value="18 Pendientes" sub="Requieren atención" color="border-neutral-500" />
            <MetricCard icon={<Newspaper />} title="Circulares Emitidas" value="18 Oficiales" sub="Año lectivo 2026" color="border-neutral-300" />
          </>
        );
      default:
        return (
          <>
            <MetricCard icon={<FileText />} title="Mis Programas" value="6 Subidos" sub="Rama Rovers • 2 en revisión" color="border-black" />
            <MetricCard icon={<Award />} title="Nivel de Formación" value="Intermedio" sub="Próximo paso: Avanzado" color="border-neutral-800" />
            <MetricCard icon={<Calendar />} title="Próximo Curso" value="22 Mayo - Nat." sub="Inscripto en Sistema" color="border-neutral-500" />
            <MetricCard icon={<MessageSquare />} title="Feedback Recibido" value="3 Notas" sub="De: Asistente de Programa" color="border-neutral-300" />
          </>
        );
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10 bg-neutral-50 min-h-screen text-left">
      
      {/* 🛠️ SECCIÓN BIENVENIDA COMPACTADA (Más pequeña y sutil) */}
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-0.5">
          Panel de Control Privado • Rol Asignado: {formatRoleDisplay()}
        </span>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
          Buen día <span className="text-xl md:text-2xl text-neutral-400 tracking-tight uppercase">{userName.split(' ')[0]}</span>
        </h1>
      </div>

      {/* METRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderRoleMetrics()}
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* TABLA DE PROGRAMAS RECIENTES CON CONTROLES SUPERIORES */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-neutral-100 p-8 space-y-6 shadow-sm min-h-[320px]">
          <div className="space-y-6">
            
            {/* 🛠️ HEADER DE LA TABLA: Reemplazamos Vista Global por la Paginación en línea */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Programas Recientes del Distrito</h2>
              
              {PROGRAMAS_RECIENTES_MOCK.length > ITEMS_PER_PAGE && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Pág. {currentProgPage} / {totalProgPages}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentProgPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentProgPage === 1}
                      className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button 
                      onClick={() => setCurrentProgPage(prev => Math.min(prev + 1, totalProgPages))}
                      disabled={currentProgPage === totalProgPages}
                      className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-neutral-100" />
            
            {PROGRAMAS_RECIENTES_MOCK.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-center mx-auto text-neutral-400">
                  <FileText size={20} />
                </div>
                <p className="text-sm font-bold text-black uppercase tracking-tight">No hay programas cargados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      <th className="pb-3 font-black">Documento / Título</th>
                      <th className="pb-3 font-black">Rama / Unidad</th>
                      <th className="pb-3 font-black">Grupo Scout</th>
                      <th className="pb-3 font-black text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {currentProgramas.map((prog) => (
                      <tr key={prog.id} className="group hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 pr-3">
                          <p className="text-xs font-bold text-black group-hover:text-neutral-800 transition-colors">{prog.titulo}</p>
                          <span className="text-[9px] text-neutral-400 font-medium flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> {prog.fecha}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                          {prog.rama}
                        </td>
                        <td className="py-4 text-xs text-neutral-600 font-medium">
                          {prog.grupo}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                            prog.estado === 'Revisado' 
                              ? 'bg-neutral-950 text-white' 
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}>
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

        {/* BLOQUE INFERIOR IZQUIERDO: ACTIVIDAD RECIENTE */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-neutral-100 p-8 flex flex-col justify-between shadow-sm min-h-[310px]">
          <div className="space-y-6 w-full">
            <h2 className="text-xl font-black uppercase tracking-tight text-left">Actividad del Sistema</h2>
            <div className="h-px bg-neutral-100" />
            <div className="space-y-5">
              {currentActividades.map((act) => (
                <ActivityItem key={act.id} title={act.titulo} desc={act.desc} time={act.time} />
              ))}
            </div>
          </div>

          {/* CONTROLES DE PAGINACIÓN DE ACTIVIDADES (Mantiene su base tradicional) */}
          {ACTIVIDADES_RECIENTES_MOCK.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center pt-6 border-t border-neutral-100 mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Página {currentActPage} de {totalActPages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentActPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentActPage === 1}
                  className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentActPage(prev => Math.min(prev + 1, totalActPages))}
                  disabled={currentActPage === totalActPages}
                  className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE INFERIOR DERECHO: ACCESOS RÁPIDOS */}
        <div className="bg-white rounded-[2rem] border border-neutral-100 p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[310px]">
          <div className="space-y-4 w-full">
            <h2 className="text-xl font-black uppercase tracking-tight text-left">Acceso Rápido</h2>
            <div className="h-px bg-neutral-100" />
            <p className="text-xs text-neutral-400 text-left leading-relaxed">
              Módulos directos de consulta protegidos por tus credenciales de Director Distrital.
            </p>
          </div>
          <div className="space-y-2 w-full mt-4">
            <QuickLink to="/gestion-documentos" label="Revisar Drive Distrital" />
            <QuickLink to="/gestion-cursos" label="Calendario de Cursos" />
          </div>
        </div>

      </div>

    </div>
  );
};

const ActivityItem = ({ title, desc, time }) => (
  <div className="flex justify-between items-start gap-4 text-left text-xs">
    <div className="space-y-0.5">
      <p className="font-bold text-black uppercase tracking-tight">{title}</p>
      <p className="text-neutral-500 leading-snug">{desc}</p>
    </div>
    <span className="text-[9px] font-black uppercase text-neutral-300 tracking-wider whitespace-nowrap pt-0.5">{time}</span>
  </div>
);

const QuickLink = ({ to, label }) => (
  <Link to={to} className="w-full bg-neutral-50 border border-neutral-200/60 hover:bg-black hover:text-white transition-all px-5 py-3.5 rounded-xl flex items-center justify-between group">
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
  </Link>
);

export default Dashboard;
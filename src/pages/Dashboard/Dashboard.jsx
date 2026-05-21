import React from 'react';
import { useAuthStore } from '../../store/useAuthStore'; // Tu store de Zustand configurado
import { Users, FileText, Newspaper, FolderDown, Award, ChevronRight, MessageSquare, Shield, Milestone, Calendar} from 'lucide-react';
import { Link } from 'react-router-dom'; // 👈 AGREGÁ ESTO
import MetricCard from '../../components/ui/MetricCard';

const Dashboard = () => {
  // Obtenemos el usuario y su rol del estado global
  const { user } = useAuthStore();
  
  // Extraemos el rol. Por defecto usamos 'educador' para las pruebas si no viene definido
  const userRole = user?.rol?.toLowerCase() || 'educador';
  const userName = user?.name || 'Lucio Lorenzetti';
  const renderRoleMetrics = () => {
    switch (userRole) {
      case 'director':
        return (
          <>
            <MetricCard icon={<Shield />} title="Grupos en Distrito" value="9 Grupos" sub="Ordenados alfabéticamente" color="border-black" />
            <MetricCard icon={<Users />} title="Total Educadores" value="124 Activos" sub="En todo el Distrito 3" color="border-neutral-800" />
            <MetricCard icon={<FileText />} title="Último Programa" value="v4.2 Uniformes" sub="Subido hoy por G.S. Pompeya" color="border-neutral-500" />
            <MetricCard icon={<Newspaper />} title="Circulares Emitidas" value="18 Oficiales" sub="Año lectivo 2026" color="border-neutral-300" />
          </>
        );
      case 'jefe_grupo':
        return (
          <>
            <MetricCard icon={<Users />} title="Mis Educadores" value="14 Dirigentes" sub="G.S. San Jorge" color="border-black" />
            <MetricCard icon={<FileText />} title="Programas del Grupo" value="32 Subidos" sub="8 en estado borrador" color="border-neutral-800" />
            <MetricCard icon={<Newspaper />} title="Última Noticia" value="Aniversario Grupo" sub="Publicado hace 2 días" color="border-neutral-500" />
            <MetricCard icon={<Milestone />} title="Rendiciones Internas" value="Al Día" sub="Revisión de Distrito OK" color="border-neutral-300" />
          </>
        );
      case 'auxiliar_programa':
        return (
          <>
            <MetricCard icon={<FileText />} title="Programas en Revisión" value="7 Pendientes" sub="Requieren feedback urgente" color="border-black" />
            <MetricCard icon={<Shield />} title="Total Aprobados" value="45 Programas" sub="Listos para ejecución" color="border-neutral-800" />
            <MetricCard icon={<Calendar />} title="Próximos Cursos" value="Módulo 1 e Híbrido" sub="Planificados para Mayo/Junio" color="border-neutral-500" />
            <MetricCard icon={<MessageSquare />} title="Notas de Revisión" value="12 Abiertas" sub="Intercambio activo con educadores" color="border-neutral-300" />
          </>
        );
      case 'auxiliar_comunicacion':
        return (
          <>
            <MetricCard icon={<Newspaper />} title="Noticias Publicadas" value="24 Artículos" sub="Sección Noticias Distritales" color="border-black" />
            <MetricCard icon={<FolderDown />} title="Descargas Servidas" value="1.4K Bajas" sub="Ficha Médica es el más descargado" color="border-neutral-800" />
            <MetricCard icon={<Milestone />} title="Estado Repositorio" value="v2.1 Digital" sub="6 PDFs oficiales en línea" color="border-neutral-500" />
            <MetricCard icon={<MessageSquare />} title="Último Comunicado" value="Salidas Grupales" sub="Actualizado en Home pública" color="border-neutral-300" />
          </>
        );
      case 'educador':
      default:
        return (
          <>
            <MetricCard icon={<FileText />} title="Mis Programas" value="6 Subidos" sub="Rama Rovers • 2 en revisión" color="border-black" />
            <MetricCard icon={<Award />} title="Nivel de Formación" value="Intermedio" sub="Próximo paso: Avanzado" color="border-neutral-800" />
            <MetricCard icon={<Calendar />} title="Próximo Curso" value="22 Mayo - Nat." sub="Inscripto en Google Form" color="border-neutral-500" />
            <MetricCard icon={<MessageSquare />} title="Feedback Recibido" value="3 Notas" sub="De: Asistente de Programa" color="border-neutral-300" />
          </>
        );
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10 bg-neutral-50 min-h-screen text-left">
      
      {/* SECCIÓN BIENVENIDA */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 block mb-1">
          Panel de Control Privado • Rol: {userRole.replace('_', ' ')}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none">
          Buen día, <span className="text-black/30 italic">{userName.split(' ')[0]}</span>
        </h1>
      </div>

      {/* METRICAS PRINCIPALES DINÁMICAS (Grid adaptable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderRoleMetrics()}
      </div>

      {/* SECCIÓN INFERIOR: HISTORIAL O ENLACES RÁPIDOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Bloque de novedades del sistema */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-neutral-100 p-8 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Actividad Reciente del Distrito</h2>
          <div className="h-px bg-neutral-100" />
          <div className="space-y-4">
            <ActivityItem title="Se actualizó el Repositorio Digital" desc="Auxiliar de Comunicación subió 'AUTORIZACIÓN DE SALIDA GRUPAL v1.0'." time="Hace 2 horas" />
            <ActivityItem title="Nuevo curso publicado" desc="Asistente de Formación abrió inscripciones para 'Técnicas de Vida en la Naturaleza'." time="Ayer" />
            <ActivityItem title="Noticia emitida" desc="Se publicó en el portal público: 'Noticias Distritales - Mayo 2026'." time="Hace 2 días" />
          </div>
        </div>

        {/* Bloque lateral: Accesos directos rápidos */}
        <div className="bg-black text-white rounded-[2rem] p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight">Acceso Rápido</h2>
            <p className="text-xs opacity-40 leading-relaxed">Accesos directos a los recursos centrales protegidos por tu nivel de autorización.</p>
          </div>
          <div className="space-y-2">
            <QuickLink to="/gestion-documentos" label="Mi Documentación Oficial" />
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
      <p className="text-neutral-500 leading-tight">{desc}</p>
    </div>
    <span className="text-[9px] font-black uppercase text-neutral-300 tracking-wider whitespace-nowrap">{time}</span>
  </div>
);

const QuickLink = ({ to, label }) => (
  <Link to={to} className="w-full bg-white/10 hover:bg-white/20 transition-all px-5 py-4 rounded-xl flex items-center justify-between group">
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
  </Link>
);

export default Dashboard;
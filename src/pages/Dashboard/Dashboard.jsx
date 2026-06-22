import React, { useState, useEffect, useRef } from 'react';
import imgDefault from '../../assets/noticia-default.jpg';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Users, FileText, Newspaper, FolderDown, Award,
  ChevronRight, ChevronDown, MessageSquare, Shield, Milestone, Calendar, Clock,
  ChevronLeft, Plus, Edit3, Eye, Trash2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/ui/MetricCard';

// DATOS DE PRUEBA (MOCK DATA) — solo programas y actividades, noticias vienen del back
const PROGRAMAS_RECIENTES_MOCK = [
  { id: 1, titulo: "Plan Anual de Grupo - Ciclo 2026", rama: "Rover", grupo: "G.S. Pompeya", estado: "Aprobado", fechaEnviado: "10/05/2026", ultimaActualizacion: "20/05/2026" },
  { id: 2, titulo: "Proyecto de Campamento Distrital", rama: "Caminantes", grupo: "G.S. San Jorge", estado: "En Revisión", fechaEnviado: "18/05/2026", ultimaActualizacion: "21/05/2026" },
  { id: 3, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 4, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 5, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 6, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 7, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 8, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 9, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
  { id: 10, titulo: "Ciclo de Programa Corto", rama: "Unidad", grupo: "G.S. Don Bosco", estado: "Observado", fechaEnviado: "15/05/2026", ultimaActualizacion: "22/05/2026" },
];

const ACTIVIDADES_RECIENTES_MOCK = [
  { id: 1, titulo: "Se actualizó el Repositorio Digital", desc: "Auxiliar de Comunicación subió 'AUTORIZACIÓN DE SALIDA GRUPAL v1.0'.", time: "Hace 2 horas" },
  { id: 2, titulo: "Nuevo curso publicado", desc: "Asistente de Formación abrió inscripciones para 'Técnicas de Vida en la Naturaleza'.", time: "Ayer" },
  { id: 3, titulo: "Noticia emitida", desc: "Se publicó en el portal público: 'Noticias Distritales - Mayo 2026'.", time: "Hace 2 días" },
];

const FILTROS_NOTICIAS = [
  { key: 'Todas', label: 'Todas' },
  { key: 'Publicada', label: 'Publicadas' },
  { key: 'Borrador', label: 'Borradores' },
  { key: 'Programada', label: 'Programadas' },
];

const FILTROS_PROGRAMAS = [
  { key: 'Todos', label: 'Todos' },
  { key: 'En Revisión', label: 'En Revisión' },
  { key: 'Observado', label: 'Observados' },
  { key: 'Aprobado', label: 'Aprobados' },
];

const ITEMS_PER_PAGE = 3;

const ROLES_FULL_HEIGHT = ['auxiliar_comunicacion', 'auxiliar_programa', 'director'];

const Dashboard = () => {
  const { user } = useAuthStore();
  const userName = user?.name || '-';

  // — Estados de paginación y filtros —
  const [currentProgPage, setCurrentProgPage] = useState(1);
  const [currentActPage, setCurrentActPage] = useState(1);
  const [currentNotPage, setCurrentNotPage] = useState(1);
  const [filtroNoticias, setFiltroNoticias] = useState('Todas');
  const [filtroProgramas, setFiltroProgramas] = useState('Todos');
  const [filtroProgramasOpen, setFiltroProgramasOpen] = useState(false);
  const [filtroNoticiasOpen, setFiltroNoticiasOpen] = useState(false);

  // — Estado noticias desde el back —
  const [expandedNoticiaId, setExpandedNoticiaId] = useState(null);
  const [noticias, setNoticias] = useState([]);

  const filtroProgRef = useRef(null);
  const filtroNotRef = useRef(null);

  // — Rol funcional (se calcula antes del useEffect) —
  const getFunctionalRole = () => {
    if (!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) return 'educador';
    const rolesList = user.roles.map(r => r.nombre.toLowerCase());
    if (rolesList.includes('director')) return 'director';
    if (rolesList.includes('jefe de grupo')) return 'jefe_grupo';
    if (rolesList.includes('aux prog general') || rolesList.includes('aux prog rama')) return 'auxiliar_programa';
    if (rolesList.includes('aux comunicación') || rolesList.includes('aux comunicacion')) return 'auxiliar_comunicacion';
    return 'educador';
  };

  const userRole = getFunctionalRole();
  const isFullHeight = ROLES_FULL_HEIGHT.includes(userRole);

  // — Fetch noticias (solo para auxiliar_comunicacion) —
  useEffect(() => {
    if (userRole === 'auxiliar_comunicacion') {
      const token = useAuthStore.getState().token;
      fetch('/api/news', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => setNoticias(data))
        .catch(err => console.error('Error al cargar noticias:', err));
    }
  }, [userRole]);

  // — Cerrar dropdowns al hacer click afuera —
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filtroProgRef.current && !filtroProgRef.current.contains(e.target)) setFiltroProgramasOpen(false);
      if (filtroNotRef.current && !filtroNotRef.current.contains(e.target)) setFiltroNoticiasOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRoleDisplay = () => {
    if (user?.roles && user.roles.length > 0) return user.roles.map(r => r.nombre).join(' / ');
    return 'Educador';
  };

  // — Paginación actividades —
  const totalActPages = Math.ceil(ACTIVIDADES_RECIENTES_MOCK.length / ITEMS_PER_PAGE);
  const currentActividades = ACTIVIDADES_RECIENTES_MOCK.slice((currentActPage - 1) * ITEMS_PER_PAGE, currentActPage * ITEMS_PER_PAGE);

  // — Noticias filtradas —
  const noticiasFiltradas = filtroNoticias === 'Todas'
    ? noticias
    : noticias.filter(n => n.estado === filtroNoticias);
  const totalNotPages = Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE);
  const currentNoticias = noticiasFiltradas.slice((currentNotPage - 1) * ITEMS_PER_PAGE, currentNotPage * ITEMS_PER_PAGE);
  const handleNoticiasFiltroChange = (key) => { setFiltroNoticias(key); setCurrentNotPage(1); };

  // — Programas filtrados —
  const programasFiltrados = filtroProgramas === 'Todos'
    ? PROGRAMAS_RECIENTES_MOCK
    : PROGRAMAS_RECIENTES_MOCK.filter(n => n.estado === filtroProgramas);
  const totalProgPages = Math.ceil(programasFiltrados.length / ITEMS_PER_PAGE);
  const currentProgramas = programasFiltrados.slice((currentProgPage - 1) * ITEMS_PER_PAGE, currentProgPage * ITEMS_PER_PAGE);
  const handleFiltroProgramasChange = (key) => { setFiltroProgramas(key); setCurrentProgPage(1); setFiltroProgramasOpen(false); };

  // — Eliminar noticia —
  const noticiaExpandida = noticias.find(n => n.id === expandedNoticiaId);

  const handleEliminarNoticia = (id) => {
    const token = useAuthStore.getState().token;
    fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(() => setNoticias(prev => prev.filter(n => n.id !== id)))
      .catch(err => console.error('Error al eliminar noticia:', err));
  };

  const handlePublicarRapido = async (id) => {
    const token = useAuthStore.getState().token;
    try {
      await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estado: 'Publicada', publicado_at: new Date().toISOString() })
      });
      // Actualizamos el estado local para no recargar la página
      setNoticias(prev => prev.map(n => n.id === id ? { ...n, estado: 'Publicada' } : n));
    } catch (err) {
      console.error('Error al publicar rápidamente:', err);
    }
  };

  // — Dropdown reutilizable —
  const FiltroDropdown = ({ value, onChange, opciones, filtroRef, open, setOpen }) => (
    <div className="relative" ref={filtroRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
      >
        {opciones.find(f => f.key === value)?.label}
        <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
          {opciones.map((filtro) => (
            <button
              key={filtro.key}
              onClick={() => { onChange(filtro.key); setOpen(false); }}
              className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${value === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // — Badge de estado —
  const EstadoBadge = ({ estado }) => {
    const styles =
      estado === 'Aprobado' ? 'bg-scout-success text-white' :
        estado === 'Observado' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
          estado === 'En Revisión' ? 'bg-scout-bg-panel text-scout-primary border border-scout-border' :
            'bg-scout-bg-panel text-scout-primary border border-scout-border';
    return <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap ${styles}`}>{estado}</span>;
  };

  // — Tabla de programas —
  const TablaProgramas = () => (
    <>
      {currentProgramas.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><FileText size={20} /></div>
          <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay programas con ese estado</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                <th className="pb-3 font-black">Documento / Título</th>
                <th className="pb-3 font-black text-center">Rama</th>
                <th className="pb-3 font-black text-center">Grupo Scout</th>
                <th className="pb-3 font-black text-center">Estado</th>
                <th className="pb-3 font-black text-center">Fecha Enviado</th>
                <th className="pb-3 font-black text-center">Últ. Actualización</th>
                <th className="pb-3 font-black text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-scout-border">
              {currentProgramas.map((prog) => (
                <tr key={prog.id} className="group hover:bg-scout-bg-panel transition-colors">
                  <td className="py-4 pr-3">
                    <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{prog.titulo}</p>
                  </td>
                  <td className="py-4 text-xs font-bold uppercase tracking-wider text-scout-muted text-center">{prog.rama}</td>
                  <td className="py-4 text-xs text-scout-muted font-medium text-center">{prog.grupo}</td>
                  <td className="py-4 text-center"><EstadoBadge estado={prog.estado} /></td>
                  <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{prog.fechaEnviado}</td>
                  <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{prog.ultimaActualizacion}</td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Ver"><Eye size={13} /></button>
                      <button className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Comentar"><MessageSquare size={13} /></button>
                      <button className="p-1.5 rounded-lg border border-scout-border hover:bg-green-50 text-scout-muted hover:text-scout-success transition-colors cursor-pointer" title="Aprobar"><Shield size={13} /></button>
                      <button className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Descargar"><FolderDown size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {programasFiltrados.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
          <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentProgPage} / {totalProgPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentProgPage(prev => Math.max(prev - 1, 1))} disabled={currentProgPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
            <button onClick={() => setCurrentProgPage(prev => Math.min(prev + 1, totalProgPages))} disabled={currentProgPage === totalProgPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </>
  );

  // 1. RENDERIZADOR DE MÉTRICAS
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
            <MetricCard icon={<FileText />} title="Programas en Revisión" value="12" sub="Pendientes de evaluación" color="border-scout-primary" />
            <MetricCard icon={<MessageSquare />} title="Programas Observados" value="5" sub="Esperando correcciones" color="border-scout-muted" />
            <MetricCard icon={<Shield />} title="Total Revisados" value="87" sub="Durante el ciclo actual" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Aprobados este Mes" value="18" sub="Listos para ejecución" color="border-scout-border" />
          </>
        );
      case 'auxiliar_comunicacion':
        return (
          <>
            <MetricCard icon={<Newspaper />} title="Noticias Publicadas" value={`${noticias.filter(n => n.estado === 'Publicada').length} Artículos`} sub="Visibles en Home" color="border-scout-primary" />
            <MetricCard icon={<Edit3 />} title="Noticias en Borrador" value={`${noticias.filter(n => n.estado === 'Borrador').length} Guardadas`} sub="Pendientes de revisión" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Total de Noticias" value={`${noticias.length} En Sistema`} sub="Todas las categorías" color="border-scout-muted" />
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
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">Acción Rápida</span>
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

  // 2. RENDERIZADOR CONTENIDO CENTRAL
  const renderMainContent = () => {
    switch (userRole) {

      // — AUXILIAR COMUNICACIÓN —
      case 'auxiliar_comunicacion':
        return (
          <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Noticias Recientes</h2>
              <FiltroDropdown value={filtroNoticias} onChange={handleNoticiasFiltroChange} opciones={FILTROS_NOTICIAS} filtroRef={filtroNotRef} open={filtroNoticiasOpen} setOpen={setFiltroNoticiasOpen} />
            </div>
            <div className="h-px bg-scout-border shrink-0 mt-5" />
            {currentNoticias.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><Newspaper size={20} /></div>
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay noticias con ese estado</p>
              </div>
            ) : (
              <div className="overflow-x-auto mt-6 flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                      <th className="pb-3 font-black">Título</th>
                      <th className="pb-3 font-black">Estado</th>
                      <th className="pb-3 font-black">Autor</th>
                      <th className="pb-3 font-black">Fecha</th>
                      <th className="pb-3 font-black text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-scout-border">
                    {currentNoticias.map((noticia) => (
                      <tr key={noticia.id} className="group hover:bg-scout-bg-panel transition-colors">
                        <td className="py-4 pr-4"><p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{noticia.titulo}</p></td>
                        <td className="py-4 pr-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap ${noticia.estado === 'Publicada' ? 'bg-scout-success text-white' : noticia.estado === 'Programada' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-scout-bg-panel text-scout-primary border border-scout-border'}`}>{noticia.estado}</span>
                        </td>
                        <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{noticia.autor || 'Sin asignar'}</td>
                        <td className="py-4 pr-4"><span className="text-[9px] text-scout-muted flex items-center gap-1 whitespace-nowrap"><Clock size={11} /> {noticia.fecha}</span></td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {noticia.estado === 'Borrador' && (
                              <button
                                onClick={() => handlePublicarRapido(noticia.id)}
                                className="p-1.5 rounded-lg border border-scout-border hover:bg-green-50 text-scout-muted hover:text-scout-success transition-colors cursor-pointer"
                                title="Publicar ahora"
                              >
                                <Send size={13} />
                              </button>
                            )}
                            {/* BOTÓN EDITAR */}
                            <Link
                              to={`/noticias-internas/editar/${noticia.id}`}
                              className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit3 size={13} />
                            </Link>

                            {/* BOTÓN VER (Abre en otra pestaña) */}
                            <button
                              onClick={() => setExpandedNoticiaId(noticia.id)}
                              className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                              title="Ver"
                            >
                              <Eye size={13} />
                            </button>

                            {/* BOTÓN BORRAR */}
                            <button
                              onClick={() => {
                                if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
                                  handleEliminarNoticia(noticia.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-scout-border hover:bg-red-50 text-scout-muted hover:text-scout-accent transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {noticiasFiltradas.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentNotPage} / {totalNotPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentNotPage(prev => Math.max(prev - 1, 1))} disabled={currentNotPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                  <button onClick={() => setCurrentNotPage(prev => Math.min(prev + 1, totalNotPages))} disabled={currentNotPage === totalNotPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        );

      // — AUXILIAR PROGRAMA y DIRECTOR —
      case 'auxiliar_programa':
      case 'director':
        return (
          <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Programas Recientes del Distrito</h2>
              <FiltroDropdown value={filtroProgramas} onChange={handleFiltroProgramasChange} opciones={FILTROS_PROGRAMAS} filtroRef={filtroProgRef} open={filtroProgramasOpen} setOpen={setFiltroProgramasOpen} />
            </div>
            <div className="h-px bg-scout-border shrink-0 mt-5" />
            <TablaProgramas />
          </div>
        );

      // — RESTO DE ROLES —
      case 'jefe_grupo':
      case 'educador':
      default:
        return (
          <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm min-h-[320px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary">Programas Recientes del Distrito</h2>
            </div>
            <div className="h-px bg-scout-border" />
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
                  {PROGRAMAS_RECIENTES_MOCK.slice(0, ITEMS_PER_PAGE).map((prog) => (
                    <tr key={prog.id} className="group hover:bg-scout-bg-panel transition-colors">
                      <td className="py-4 pr-3">
                        <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{prog.titulo}</p>
                        <span className="text-[9px] text-scout-muted font-medium flex items-center gap-1 mt-0.5"><Clock size={12} /> {prog.fechaEnviado}</span>
                      </td>
                      <td className="py-4 text-xs font-bold uppercase tracking-wider text-scout-muted">{prog.rama}</td>
                      <td className="py-4 text-xs text-scout-muted font-medium">{prog.grupo}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${prog.estado === 'Aprobado' ? 'bg-scout-success text-white' : prog.estado === 'Observado' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-scout-bg-panel text-scout-primary border border-scout-border'}`}>{prog.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  // 3. RENDERIZADOR ACCESOS RÁPIDOS
  const renderQuickLinks = () => {
    if (userRole === 'director') return (
      <>
        <QuickLink to="/gestion-documentos" label="Revisar Drive Distrital" />
        <QuickLink to="/gestion-cursos" label="Calendario de Cursos" />
      </>
    );
    return null;
  };


  // 4. RETORNO DE INTERFAZ
  return (
    <div
      className="bg-scout-bg-panel text-left relative"
      style={
        isFullHeight
          ? { height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }
          : { minHeight: '100%', padding: '2.5rem' }
      }
    >
      {/* BIENVENIDA */}
      <div className="border-b border-scout-border pb-4 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
          Panel de Control Privado • Rol Asignado: {formatRoleDisplay()}
        </span>
        <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
          Buen día <span className="text-xl md:text-2xl text-scout-muted tracking-tight uppercase">{userName.split(' ')[0]}</span>
        </h1>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
        {renderRoleMetrics()}
      </div>

      {/* SECCIÓN INFERIOR */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10"
        style={isFullHeight ? { flex: 1, minHeight: 0, alignItems: 'stretch' } : { alignItems: 'start' }}
      >
        {renderMainContent()}

        {/* Actividad + Accesos rápidos — solo para director */}
        {userRole === 'director' && (
          <>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Página {currentActPage} de {totalActPages}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentActPage(prev => Math.max(prev - 1, 1))} disabled={currentActPage === 1} className="p-2 border border-scout-border rounded-xl hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentActPage(prev => Math.min(prev + 1, totalActPages))} disabled={currentActPage === totalActPages} className="p-2 border border-scout-border rounded-xl hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 space-y-6 shadow-sm flex flex-col justify-between h-full min-h-[310px]">
              <div className="space-y-4 w-full">
                <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Acceso Rápido</h2>
                <div className="h-px bg-scout-border" />
                <p className="text-xs text-scout-muted text-left leading-relaxed">Módulos directos de consulta protegidos por tus credenciales de acceso institucional.</p>
              </div>
              <div className="space-y-2 w-full mt-4">{renderQuickLinks()}</div>
            </div>
          </>
        )}
        {/* 2. PEGAS EL MODAL ACÁ, JUSTO ANTES DEL ÚLTIMO </div> */}
        {expandedNoticiaId && noticiaExpandida && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedNoticiaId(null)} />
            <div className="relative bg-scout-bg-card w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
              <button onClick={() => setExpandedNoticiaId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                <X size={20} />
              </button>
              <div className="md:w-1/2 h-64 md:h-auto bg-scout-bg-panel">
                <img
                  src={noticiaExpandida.imagen || imgDefault}
                  className="w-full h-full object-cover"
                  alt={noticiaExpandida.titulo}
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-scout-muted block mb-4 text-left">
                  {noticiaExpandida.categoria || 'General'} • {noticiaExpandida.fecha}
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-8 text-scout-primary text-left">
                  {noticiaExpandida.titulo}
                </h2>
                <p className="text-scout-muted leading-relaxed text-sm md:text-base text-left">
                  {noticiaExpandida.contenido || noticiaExpandida.cuerpo}
                </p>
              </div>
            </div>
          </div>
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
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  GraduationCap, CalendarCheck, CalendarClock, CalendarOff,
  ChevronRight, ChevronDown, ChevronLeft, Plus, Edit3, Eye, Trash2,
  ExternalLink, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import MetricCard from '../../components/ui/MetricCard';

const CURSOS_ENDPOINT = '/api/courses';

const ITEMS_PER_PAGE = 3;

const FILTROS_ESTADO = [
  { key: 'Todos', label: 'Todos' },
  { key: 'Abierto', label: 'Abiertos' },
  { key: 'Cerrado', label: 'Cerrados' },
  { key: 'Finalizado', label: 'Finalizados' },
];

// — Calcula el estado real del curso en base a las fechas —
const getEstadoCurso = (curso) => {
  const hoy = new Date().toISOString().split('T')[0];
  if (curso.fecha_fin && hoy > curso.fecha_fin) return 'Finalizado';
  if (curso.fecha_cierre && hoy > curso.fecha_cierre) return 'Cerrado';
  return 'Abierto';
};

const EstadoBadge = ({ estado }) => {
  const styles =
    estado === 'Abierto' ? 'bg-scout-success text-white' :
      estado === 'Cerrado' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
        'bg-scout-bg-panel text-scout-muted border border-scout-border';
  return <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap ${styles}`}>{estado}</span>;
};

const CategoriaBadge = ({ categoria }) => (
  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md whitespace-nowrap bg-scout-bg-panel text-scout-primary border border-scout-border">
    {categoria}
  </span>
);

const GestionCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroOpen, setFiltroOpen] = useState(false);
  const filtroRef = useRef(null);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    axios.get(CURSOS_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(res => setCursos(res.data))
      .catch(err => console.error('Error al cargar cursos:', err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) setFiltroOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEliminar = (id) => {
    const token = useAuthStore.getState().token;
    axios.delete(`${CURSOS_ENDPOINT}/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(() => setCursos(prev => prev.filter(c => c.id !== id)))
      .catch(err => console.error('Error al eliminar curso:', err));
  };

  // — Forzar cierre / finalización pisando la fecha con la de hoy —
  const handleForzarFecha = (id, campo) => {
    const token = useAuthStore.getState().token;
    const hoy = new Date().toISOString().split('T')[0];
    axios.patch(`${CURSOS_ENDPOINT}/${id}`, { [campo]: hoy }, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(() => setCursos(prev => prev.map(c => c.id === id ? { ...c, [campo]: hoy } : c)))
      .catch(err => console.error('Error al actualizar fecha:', err));
  };

  const cursosConEstado = cursos.map(c => ({ ...c, estadoCalculado: getEstadoCurso(c) }));
  const cursosFiltrados = filtroEstado === 'Todos'
    ? cursosConEstado
    : cursosConEstado.filter(c => c.estadoCalculado === filtroEstado);

  const totalPages = Math.ceil(cursosFiltrados.length / ITEMS_PER_PAGE) || 1;
  const cursosPagina = cursosFiltrados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFiltroChange = (key) => { setFiltroEstado(key); setCurrentPage(1); setFiltroOpen(false); };

  const totalAbiertos = cursosConEstado.filter(c => c.estadoCalculado === 'Abierto').length;
  const totalCerrados = cursosConEstado.filter(c => c.estadoCalculado === 'Cerrado').length;
  const totalFinalizados = cursosConEstado.filter(c => c.estadoCalculado === 'Finalizado').length;

  return (
    <div
      className="bg-scout-bg-panel text-left relative"
      style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}
    >
      {/* HEADER */}
      <div className="border-b border-scout-border pb-4 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-scout-muted block mb-0.5">
          Panel de Control Privado • Gestión de Cursos
        </span>
        <h1 className="text-xl md:text-2xl font-black text-scout-primary tracking-tight uppercase">
          Cursos
        </h1>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 shrink-0">
        <MetricCard icon={<CalendarCheck />} title="Cursos Abiertos" value={`${totalAbiertos} Activos`} sub="Inscripción disponible" color="border-scout-primary" />
        <MetricCard icon={<CalendarClock />} title="Cursos Cerrados" value={`${totalCerrados} Cerrados`} sub="Inscripción finalizada" color="border-scout-muted" />
        <MetricCard icon={<CalendarOff />} title="Cursos Finalizados" value={`${totalFinalizados} Finalizados`} sub="Ciclo completo" color="border-scout-muted" />
        <Link
          to="/gestion-cursos/crear"
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
            <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">Nuevo Curso</h3>
          </div>
        </Link>
      </div>

      {/* TABLA */}
      <div className="grid grid-cols-1 gap-8 mt-10" style={{ flex: 1, minHeight: 0 }}>
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tight text-scout-primary shrink-0">Cursos Publicados</h2>
            <div className="relative" ref={filtroRef}>
              <button
                onClick={() => setFiltroOpen(prev => !prev)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pl-3.5 pr-3 py-1.5 rounded-xl border border-scout-border bg-scout-bg-panel text-scout-primary cursor-pointer transition-all hover:border-scout-primary"
              >
                {FILTROS_ESTADO.find(f => f.key === filtroEstado)?.label}
                <ChevronDown size={12} className={`text-scout-muted transition-transform duration-200 ${filtroOpen ? 'rotate-180' : ''}`} />
              </button>
              {filtroOpen && (
                <div className="absolute right-0 top-full mt-2 z-20 bg-scout-bg-card border border-scout-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                  {FILTROS_ESTADO.map((filtro) => (
                    <button
                      key={filtro.key}
                      onClick={() => handleFiltroChange(filtro.key)}
                      className={`w-full text-left text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-colors cursor-pointer ${filtroEstado === filtro.key ? 'bg-scout-primary text-white' : 'text-scout-primary hover:bg-scout-bg-panel'}`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-px bg-scout-border shrink-0 mt-5" />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando cursos...</p>
            </div>
          ) : cursosPagina.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-12 h-12 bg-scout-bg-panel border border-scout-border rounded-2xl flex items-center justify-center text-scout-muted"><GraduationCap size={20} /></div>
              <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay cursos con ese estado</p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-6 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                    <th className="pb-3 font-black">Título</th>
                    <th className="pb-3 font-black text-center">Categoría</th>
                    <th className="pb-3 font-black text-center">Ramas</th>
                    <th className="pb-3 font-black text-center">Estado</th>
                    <th className="pb-3 font-black text-center">Cierre Inscr.</th>
                    <th className="pb-3 font-black text-center">Fin Curso</th>
                    <th className="pb-3 font-black text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-scout-border">
                  {cursosPagina.map((curso) => (
                    <tr key={curso.id} className="group hover:bg-scout-bg-panel transition-colors">
                      <td className="py-4 pr-3">
                        <p className="text-xs font-bold text-scout-primary group-hover:text-scout-primary-hover transition-colors">{curso.titulo}</p>
                      </td>
                      <td className="py-4 text-center"><CategoriaBadge categoria={curso.categoria} /></td>
                      <td className="py-4 text-xs text-scout-muted font-medium text-center">
                        {curso.categoria === 'Programa' && curso.ramas?.length > 0 ? curso.ramas.join(', ') : '—'}
                      </td>
                      <td className="py-4 text-center"><EstadoBadge estado={curso.estadoCalculado} /></td>
                      <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{curso.fecha_cierre || '—'}</td>
                      <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{curso.fecha_fin || '—'}</td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {curso.link_formulario && (
                            <a href={curso.link_formulario} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Ver formulario">
                              <ExternalLink size={13} />
                            </a>
                          )}
                          {curso.estadoCalculado === 'Abierto' && (
                            <button onClick={() => handleForzarFecha(curso.id, 'fecha_cierre')} className="p-1.5 rounded-lg border border-scout-border hover:bg-yellow-50 text-scout-muted hover:text-yellow-700 transition-colors cursor-pointer" title="Cerrar inscripción ahora">
                              <Zap size={13} />
                            </button>
                          )}
                          {curso.estadoCalculado === 'Cerrado' && (
                            <button onClick={() => handleForzarFecha(curso.id, 'fecha_fin')} className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Finalizar curso ahora">
                              <Zap size={13} />
                            </button>
                          )}
                          <Link to={`/gestion-cursos/editar/${curso.id}`} className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Editar">
                            <Edit3 size={13} />
                          </Link>
                          <button
                            onClick={() => { if (window.confirm('¿Estás seguro de eliminar este curso?')) handleEliminar(curso.id); }}
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

          {cursosFiltrados.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-end gap-3 pt-5 mt-auto shrink-0 border-t border-scout-border">
              <span className="text-[10px] font-black uppercase tracking-widest text-scout-muted">Pág. {currentPage} / {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft size={14} /></button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 border border-scout-border rounded-lg hover:bg-scout-bg-panel text-scout-primary disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionCursos;

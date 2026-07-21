import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  GraduationCap, CalendarCheck, CalendarClock, CalendarOff,
  ChevronRight, ChevronDown, ChevronLeft, Plus, Edit3, Eye, Trash2,
  ExternalLink, Zap, Unlock, X, Clock
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
  if (curso.fecha_fin && hoy >= curso.fecha_fin) return 'Finalizado';
  if (curso.fecha_cierre && hoy >= curso.fecha_cierre) return 'Cerrado';
  return 'Abierto';
};

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '—';
    const partes = fechaStr.split(/[-/]/); 
    if (partes.length !== 3) return fechaStr;    
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
};

// — Suma N días a una fecha 'YYYY-MM-DD' y devuelve el mismo formato —
const addDays = (fechaStr, dias) => {
  const fecha = new Date(fechaStr);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().split('T')[0];
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
  const [expandedId, setExpandedId] = useState(null);
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

  // — Reabrir: retrasa fecha_cierre 5 días, sin superar fecha_fin —
  const handleReabrir = (id) => {
    const curso = cursos.find((c) => c.id === id);
    if (!curso?.fecha_cierre) return;

    let nuevaFechaCierre = addDays(curso.fecha_cierre, 5);

    if (curso.fecha_fin && nuevaFechaCierre > curso.fecha_fin) {
      nuevaFechaCierre = curso.fecha_fin;
    }

    const token = useAuthStore.getState().token;
    axios.patch(`${CURSOS_ENDPOINT}/${id}`, { fecha_cierre: nuevaFechaCierre }, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(() => setCursos(prev => prev.map(c => c.id === id ? { ...c, fecha_cierre: nuevaFechaCierre } : c)))
      .catch(err => console.error('Error al reabrir curso:', err));
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

  const cursoExpandido = cursosConEstado.find((c) => c.id === expandedId);

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
                      <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{formatearFecha(curso.fecha_cierre) || '—'}</td>
                      <td className="py-4 text-xs text-scout-muted whitespace-nowrap text-center">{formatearFecha(curso.fecha_fin) || '—'}</td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {curso.link_formulario && (
                            <a href={curso.link_formulario} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer" title="Ver formulario">
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <button
                            onClick={() => setExpandedId(curso.id)}
                            className="p-1.5 rounded-lg border border-scout-border hover:bg-scout-bg-panel text-scout-muted hover:text-scout-primary transition-colors cursor-pointer"
                            title="Ver"
                          >
                            <Eye size={13} />
                          </button>
                          {curso.estadoCalculado === 'Abierto' && (
                          <button 
                            onClick={() => handleForzarFecha(curso.id, 'fecha_cierre')} 
                            className="p-1.5 rounded-lg border border-scout-border hover:bg-yellow-50 text-scout-muted hover:text-yellow-700 transition-colors cursor-pointer" 
                            title="Cerrar inscripción ahora"
                          >
                            <Zap size={13} />
                          </button>
                        )}

                        {/* Si el curso está Cerrado: Muestra únicamente reabrir inscripción */}
                        {curso.estadoCalculado === 'Cerrado' && (
                          <button 
                            onClick={() => handleReabrir(curso.id)} 
                            className="p-1.5 rounded-lg border border-scout-border hover:bg-green-50 text-scout-muted hover:text-scout-success transition-colors cursor-pointer" 
                            title="Reabrir inscripción (+5 días)"
                          >
                            <Unlock size={13} />
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

      {/* MODAL VER CURSO */}
      {cursoExpandido && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={() => setExpandedId(null)} />
          <div className="relative bg-scout-bg-card w-full max-w-2xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl p-8 md:p-16 overflow-y-auto animate-in zoom-in-95 duration-300">
            <button onClick={() => setExpandedId(null)} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <CategoriaBadge categoria={cursoExpandido.categoria || 'Sin Información'} />
              <EstadoBadge estado={cursoExpandido.estadoCalculado || 'Sin Información'} />
            </div>

            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-primary text-left">
              {cursoExpandido.titulo || 'Sin Información'}
            </h2>

            {/* Categoría / Ramas / Gestión */}
            <div className="bg-scout-bg-panel rounded-xl p-4 mb-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-scout-muted flex items-center gap-1 mb-1">
                Categoría y Ramas / Gestión
              </span>
              <p className="text-sm font-bold text-scout-primary">
                {cursoExpandido.categoria === 'Programa' && cursoExpandido.ramas?.length > 0
                  ? `Programa — Ramas: ${cursoExpandido.ramas.join(', ')}`
                  : cursoExpandido.categoria || 'Sin Información'}
              </p>
            </div>

            {/* Fechas de Cierre e Inicio/Fin */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-scout-bg-panel rounded-xl p-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-scout-muted flex items-center gap-1 mb-1">
                  <Clock size={11} /> Cierre Inscripción
                </span>
                <p className="text-sm font-bold text-scout-primary">{formatearFecha(cursoExpandido.fecha_cierre) || 'Sin Información'}</p>
              </div>
              <div className="bg-scout-bg-panel rounded-xl p-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-scout-muted flex items-center gap-1 mb-1">
                  <Clock size={11} /> Fin del Curso
                </span>
                <p className="text-sm font-bold text-scout-primary">{formatearFecha(cursoExpandido.fecha_fin) || 'Sin Información'}</p>
              </div>
            </div>

            {/* Detalles Adicionales: Lugar, Modalidad, Costo, Formador */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-scout-bg-panel rounded-xl p-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-scout-muted block mb-1">Lugar</span>
                <p className="text-xs font-bold text-scout-primary">{cursoExpandido.lugar || 'Sin Información'}</p>
              </div>
              <div className="bg-scout-bg-panel rounded-xl p-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-scout-muted block mb-1">Modalidad</span>
                <p className="text-xs font-bold text-scout-primary">{cursoExpandido.modalidad || 'Sin Información'}</p>
              </div>
              <div className="bg-scout-bg-panel rounded-xl p-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-scout-muted block mb-1">Costo</span>
                <p className="text-xs font-bold text-scout-primary">{cursoExpandido.costo || 'Sin Información'}</p>
              </div>
              <div className="bg-scout-bg-panel rounded-xl p-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-scout-muted block mb-1">Formador</span>
                <p className="text-xs font-bold text-scout-primary">{cursoExpandido.formador || 'Sin Información'}</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="text-scout-muted leading-relaxed text-sm md:text-base text-left whitespace-pre-line mb-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-scout-muted block mb-1">Descripción</span>
              {cursoExpandido.descripcion || 'Sin Información'}
            </div>

            {/* Link de Formulario */}
            {cursoExpandido.link_formulario && (
              <a
                href={cursoExpandido.link_formulario}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors"
              >
                Ver formulario de inscripción <ExternalLink size={12} />
              </a>
            )}            
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCursos;
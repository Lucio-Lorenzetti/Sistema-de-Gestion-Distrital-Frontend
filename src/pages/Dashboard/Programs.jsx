import { Search, Plus, FileText, MoreVertical, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';

const Programs = () => {
  const programs = [
    { id: 1, title: 'Campamento de Verano 2026', branch: 'Unidad Scout', author: 'Lucio Lelli', group: 'N.S. Pompeya', date: 'Hace 2 horas', status: 'Enviado' },
    { id: 2, title: 'Planificación Mensual Mayo', branch: 'Manada', author: 'Juan Perez', group: 'San Jorge', date: '12 Abr 2026', status: 'Aprobado' },
    { id: 3, title: 'Actividad de Rama - Nudos', branch: 'Caminantes', author: 'Maria Garcia', group: '19 de Mayo', date: '10 Abr 2026', status: 'Rechazado' },
    { id: 4, title: 'Proyecto Servicio Comunitario', branch: 'Rovers', author: 'Lucio Lelli', group: 'N.S. Pompeya', date: '08 Abr 2026', status: 'Borrador' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Aprobado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rechazado': return 'bg-red-50 text-red-700 border-red-100';
      case 'Enviado': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-950">Programas de Rama</h2>
        <Button className="flex items-center gap-2 w-auto px-5 py-2.5">
          <Plus size={18} /> Subir programa
        </Button>
      </div>

      {/* Filtros exactos como en la imagen */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título o autor..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm text-[14px] focus:outline-none focus:border-black transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-sm text-sm text-gray-600 hover:bg-gray-50">
          Todas las Ramas <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-sm text-sm text-gray-600 hover:bg-gray-50">
          Todos los Estados <ChevronDown size={16} />
        </button>
      </div>

      {/* Tabla Profesional */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Título</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rama</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Autor / Grupo</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Modificado</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 text-gray-400 rounded-sm"><FileText size={18} /></div>
                    <span className="text-sm font-bold text-gray-900">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-600">{p.branch}</td>
                <td className="px-6 py-4">
                  <div className="text-[13px]">
                    <p className="font-bold text-gray-900">{p.author}</p>
                    <p className="text-gray-400 text-[11px]">{p.group}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-500">{p.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-black p-1"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Programs;
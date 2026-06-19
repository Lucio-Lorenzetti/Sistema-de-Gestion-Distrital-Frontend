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
      case 'Rechazado': return 'bg-scout-accent-light text-scout-accent border-scout-accent-light';
      case 'Enviado': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-scout-bg-panel text-scout-muted border-scout-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-scout-primary">Programas de Rama</h2>
        <Button className="flex items-center gap-2 w-auto px-5 py-2.5">
          <Plus size={18} /> Subir programa
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-scout-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            className="w-full pl-10 pr-4 py-2.5 border border-scout-border rounded-sm text-[14px] focus:outline-none focus:border-scout-primary transition-all bg-scout-bg-card text-scout-primary placeholder-scout-muted"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-scout-border rounded-sm text-sm text-scout-muted hover:bg-scout-bg-panel hover:text-scout-primary transition-colors">
          Todas las Ramas <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-scout-border rounded-sm text-sm text-scout-muted hover:bg-scout-bg-panel hover:text-scout-primary transition-colors">
          Todos los Estados <ChevronDown size={16} />
        </button>
      </div>

      <div className="bg-scout-bg-card border border-scout-border rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-scout-bg-panel border-b border-scout-border">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-scout-muted uppercase tracking-wider">Título</th>
              <th className="px-6 py-4 text-[11px] font-bold text-scout-muted uppercase tracking-wider">Rama</th>
              <th className="px-6 py-4 text-[11px] font-bold text-scout-muted uppercase tracking-wider">Autor / Grupo</th>
              <th className="px-6 py-4 text-[11px] font-bold text-scout-muted uppercase tracking-wider">Modificado</th>
              <th className="px-6 py-4 text-[11px] font-bold text-scout-muted uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-scout-border">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-scout-bg-panel transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-scout-bg-panel text-scout-muted rounded-sm"><FileText size={18} /></div>
                    <span className="text-sm font-bold text-scout-primary">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-scout-muted">{p.branch}</td>
                <td className="px-6 py-4">
                  <div className="text-[13px]">
                    <p className="font-bold text-scout-primary">{p.author}</p>
                    <p className="text-scout-muted text-[11px]">{p.group}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-scout-muted">{p.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-scout-muted hover:text-scout-primary p-1 transition-colors"><MoreVertical size={18} /></button>
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

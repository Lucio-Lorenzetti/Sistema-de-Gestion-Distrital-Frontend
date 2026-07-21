
// src/pages/Dashboard/Resumen/DocumentacionResumenCard.jsx
import { Link } from 'react-router-dom';
import { FolderDown, ChevronRight, Clock } from 'lucide-react';
import { useDocumentacion } from '../Panels/Documentacion/useDocumentacion';

const DocumentacionResumenCard = () => {
    const { documentos } = useDocumentacion();
    const ultimos = [...documentos].slice(0, 7);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                    <FolderDown size={16} /> Documentación
                </h2>
                <Link to="/library" className="text-scout-muted hover:text-scout-primary transition-colors">
                    <ChevronRight size={16} />
                </Link>
            </div>
            <div className="h-px bg-scout-border shrink-0 my-4" />

            {ultimos.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">Sin documentos aún</p>
            ) : (
                <div className="space-y-4 flex-1">
                    {ultimos.map((d) => (
                        <div key={d.id} className="space-y-1">
                            <p className="text-xs font-bold text-scout-primary line-clamp-1">{d.nombre}</p>
                            <span className="text-[9px] text-scout-muted flex items-center gap-1"><Clock size={10} /> {d.fecha}</span>
                        </div>
                    ))}
                </div>
            )}

            <Link
                to="/library"
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors flex items-center gap-1"
            >
                Ver todos <ChevronRight size={12} />
            </Link>
        </div>
    );
};

export default DocumentacionResumenCard;
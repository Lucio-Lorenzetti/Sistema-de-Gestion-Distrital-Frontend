// src/pages/Dashboard/panels/noticias/NoticiaExpandModal.jsx
import { X } from 'lucide-react';
import imgDefault from '../../../../assets/noticia-default.jpg';

const NoticiaExpandModal = ({ noticia, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-scout-primary/60 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-scout-bg-card w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-scout-bg-card rounded-full hover:scale-110 transition-transform">
                <X size={20} />
            </button>
            <div className="md:w-1/2 h-64 md:h-auto bg-scout-bg-panel">
                <img src={noticia.imagen || imgDefault} className="w-full h-full object-cover" alt={noticia.titulo} />
            </div>
            <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-scout-muted block mb-4 text-left">
                    {noticia.categoria || 'General'} • {noticia.fecha}
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-primary text-left">
                    {noticia.titulo}
                </h2>
                {noticia.copete && (
                    <p className="text-lg font-bold text-scout-primary border-l-4 border-scout-primary pl-4 mb-6 leading-snug text-left">
                        {noticia.copete}
                    </p>
                )}
                <div className="text-scout-muted leading-relaxed text-sm md:text-base text-left whitespace-pre-line">
                    {noticia.contenido}
                </div>
            </div>
        </div>
    </div>
);

export default NoticiaExpandModal;
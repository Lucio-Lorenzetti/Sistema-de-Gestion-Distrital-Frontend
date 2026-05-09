import React from 'react';
import { ArrowLeft, Camera, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALBUMES = [
    { id: 1, titulo: "Campamento Distrital 2025", fotos: 45, link: "https://photos.google.com/..." },
    { id: 2, titulo: "Foro de Jóvenes", fotos: 12, link: "https://photos.google.com/..." },
    { id: 3, titulo: "Celebración San Jorge", fotos: 30, link: "https://photos.google.com/..." },
];

const Galeria = () => {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans pb-20">
            <header className="bg-white border-b border-neutral-200 py-12 px-6 md:px-20">
                <div className="max-w-5xl mx-auto w-full">
                    <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2"><ArrowLeft size={12} /> Inicio</Link>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Galería de <span className="text-black/20 italic">Eventos</span></h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ALBUMES.map(album => (
                        <a key={album.id} href={album.link} target="_blank" className="group bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="h-64 bg-neutral-900 flex items-center justify-center text-white relative">
                                <Camera size={40} className="group-hover:scale-125 transition-transform duration-500 opacity-20" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                                <span className="absolute top-6 right-6 bg-white text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{album.fotos} FOTOS</span>
                            </div>
                            <div className="p-8 flex justify-between items-center">
                                <h2 className="font-bold uppercase tracking-tight text-sm">{album.titulo}</h2>
                                <ExternalLink size={16} className="text-neutral-300" />
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Galeria;
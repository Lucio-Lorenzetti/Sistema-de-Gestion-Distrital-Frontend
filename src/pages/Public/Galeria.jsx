import React from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALBUMES = [
    { id: 1, titulo: "Campamento Distrital 2025", fotos: 45, link: "https://photos.google.com/..." },
    { id: 2, titulo: "Foro de Jóvenes", fotos: 12, link: "https://photos.google.com/..." },
    { id: 3, titulo: "Celebración San Jorge", fotos: 30, link: "https://photos.google.com/..." },
];

const Galeria = () => {
    return (
        <div className="min-h-screen bg-scout-bg-panel font-sans pb-20">
            <header className="bg-scout-bg-card border-b border-scout-border py-12 px-6 md:px-20">
                <div className="max-w-5xl mx-auto w-full">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-scout-primary">
                        Galería de <span className="text-scout-primary/20 italic">Eventos</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ALBUMES.map(album => (
                        <a key={album.id} href={album.link} target="_blank" rel="noopener noreferrer"
                            className="group bg-scout-bg-card rounded-[2rem] overflow-hidden border border-scout-border shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="h-64 bg-scout-primary flex items-center justify-center text-scout-bg-card relative">
                                <Camera size={40} className="group-hover:scale-125 transition-transform duration-500 opacity-20" />
                                <div className="absolute inset-0 bg-scout-primary/40 group-hover:bg-transparent transition-all" />
                                <span className="absolute top-6 right-6 bg-scout-bg-card text-scout-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {album.fotos} FOTOS
                                </span>
                            </div>
                            <div className="p-8 flex justify-between items-center">
                                <h2 className="font-bold uppercase tracking-tight text-sm text-scout-primary">{album.titulo}</h2>
                                <ExternalLink size={16} className="text-scout-muted" />
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Galeria;

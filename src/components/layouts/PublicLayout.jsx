import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-scout-bg-card">

      {/* NAVBAR */}
      <nav className="border-b border-scout-primary bg-scout-bg-card/80 backdrop-blur-md sticky top-0 z-50 h-18 w-full px-6 md:px-20">
        <div className="w-full h-full flex items-center justify-between">

          {/* IDENTIDAD */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-scout-primary rounded-sm flex items-center justify-center text-scout-bg-card font-bold text-sm transition-transform group-hover:scale-105">
              D3
            </div>
            <div className="leading-tight text-left">
              <span className="block font-bold text-scout-primary tracking-tight text-[15px]">Distrito 3</span>
              <span className="block text-[11px] text-scout-primary font-medium uppercase tracking-wider">Bahía Blanca</span>
            </div>
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-black text-scout-primary uppercase tracking-widest">
            <Link to="/" className="hover:underline decoration-2 underline-offset-8">Inicio</Link>
            <Link to="/distrito" className="hover:underline decoration-2 underline-offset-8">Distrito</Link>
            <Link to="/noticias" className="hover:underline decoration-2 underline-offset-8">Noticias</Link>
            <Link to="/cursos" className="hover:underline decoration-2 underline-offset-8">Cursos</Link>
            <Link to="/galeria" className="hover:underline decoration-2 underline-offset-8">Galería</Link>
            <Link to="/descargas" className="hover:underline decoration-2 underline-offset-8">Descargas</Link>
            <Link
              to="/login"
              className="px-6 py-2 bg-scout-primary text-scout-bg-card text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-scout-primary-hover transition-all shadow-lg ml-2"
            >
              Ingresar
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-scout-primary hover:bg-scout-bg-panel rounded-md transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </nav>

      {/* MENÚ MOBILE */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-18 bottom-0 bg-scout-bg-card/95 backdrop-blur-md z-40 flex flex-col p-8 animate-in fade-in slide-in-from-top duration-300 lg:hidden border-t border-scout-border">
          <div className="flex flex-col gap-5 text-xs font-black text-scout-primary uppercase tracking-widest pt-4 text-center items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Inicio</Link>
            <Link to="/distrito" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Distrito</Link>
            <Link to="/noticias" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Noticias</Link>
            <Link to="/cursos" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Cursos</Link>
            <Link to="/galeria" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Galería</Link>
            <Link to="/descargas" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-scout-border w-full hover:text-scout-muted transition-colors">Descargas</Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 w-full py-4 bg-scout-primary text-scout-bg-card text-center text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-scout-primary-hover transition-all shadow-lg"
            >
              Ingresar
            </Link>
          </div>
        </div>
      )}

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-scout-primary text-scout-bg-card pt-20 pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">

            {/* Columna 1: Identidad */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-scout-bg-card rounded-sm flex items-center justify-center text-scout-primary font-black text-sm">
                  D3
                </div>
                <div className="leading-tight text-left">
                  <span className="block font-bold text-scout-bg-card tracking-tight text-[17px]">Distrito 3</span>
                  <span className="block text-[11px] text-scout-bg-card opacity-50 font-medium uppercase tracking-wider">Zona 13 • Scouts de Argentina</span>
                </div>
              </div>
              <p className="text-[14px] text-scout-bg-card opacity-40 leading-relaxed max-w-xs">
                Sistema centralizado para la gestión administrativa, institucional y de programas educativos.
              </p>
            </div>

            {/* Columna 2: Enlaces Públicos */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-scout-bg-card border-b border-scout-bg-card/10 pb-2 inline-block">
                Portal Público
              </h4>
              <ul className="grid grid-cols-2 gap-4 text-[13px] font-medium">
                <li><Link to="/" className="opacity-50 hover:opacity-100 transition-opacity">Inicio</Link></li>
                <li><Link to="/distrito" className="opacity-50 hover:opacity-100 transition-opacity">El Distrito</Link></li>
                <li><Link to="/noticias" className="opacity-50 hover:opacity-100 transition-opacity">Noticias</Link></li>
                <li><Link to="/cursos" className="opacity-50 hover:opacity-100 transition-opacity">Cursos</Link></li>
                <li><Link to="/galeria" className="opacity-50 hover:opacity-100 transition-opacity">Galería</Link></li>
                <li><Link to="/descargas" className="opacity-50 hover:opacity-100 transition-opacity">Descargas</Link></li>
              </ul>
            </div>

            {/* Columna 3: Ingeniería */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-scout-bg-card border-b border-scout-bg-card/10 pb-2 inline-block">
                Desarrollo
              </h4>
              <div className="space-y-1">
                <p className="text-[16px] font-bold tracking-tight">Lucio Lorenzetti</p>
                <p className="text-[12px] italic opacity-50 uppercase tracking-widest font-bold">Ingeniero en Sistemas</p>
              </div>
              <div className="pt-2">
                <a
                  href="mailto:lorenzettilucioadriel@gmail.com"
                  className="text-[13px] text-scout-bg-card border-b border-scout-bg-card/20 pb-0.5 hover:border-scout-bg-card transition-colors"
                >
                  lorenzettilucioadriel@gmail.com
                </a>
              </div>
            </div>

          </div>

          {/* Barra Inferior */}
          <div className="border-t border-scout-bg-card/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">
              © {new Date().getFullYear()} Sistema de Gestión Distrital
            </p>
            <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
              Bahía Blanca • Buenos Aires • Argentina
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

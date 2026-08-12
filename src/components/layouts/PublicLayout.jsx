import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../ui/SocialIcons';
import logoDistritoHorizontal from '../../assets/logo_distrito_horizontal.svg';
import logosCombinados from '../../assets/logos_combinados.png';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-scout-bg-card">

      {/* NAVBAR */}
      <nav className="border-b border-scout-primary bg-scout-bg-card/80 backdrop-blur-md sticky top-0 z-50 h-18 w-full px-6 md:px-20">
        <div className="w-full h-full flex items-center justify-between">

          {/* IDENTIDAD */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <img
              src={logoDistritoHorizontal}
              alt="Distrito 3 - Zona 13 - Scouts de Argentina"
              className="h-10 md:h-12 transition-transform group-hover:scale-105"
            />
            <img
              src={logosCombinados}
              alt="Scouts de Argentina - 30 años"
              className="hidden md:block h-8"
            />
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
      <footer className="bg-scout-ink text-scout-bg-card pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-14">

            {/* Columna 1: Identidad */}
            <div className="space-y-5">
              <img
                src={logoDistritoHorizontal}
                alt="Distrito 3 - Zona 13 - Scouts de Argentina"
                className="h-14"
              />
              <p className="text-[13px] text-scout-bg-card opacity-60 leading-relaxed max-w-xs">
                Sistema centralizado para la gestión administrativa, institucional y de programas educativos.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a href="https://www.facebook.com/Distrito3Zona13?locale=es_LA" aria-label="Facebook" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">
                  <FacebookIcon size={17} />
                </a>
                <a href="https://www.instagram.com/distrito3z13.saac/" aria-label="Instagram" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">
                  <InstagramIcon size={17} />
                </a>
                <a href="mailto:distrito3z13sa@gmail.com" aria-label="Email" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">
                  <Mail size={17} />
                </a>
              </div>
            </div>

            {/* Columna 2: Enlaces (grupo A) */}
            <ul className="space-y-3 text-[12px] font-bold uppercase tracking-wide">
              <li><Link to="/" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">Inicio</Link></li>
              <li><Link to="/distrito" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">El Distrito</Link></li>
              <li><Link to="/noticias" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">Noticias</Link></li>
            </ul>

            {/* Columna 3: Enlaces (grupo B) */}
            <ul className="space-y-3 text-[12px] font-bold uppercase tracking-wide">
              <li><Link to="/cursos" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">Cursos</Link></li>
              <li><Link to="/galeria" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">Galería</Link></li>
              <li><Link to="/descargas" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">Descargas</Link></li>
            </ul>

            {/* Columna 4: Ingeniería */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-scout-bg-card border-b-2 border-scout-primary pb-2 inline-block">
                Desarrollo
              </h4>
              <div className="space-y-1">
                <p className="text-[15px] font-bold tracking-tight">Lucio Lorenzetti</p>
                <p className="text-[11px] italic opacity-60 uppercase tracking-widest font-bold">Ingeniero en Sistemas</p>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <a href="mailto:lorenzettilucioadriel@gmail.com" aria-label="Email" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">
                  <Mail size={17} />
                </a>
                <a href="www.linkedin.com/in/lucio-lorenzetti" aria-label="LinkedIn" className="opacity-70 hover:opacity-100 hover:text-scout-primary transition-colors">
                  <LinkedinIcon size={17} />
                </a>
              </div>
            </div>

          </div>

          {/* Divisor */}
          <div className="h-px bg-scout-primary mb-6" />

          {/* Barra Inferior */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.15em] opacity-70">
              © {new Date().getFullYear()} Distrito 3 - Zona 13 - Scout de Argentina
            </p>
            <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
              Bahía Blanca • Buenos Aires • Argentina
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

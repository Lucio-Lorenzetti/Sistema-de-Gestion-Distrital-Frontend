// src/components/layouts/PublicLayout.jsx
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* NAVBAR: Efecto cristal con textos en negro puro */} {/*border-b border-black bg-white/40 backdrop-blur-md*/}
      <nav className="border-b border-black bg-white/40 backdrop-blur-md sticky top-0 z-50 h-18">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo Distrito */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-black rounded-sm flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              D3
            </div>
            <div className="leading-tight text-left">
              <span className="block font-bold text-black tracking-tight text-[15px]">Distrito 3</span>
              <span className="block text-[11px] text-black font-medium uppercase tracking-wider">Bahía Blanca</span>
            </div>
          </Link>

          {/* Menú de Navegación */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-[13px] font-bold text-black uppercase tracking-wide">
              <Link to="/" className="hover:underline decoration-2 underline-offset-4">Inicio</Link>
              <Link to="/noticias" className="hover:underline decoration-2 underline-offset-4">Noticias</Link>
              <Link to="/descargas" className="hover:underline decoration-2 underline-offset-4">Descargas</Link>
            </div>
            
            <Link 
              to="/login" 
              className="px-5 py-2 bg-black text-white text-[13px] font-bold rounded-sm hover:bg-neutral-800 transition-all shadow-sm"
            >
              Ingresar
            </Link>
          </div>

        </div>
      </nav>

      {/* CONTENIDO DINÁMICO (Home, etc.) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* FOOTER: Fondo negro total con estructura de 3 columnas */}
      <footer className="bg-black z-1 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Grid de Columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            
            {/* Columna 1: Identidad */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {/* Logo Invertido para el Footer */}
                <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-black font-black text-sm">
                  D3
                </div>
                <div className="leading-tight text-left">
                  <span className="block font-bold text-white tracking-tight text-[17px]">Distrito 3</span>
                  <span className="block text-[11px] text-white opacity-50 font-medium uppercase tracking-wider">Zona 13 • Scouts de Argentina</span>
                </div>
              </div>
              <p className="text-[14px] text-white opacity-40 leading-relaxed max-w-xs">
                Sistema centralizado para la gestión administrativa, institucional y de programas educativos. 
              </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b border-white/10 pb-2 inline-block">
                Navegación
              </h4>
              <ul className="space-y-4 text-[14px] font-medium">
                <li><Link to="/" className="hover:opacity-100 opacity-50 transition-opacity">Inicio del Sitio</Link></li>
                <li><Link to="/noticias" className="hover:opacity-100 opacity-50 transition-opacity">Noticias y Circulares</Link></li>
                <li><Link to="/descargas" className="hover:opacity-100 opacity-50 transition-opacity">Documentación Oficial</Link></li>
                <li><Link to="/login" className="hover:opacity-100 opacity-50 transition-opacity font-bold text-white/80">Acceso Privado</Link></li>
              </ul>
            </div>

            {/* Columna 3: Firma Técnica (Ingeniero) */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b border-white/10 pb-2 inline-block">
                Desarrollo
              </h4>
              <div className="space-y-1">
                <p className="text-[16px] font-bold">Lucio Lorenzetti</p>
                <p className="text-[13px] italic opacity-50">Ingeniero en Sistemas de Información</p>
              </div>
              <div className="pt-2 space-y-3">
                <p className="text-[13px] font-medium opacity-70">Arquitectura y Desarrollo de Software</p>
                <a 
                  href="mailto:lorenzettilucioadriel@gmail.com" 
                  className="text-[13px] text-white border-b border-white/20 pb-0.5 hover:border-white transition-colors"
                >
                  lorenzettilucioadriel@gmail.com
                </a>
              </div>
            </div>

          </div>

          {/* Barra Inferior de Copyright */}
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">
                © {new Date().getFullYear()} Sistema de Gestión Distrital
              </p>
            </div>
            
            <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center md:text-right">
              Bahía Blanca • Buenos Aires • Argentina
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
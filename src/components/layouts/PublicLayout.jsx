import { Outlet, Link } from 'react-router-dom';
import { Mail, Linkedin, Github } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navbar Institucional */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-black rounded-sm flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              D3
            </div>
            <div className="leading-tight text-left">
              <span className="block font-bold text-gray-950 tracking-tight text-[15px]">Distrito 3</span>
              <span className="block text-[11px] text-gray-400 font-medium uppercase tracking-wider">Bahía Blanca</span>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors">Inicio</Link>
              <Link to="/noticias" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors">Noticias</Link>
              <Link to="/descargas" className="text-[13px] font-semibold text-gray-600 hover:text-black transition-colors">Descargas</Link>
            </div>
            <Link to="/login" className="px-5 py-2 bg-black text-white text-[13px] font-bold rounded-sm hover:bg-neutral-800 transition-all shadow-sm">
              Ingresar
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Personalizado y Centrado */}
      <footer className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-6">
            Scouts de Argentina • Distrito 3 • Bahía Blanca
          </p>
          
          <div className="mb-8">
            <p className="text-[15px] text-gray-900 font-bold">
              Lucio Lorenzetti
            </p>
            <p className="text-[13px] text-gray-500 italic mb-4">
              Ingeniero en Sistemas de Información
            </p>
            
            {/* Redes y Contacto */}
            <div className="flex items-center justify-center gap-5">
              <a href="mailto:tu-email@ejemplo.com" className="text-gray-400 hover:text-black transition-colors" title="Email">
                <Mail size={18} />
              </a>
              <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/tu-usuario" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors" title="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 w-16 mb-6"></div>

          <p className="text-[12px] text-gray-400 leading-relaxed">
            © {new Date().getFullYear()} Sistema de Gestión Distrital. <br className="sm:hidden" />
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
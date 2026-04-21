import { ArrowRight, Download, Megaphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import bgImage from '../../assets/f-bienvenida.jpg';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Imagen de Fondo con Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgImage})`, // Asegúrate de poner la imagen en tu carpeta public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)'
        }}
      />

      <div className="relative z-10 animate-in fade-in duration-700">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-950 mb-8 tracking-tighter leading-[1.1]">
            Gestión inteligente para el <br /> 
            <span className="text-gray-300 italic font-medium">movimiento scout.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Plataforma centralizada para educadores y autoridades del Distrito 3. 
            Simplificamos la administración para que el foco esté donde debe: en los jóvenes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-black text-white rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all group shadow-lg"
            >
              Comenzar gestión <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/descargas"
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-sm font-bold hover:bg-gray-50 transition-all text-center bg-white/50 backdrop-blur-sm"
            >
              Ver descargas públicas
            </Link>
          </div>
        </section>

        {/* Sección de Características */}
        <section className="bg-white/60 backdrop-blur-sm py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-white rounded-sm border border-gray-100 flex items-center justify-center shadow-sm text-gray-900 group-hover:border-black transition-colors">
                <Megaphone size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Noticias y Novedades</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Mantenete al día con los eventos distritales, cursos de formación y asambleas institucionales.</p>
            </div>
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-white rounded-sm border border-gray-100 flex items-center justify-center shadow-sm text-gray-900 group-hover:border-black transition-colors">
                <Download size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Repositorio Oficial</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Acceso directo a fichas médicas, reglamentos y documentos oficiales abiertos a toda la comunidad.</p>
            </div>
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-white rounded-sm border border-gray-100 flex items-center justify-center shadow-sm text-gray-900 group-hover:border-black transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Acceso Seguro</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Gestión protegida de programas de rama exclusivamente para educadores acreditados.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
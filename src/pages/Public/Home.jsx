import { ArrowRight, Download, Megaphone, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import bgImage from '../../assets/f-bienvenida.jpg'; 

const TechDivider = ({ light }) => (
  <div className="flex items-center justify-center gap-4 my-10">
    <div className={`h-[1px] w-12 ${light ? 'bg-white/20' : 'bg-black/10'}`} />
    <div className={`w-1 h-1 rotate-45 ${light ? 'bg-white' : 'bg-black'}`} />
    <div className={`h-[1px] w-12 ${light ? 'bg-white/20' : 'bg-black/10'}`} />
  </div>
);

const Home = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.9] pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
          position: 'fixed'
        }}
      />

      <div className="relative z-10 animate-in fade-in duration-1000 slide-in-from-bottom-2">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-950 mb-8 tracking-tighter leading-[1.1]">
            SISTEMA DE GESTIÓN <br /> 
            <span className="text-gray-300 italic font-medium">DISTRITO 3.</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Plataforma centralizada para educadores y autoridades del Distrito 3. 
            Simplificamos la administración para que el foco esté donde debe: en los jóvenes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="px-10 py-4 bg-black text-white rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all group shadow-xl"
            >
              Comenzar gestión <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/descargas"
              className="px-10 py-4 border border-gray-200 text-gray-700 rounded-sm font-bold hover:bg-gray-50 transition-all text-center bg-white/50 backdrop-blur-sm"
            >
              Ver descargas públicas
            </Link>
          </div>
        </section>

        {/* Sección de Características */}
        <section className="bg-white/40 backdrop-blur-md py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-left">
            <div className="space-y-5">
              <Megaphone size={28} className="text-gray-950" />
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Noticias y Novedades</h3>
              <p className="text-[14px] text-black leading-relaxed">Mantenete al día con los eventos distritales, cursos de formación y asambleas institucionales.</p>
            </div>
            <div className="space-y-5">
              <Download size={28} className="text-gray-950" />
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Repositorio Oficial</h3>
              <p className="text-[14px] text-black leading-relaxed">Acceso directo a fichas médicas, reglamentos y documentos oficiales abiertos a la comunidad.</p>
            </div>
            <div className="space-y-5">
              <Shield size={28} className="text-gray-950" />
              <h3 className="text-lg font-bold text-gray-950 tracking-tight">Acceso Seguro</h3>
              <p className="text-[14px] text-black leading-relaxed">Gestión protegida de programas de rama y legajos educativos exclusivamente para educadores.</p>
            </div>
          </div>
        </section><div className="h-40" />
        {/* 3. SECCIÓN: NUESTROS GRUPOS 
        <section className="bg-white py-32 text-black">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-16">
              Grupos Scout del Distrito
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { nro: '1', nombre: 'Pompeya', barrio: 'B° Pompeya' },
                { nro: '12', nombre: 'Don Bosco', barrio: 'B° Don Bosco' },
                { nro: '48', nombre: 'San Jorge', barrio: 'Centro' },
                { nro: '154', nombre: 'N.S. de la Paz', barrio: 'B° Universitario' }
              ].map((grupo) => (
                <div key={grupo.nro} className="border-2 border-black p-8 group hover:bg-black hover:text-white transition-all cursor-default">
                  <span className="block text-5xl font-black mb-4">#{grupo.nro}</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight">{grupo.nombre}</h3>
                  <p className="text-sm font-medium mt-2">{grupo.barrio}</p>
                </div>
              ))}
            </div>

            <div className="mt-20">
              <button className="border-b-2 border-black font-bold uppercase text-sm hover:pb-2 transition-all">
                  Ver mapa interactivo de ubicaciones
              </button>
            </div>
          </div>
        </section>*/}
        <div className="h-40" /> 
        {/* 3. SECCIÓN: ÚLTIMAS CIRCULARES (FEED MINIMALISTA) */}
        <section className="bg-white/40 backdrop-blur-md py-24 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-12 border-l-4 border-white pl-4">
              Comunicación Oficial
            </h2>
            
            <div className="space-y-8">
              {[
                { fecha: '20 ABR', titulo: 'Apertura de inscripciones para cursos de formación Zona 22' },
                { fecha: '15 ABR', titulo: 'Convocatoria a Asamblea Distrital Ordinaria 2026' },
                { fecha: '10 ABR', titulo: 'Actualización obligatoria de fichas médicas en el sistema' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 items-start group cursor-pointer">
                  <span className="text-sm font-black tracking-tighter pt-1">{item.fecha}</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight group-hover:underline decoration-2 underline-offset-4 leading-tight">
                    {item.titulo}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/20">
              <Link to="/noticias" className="text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-all">
                Ver todas las noticias →
              </Link>
            </div>
          </div>
        </section>
        <div className="h-40" />

        {/* 4. SECCIÓN: EL DISTRITO EN NÚMEROS
        <section className="bg-white py-32 text-black border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              <div>
                <span className="block text-7xl font-black tracking-tighter italic">12</span>
                <span className="block text-sm font-bold uppercase mt-2 tracking-widest">Grupos Scout</span>
              </div>
              <div>
                <span className="block text-7xl font-black tracking-tighter italic">+500</span>
                <span className="block text-sm font-bold uppercase mt-2 tracking-widest">Educadores</span>
              </div>
              <div>
                <span className="block text-7xl font-black tracking-tighter italic">1.5k</span>
                <span className="block text-sm font-bold uppercase mt-2 tracking-widest">Jóvenes</span>
              </div>
              <div>
                <span className="block text-7xl font-black tracking-tighter italic">2026</span>
                <span className="block text-sm font-bold uppercase mt-2 tracking-widest">Gestión Digital</span>
              </div>
            </div>
          </div>
        </section>*/}

      </div>
    </div>
  );
};

export default Home;
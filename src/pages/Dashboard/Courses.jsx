import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

const Courses = () => {
  const courses = [
    { id: 1, title: 'Inducción al Movimiento Scout', category: 'Formación Inicial', progress: 100, status: 'Completado' },
    { id: 2, title: 'Gestión de Equipos de Rama', category: 'Nivel 1', progress: 45, status: 'En curso' },
    { id: 3, title: 'Seguridad en Actividades al Aire Libre', category: 'Taller Técnico', progress: 0, status: 'Pendiente' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-950">Cursos de Formación</h2>
        <p className="text-sm text-gray-500 mt-1">Hacé seguimiento de tu trayectoria académica en el distrito.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-neutral-900 text-white rounded-sm group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              {course.progress === 100 && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
            
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.category}</span>
            <h3 className="text-[15px] font-bold text-gray-900 mt-1 mb-4 leading-snug">{course.title}</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-[12px] font-medium">
                <span className="text-gray-500">Progreso</span>
                <span className="text-gray-900">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-black'}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-gray-200 text-[13px] font-bold text-gray-700 rounded-sm hover:bg-gray-50 transition-colors">
              {course.progress === 100 ? 'Revisar contenido' : 'Continuar curso'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
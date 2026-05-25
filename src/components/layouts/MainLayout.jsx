import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; // 🛠️ MODIFICACIÓN 1: Importamos el store global
import Sidebar from './Sidebar';

const MainLayout = () => {
  // 🛠️ MODIFICACIÓN 2: Extraemos el objeto user de Zustand
  const { user } = useAuthStore();

  // Obtenemos el nombre real o usamos uno por defecto de respaldo
  const userName = user?.name || 'Usuario Distrital';
  
  // Lógica para separar el nombre y extraer las iniciales dinámicamente
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Mapeamos los roles reales que cargó Laravel para concatenarlos con barras
  const formatRoleDisplay = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles.map(r => r.nombre).join(' / ');
    }
    return 'Educador';
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 ml-64"> {/* ml-64 es el ancho de la sidebar */}
        {/* Navbar Superior Simple */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            
            {/* 🛠️ SECCIÓN CORREGIDA: Datos dinámicos vinculados a Zustand */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">
                {userName}
              </p>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-1">
                {formatRoleDisplay()}
              </p>
            </div>

            {/* 🛠️ SECCIÓN CORREGIDA: Avatar dinámico con fondo oscuro institucional e iniciales reales */}
            <div className="w-9 h-9 bg-neutral-900 text-white rounded-full border border-neutral-800 flex items-center justify-center font-black text-xs shadow-sm">
              {userInitials}
            </div>

          </div>
        </header>

        {/* Contenedor de Páginas */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
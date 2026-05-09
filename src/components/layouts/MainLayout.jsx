import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      
      <div className="flex-1 ml-64"> {/* ml-64 es el ancho de la sidebar */}
        {/* Navbar Superior Simple */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">Lucio Lorenzetti</p>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-1">Educador</p>
            </div>
            <div className="w-9 h-9 bg-gray-200 rounded-full border border-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
              LL
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
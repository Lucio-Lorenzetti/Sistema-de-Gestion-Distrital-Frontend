import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, GraduationCap, Megaphone, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Documentos', path: '/documentos', icon: <FileText size={20} /> },
    { name: 'Cursos', path: '/cursos', icon: <GraduationCap size={20} /> },
    { name: 'Noticias', path: '/noticias-internas', icon: <Megaphone size={20} /> },
    { name: 'Usuarios', path: '/usuarios', icon: <Users size={20} /> },
    { name: 'Sistema', path: '/sistema', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full">
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          Distrito 3 <span className="text-gray-400 font-medium block text-xs italic">Bahía Blanca</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-sm transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
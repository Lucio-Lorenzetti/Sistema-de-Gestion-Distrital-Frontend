import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, FolderArchive, GraduationCap, Megaphone, Users, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar la sesión institucional:", error);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Programas', path: '/gestion-documentos', icon: <FileText size={20} /> },
    { name: 'Noticias', path: '/noticias-internas', icon: <Megaphone size={20} /> },
    { name: 'Cursos', path: '/gestion-cursos/administrar', icon: <GraduationCap size={20} /> },    
    { name: 'Biblioteca', path: '/library', icon: <FolderArchive size={20} /> },
    { name: 'Usuarios', path: '/usuarios', icon: <Users size={20} /> },
    { name: 'Sistema', path: '/configuracion', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-scout-bg-card border-r border-scout-border flex flex-col fixed h-full">
      <div className="p-6">
        <h1 className="text-lg font-bold text-scout-primary tracking-tight">
          Distrito 3 <span className="text-scout-muted font-medium block text-xs italic">Bahía Blanca</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${isActive
                ? 'bg-scout-bg-panel text-scout-primary'
                : 'text-scout-muted hover:bg-scout-bg-panel hover:text-scout-primary'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-scout-border">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 w-full text-sm font-medium text-scout-accent hover:bg-scout-accent-light rounded-sm transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

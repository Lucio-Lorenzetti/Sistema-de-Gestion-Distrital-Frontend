import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, FolderArchive, GraduationCap, Megaphone, Users, UserCircle, HelpCircle, Settings, Rocket, Lightbulb, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_VERSION } from '../../version';

// Gestión de usuarios es cosa de quien administra personas, no de cualquiera —
// mismo criterio que UserPolicy::viewAny() en el backend (más Developer, que
// bypassea todo igual, pero se lista acá para que el ítem aparezca en el nav).
const ROLES_CON_GESTION_USUARIOS = ['director', 'jefe de grupo', 'developer'];

const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar la sesión institucional:", error);
    }
  };

  const roleNames = (user?.roles ?? []).map((r) => r.nombre.toLowerCase());
  const puedeGestionarUsuarios = roleNames.some((r) => ROLES_CON_GESTION_USUARIOS.includes(r));
  const esDeveloper = roleNames.includes('developer');
  const esDirector = roleNames.includes('director');

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Programas', path: '/gestion-programas', icon: <FileText size={20} /> },
    { name: 'Noticias', path: '/noticias-internas', icon: <Megaphone size={20} /> },
    { name: 'Cursos', path: '/gestion-cursos/administrar', icon: <GraduationCap size={20} /> },
    { name: 'Biblioteca', path: '/library', icon: <FolderArchive size={20} /> },
    ...(puedeGestionarUsuarios ? [{ name: 'Usuarios', path: '/usuarios', icon: <Users size={20} /> }] : []),
    { name: 'Mi Perfil', path: '/mi-perfil', icon: <UserCircle size={20} /> },
    { name: 'Ayuda', path: '/ayuda', icon: <HelpCircle size={20} /> },
    // Director propone mejoras, Developer las triagea — dos pantallas
    // separadas para el mismo recurso (FeatureRequestController).
    ...(esDirector ? [{ name: 'Peticiones de Mejora', path: '/peticiones-mejora', icon: <Lightbulb size={20} /> }] : []),
    // Edición de metadata de roles — solo Developer, mismo criterio que RolePolicy::update().
    ...(esDeveloper ? [{ name: 'Sistema', path: '/configuracion', icon: <Settings size={20} /> }] : []),
    ...(esDeveloper ? [{ name: 'Actualizaciones', path: '/actualizaciones', icon: <Rocket size={20} /> }] : []),
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
        <p className="text-left text-[10px] font-bold text-scout-muted uppercase tracking-widest mb-2">
          Versión: v{APP_VERSION}
        </p>
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

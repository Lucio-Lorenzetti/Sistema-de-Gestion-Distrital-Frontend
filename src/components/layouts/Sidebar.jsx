import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, Home, LayoutDashboard, FileText, FolderArchive, GraduationCap, Megaphone, Users, UserCircle, HelpCircle, Settings, Rocket, Lightbulb, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_VERSION } from '../../version';
import { getPermisos } from '../../utils/permisos';

const Sidebar = ({ abierto = false, onCerrar = () => {} }) => {
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

  // Mismo criterio que las guardas de App.jsx (RequierePermiso) y las Policies
  // del backend. Cursos/Noticias/Biblioteca no se ocultan: quien no las gestiona
  // va directo a la versión pública, sin cerrar sesión.
  const permisos = getPermisos(user);

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    ...(permisos.verProgramas ? [{ name: 'Programas', path: '/gestion-programas', icon: <FileText size={20} /> }] : []),
    { name: 'Noticias', path: permisos.gestionarComunicacion ? '/noticias-internas' : '/noticias', icon: <Megaphone size={20} /> },
    { name: 'Cursos', path: permisos.gestionarComunicacion ? '/gestion-cursos/administrar' : '/cursos', icon: <GraduationCap size={20} /> },
    { name: 'Biblioteca', path: permisos.gestionarComunicacion ? '/library' : '/descargas', icon: <FolderArchive size={20} /> },
    ...(permisos.gestionarUsuarios ? [{ name: 'Usuarios', path: '/usuarios', icon: <Users size={20} /> }] : []),
    { name: 'Mi Perfil', path: '/mi-perfil', icon: <UserCircle size={20} /> },
    { name: 'Ayuda', path: '/ayuda', icon: <HelpCircle size={20} /> },
    // Director propone mejoras, Developer las triagea — dos pantallas
    // separadas para el mismo recurso (FeatureRequestController).
    ...(permisos.esDirector ? [{ name: 'Peticiones de Mejora', path: '/peticiones-mejora', icon: <Lightbulb size={20} /> }] : []),
    // Edición de metadata de roles — solo Developer, mismo criterio que RolePolicy::update().
    ...(permisos.sistema ? [{ name: 'Sistema', path: '/configuracion', icon: <Settings size={20} /> }] : []),
    ...(permisos.sistema ? [{ name: 'Actualizaciones', path: '/actualizaciones', icon: <Rocket size={20} /> }] : []),
  ];

  return (
    <>
      {/* Fondo oscuro del drawer (solo mobile) */}
      <div
        onClick={onCerrar}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-scout-scrim/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          abierto ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`w-64 max-w-[85vw] bg-scout-bg-card border-r border-scout-border flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-out lg:translate-x-0 ${
          abierto ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
      <div className="p-6 flex items-start justify-between shrink-0">
        <h1 className="text-lg font-bold text-scout-primary tracking-tight">
          Distrito 3 <span className="text-scout-muted font-medium block text-xs italic">Bahía Blanca</span>
        </h1>
        <button
          type="button"
          onClick={onCerrar}
          className="lg:hidden p-1.5 -mr-2 -mt-1 rounded-lg text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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

      <div className="p-4 border-t border-scout-border shrink-0">
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
    </>
  );
};

export default Sidebar;

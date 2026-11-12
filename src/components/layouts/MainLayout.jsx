import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import NotificacionesBell from '../ui/NotificacionesBell';
import { rolesVisibles } from '../../pages/Dashboard/Panels/Usuarios/rolDisplay';

const MainLayout = () => {
  const { user } = useAuthStore();
  // En mobile el sidebar es un drawer que se abre con el botón de hamburguesa;
  // de lg para arriba está siempre visible y este estado no hace nada.
  // Guardamos la ruta en la que se abrió: al navegar (link o botón "atrás")
  // la ruta cambia y el drawer queda cerrado solo, sin efecto de por medio.
  const { pathname } = useLocation();
  const [rutaMenuAbierto, setRutaMenuAbierto] = useState(null);
  const menuAbierto = rutaMenuAbierto === pathname;

  const userName = user?.nombre_visible || user?.name || 'Usuario Distrital';

  const userInitials = (user?.name || 'Usuario Distrital')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formatRoleDisplay = () => {
    if (user?.roles && user.roles.length > 0) {
      return rolesVisibles(user.roles).map(r => r.nombre).join(' / ');
    }
    return 'Educador';
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-scout-bg-panel">
      <Sidebar abierto={menuAbierto} onCerrar={() => setRutaMenuAbierto(null)} />

      <div className="flex-1 min-w-0 lg:ml-64 h-full overflow-hidden flex flex-col">
        {/* Navbar Superior */}
        <header className="h-16 bg-scout-bg-card border-b border-scout-border flex items-center justify-between lg:justify-end gap-3 px-4 sm:px-8 sticky top-0 z-10 shrink-0">
          <button
            type="button"
            onClick={() => setRutaMenuAbierto(pathname)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <NotificacionesBell />
            <ThemeToggle />
            <div className="text-right min-w-0 hidden sm:block">
              <p className="text-sm font-bold text-scout-primary leading-none truncate max-w-[16rem]">
                {userName}
              </p>
              <p className="text-[11px] text-scout-muted font-medium uppercase tracking-wider mt-1 truncate max-w-[16rem]">
                {formatRoleDisplay()}
              </p>
            </div>
            <div className="w-9 h-9 bg-scout-primary text-white rounded-full border border-scout-primary-hover flex items-center justify-center font-black text-xs shadow-sm overflow-hidden shrink-0">
              {user?.foto_perfil_url ? (
                <img src={user.foto_perfil_url} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
          </div>
        </header>

        {/* Contenedor de Páginas */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

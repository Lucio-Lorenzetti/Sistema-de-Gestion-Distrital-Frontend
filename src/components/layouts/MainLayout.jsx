import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { user } = useAuthStore();

  const userName = user?.name || 'Usuario Distrital';

  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formatRoleDisplay = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles.map(r => r.nombre).join(' / ');
    }
    return 'Educador';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-scout-bg-panel">
      <Sidebar />

      <div className="flex-1 ml-64 h-full overflow-hidden flex flex-col">
        {/* Navbar Superior */}
        <header className="h-16 bg-scout-bg-card border-b border-scout-border flex items-center justify-end px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-scout-primary leading-none">
                {userName}
              </p>
              <p className="text-[11px] text-scout-muted font-medium uppercase tracking-wider mt-1">
                {formatRoleDisplay()}
              </p>
            </div>
            <div className="w-9 h-9 bg-scout-primary text-scout-bg-card rounded-full border border-scout-primary-hover flex items-center justify-center font-black text-xs shadow-sm">
              {userInitials}
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

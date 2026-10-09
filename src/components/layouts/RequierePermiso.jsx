import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { getPermisos } from '../../utils/permisos';

// Guarda de rutas del panel privado. Sin `permiso` solo exige sesión iniciada;
// con `permiso` (una key de getPermisos()) redirige a `fallback` si no lo tiene
// — típicamente la versión pública de la sección (/cursos, /noticias, ...),
// sin tocar la sesión.
const RequierePermiso = ({ permiso, fallback = '/dashboard' }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (permiso && !getPermisos(user)[permiso]) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default RequierePermiso;

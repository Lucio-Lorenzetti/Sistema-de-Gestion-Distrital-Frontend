// src/App.jsx
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layouts: eager — hacen falta apenas carga cualquier ruta, no tiene sentido separarlos.
import PublicLayout from './components/layouts/PublicLayout';
import MainLayout from './components/layouts/MainLayout';

// Todo lo demás es lazy: cada página pesa su propio chunk y solo se descarga
// cuando se navega a esa ruta, en vez de meter las ~25 páginas del sistema en
// un único bundle inicial (era el grueso de los 564kB/136kB gzip del build).

// Vistas Públicas
const Home = lazy(() => import('./pages/Public/Home'));
const Distrito = lazy(() => import('./pages/Public/Distrito'));
const Cursos = lazy(() => import('./pages/Public/Cursos'));
const Galeria = lazy(() => import('./pages/Public/Galeria'));
const Noticias = lazy(() => import('./pages/Public/Noticias'));
const Descargas = lazy(() => import('./pages/Public/Descargas'));

// Vistas de Autenticación
const Login = lazy(() => import('./pages/Auth/Login'));
const RecoverPassword = lazy(() => import('./pages/Auth/RecoverPassword'));
const EmailSent = lazy(() => import('./pages/Auth/EmailSent'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const ActivateAccount = lazy(() => import('./pages/Auth/ActivateAccount'));
const SelectFunction = lazy(() => import('./pages/Auth/SelectFunction'));

// Vistas de Dashboard (Privadas / Gestión)
const Courses = lazy(() => import('./pages/Dashboard/Courses'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Download = lazy(() => import('./pages/Dashboard/Download'));
const News = lazy(() => import('./pages/Dashboard/News'));
const Programs = lazy(() => import('./pages/Dashboard/Programs'));

// Vistas de Programas (Privadas / Gestión Programas)
const CrearPrograma = lazy(() => import('./pages/Logueado/Programas/CrearPrograma'));
const CrearProgramaCuatrimestre = lazy(() => import('./pages/Logueado/Programas/CrearProgramaCuatrimestre'));
const CrearProgramaCampamento = lazy(() => import('./pages/Logueado/Programas/CrearProgramaCampamento'));
const CrearProgramaCFA = lazy(() => import('./pages/Logueado/Programas/CrearProgramaCFA'));
const EditarProgramaCuatrimestre = lazy(() => import('./pages/Logueado/Programas/EditarProgramaCuatrimestre'));
const EditarProgramaCampamento = lazy(() => import('./pages/Logueado/Programas/EditarProgramaCampamento'));
const EditarProgramaCFA = lazy(() => import('./pages/Logueado/Programas/EditarProgramaCFA'));
const RevisarPrograma = lazy(() => import('./pages/Logueado/Programas/RevisarPrograma'));

// Vistas de Cursos - CRUD (Privadas / Gestión Cursos)
const CrearCurso = lazy(() => import('./pages/Logueado/Cursos/CrearCurso'));
const EditarCurso = lazy(() => import('./pages/Logueado/Cursos/EditarCurso'));

// Vistas de Noticias (Privadas / Gestión Noticias)
const CrearNoticia = lazy(() => import('./pages/Logueado/Noticias/CrearNoticia'));
const EditarNoticia = lazy(() => import('./pages/Logueado/Noticias/EditarNoticia'));

// Vistas de Download (Privadas / Gestión Download)
const CrearDownload = lazy(() => import('./pages/Logueado/Download/CrearDownload'));

const CargandoPagina = () => (
  <div className="h-screen w-full flex items-center justify-center bg-scout-bg-panel">
    <p className="text-scout-primary font-bold uppercase tracking-widest text-xs animate-pulse">
      Cargando...
    </p>
  </div>
);

// Componente para arreglar el bug del scroll al cambiar de página
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isBootstrapping) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-scout-bg-panel">
        <p className="text-scout-primary font-bold uppercase tracking-widest text-xs animate-pulse">
          Cargando sesión...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<CargandoPagina />}>
      <Routes>
        {/* 1. CONTEXTO PÚBLICO (Accesible para todos) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/distrito" element={<Distrito />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/descargas" element={<Descargas />} />
        </Route>

        {/* 2. CONTEXTO DE AUTENTICACIÓN (Limpio, solo formularios) */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route path="/correo-enviado" element={<EmailSent />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        <Route path="/activar-cuenta" element={<ActivateAccount />} />
        <Route path="/seleccionar-funcion" element={<SelectFunction />} />

        {/* 3. CONTEXTO PRIVADO (Gestión Interna) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/gestion-programas" element={<Programs />} />
          <Route path="/gestion-programas/crear" element={<CrearPrograma />} />
          <Route path="/gestion-programas/crear/cuatrimestre" element={<CrearProgramaCuatrimestre />} />
          <Route path="/gestion-programas/crear/campamento" element={<CrearProgramaCampamento />} />
          <Route path="/gestion-programas/crear/cfa" element={<CrearProgramaCFA />} />
          <Route path="/gestion-programas/editar/cuatrimestre/:id" element={<EditarProgramaCuatrimestre />} />
          <Route path="/gestion-programas/editar/campamento/:id" element={<EditarProgramaCampamento />} />
          <Route path="/gestion-programas/editar/cfa/:id" element={<EditarProgramaCFA />} />
          <Route path="/gestion-programas/revisar/:id" element={<RevisarPrograma />} />

          <Route path="/gestion-cursos" element={<Courses />} />
          <Route path="/gestion-cursos/administrar" element={<Courses />} />
          <Route path="/gestion-cursos/crear" element={<CrearCurso />} />
          <Route path="/gestion-cursos/editar/:id" element={<EditarCurso />} />

          <Route path="/noticias-internas" element={<News />} />
          <Route path="/noticias-internas/crear" element={<CrearNoticia />} />
          <Route path="/noticias-internas/editar/:id" element={<EditarNoticia />} />

          <Route path="/library" element={<Download />} />          
          <Route path="/library/crear" element={<CrearDownload />} />

          <Route path="/usuarios" element={<div className="p-10 text-2xl font-bold text-gray-300">Próximamente: Gestión de Usuarios</div>} />
          <Route path="/configuracion" element={<div className="p-10 text-2xl font-bold text-gray-300">Próximamente: Configuración del Sistema</div>} />
        </Route>

        {/* REDIRECCIÓN POR DEFECTO AL HOME PÚBLICO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
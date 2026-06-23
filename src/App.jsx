// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import MainLayout from './components/layouts/MainLayout';

// Vistas Públicas
import Home from './pages/Public/Home';
import Distrito from './pages/Public/Distrito';
import Cursos from './pages/Public/Cursos';
import Galeria from './pages/Public/Galeria';
import Noticias from './pages/Public/Noticias';
import Descargas from './pages/Public/Descargas';

// Vistas de Autenticación
import Login from './pages/Auth/Login';
import RecoverPassword from './pages/Auth/RecoverPassword';
import EmailSent from './pages/Auth/EmailSent';
import ResetPassword from './pages/Auth/ResetPassword';
import ActivateAccount from './pages/Auth/ActivateAccount';
import SelectFunction from './pages/Auth/SelectFunction';

// Vistas de Dashboard (Privadas / Gestión)
import Dashboard from './pages/Dashboard/Dashboard';
import Programs from './pages/Dashboard/Programs';
import Courses from './pages/Dashboard/Courses';

// Vistas de Noticias (Privadas / Gestión)
import CrearNoticia from './pages/Logueado/Noticias/CrearNoticia';
import EditarNoticia from './pages/Logueado/Noticias/EditarNoticia';

// Componente para arreglar el bug del scroll al cambiar de página
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="/gestion-documentos" element={<Programs />} />
          <Route path="/gestion-cursos" element={<Courses />} />
          <Route path="/noticias-internas" element={<div className="p-10 text-2xl font-bold text-gray-300">Próximamente: Noticias para Educadores</div>} />
          <Route path="/noticias-internas/crear" element={<CrearNoticia />} />
          <Route path="/noticias-internas/editar/:id" element={<EditarNoticia />} />
          <Route path="/usuarios" element={<div className="p-10 text-2xl font-bold text-gray-300">Próximamente: Gestión de Usuarios</div>} />
          <Route path="/configuracion" element={<div className="p-10 text-2xl font-bold text-gray-300">Próximamente: Configuración del Sistema</div>} />
        </Route>

        {/* REDIRECCIÓN POR DEFECTO AL HOME PÚBLICO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
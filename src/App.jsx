// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import MainLayout from './components/layouts/MainLayout';

// Vistas Públicas
import Home from './pages/Public/Home';

// Vistas de Autenticación
import Login from './pages/Auth/Login';
import RecoverPassword from './pages/Auth/RecoverPassword';
import EmailSent from './pages/Auth/EmailSent';
import ResetPassword from './pages/Auth/ResetPassword';
import ActivateAccount from './pages/Auth/ActivateAccount';
import SelectFunction from './pages/Auth/SelectFunction';

// Vistas de Dashboard (Privadas)
import Programs from './pages/Dashboard/Programs';
import Courses from './pages/Dashboard/Courses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. CONTEXTO PÚBLICO (Navbar institucional + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">Próximamente: Noticias Públicas</div>} />
          <Route path="/descargas" element={<div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">Próximamente: Descargas Públicas</div>} />
        </Route>

        {/* 2. CONTEXTO DE AUTENTICACIÓN (Sin Layouts, solo el formulario) */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route path="/correo-enviado" element={<EmailSent />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        <Route path="/activar-cuenta" element={<ActivateAccount />} />
        <Route path="/seleccionar-funcion" element={<SelectFunction />} />

        {/* 3. CONTEXTO PRIVADO (Sidebar dinámica + Navbar de usuario) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<div className="text-2xl font-bold">Bienvenido al Panel de Control</div>} />
          <Route path="/documentos" element={<Programs />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/noticias-internas" element={<div className="text-2xl font-bold text-gray-300">Próximamente: Noticias para Educadores</div>} />
          <Route path="/usuarios" element={<div className="text-2xl font-bold text-gray-300">Próximamente: Gestión de Usuarios</div>} />
          <Route path="/sistema" element={<div className="text-2xl font-bold text-gray-300">Próximamente: Configuración del Sistema</div>} />
        </Route>
        
        {/* REDIRECCIÓN POR DEFECTO AL HOME PÚBLICO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
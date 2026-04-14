import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import RecoverPassword from './pages/Auth/RecoverPassword';
import EmailSent from './pages/Auth/EmailSent';
import ResetPassword from './pages/Auth/ResetPassword';
import ActivateAccount from './pages/Auth/ActivateAccount';
import SelectFunction from './pages/Auth/SelectFunction';
import MainLayout from './components/layouts/MainLayout';
import Courses from './pages/Dashboard/Courses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas y de Auth*/}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route path="/correo-enviado" element={<EmailSent />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        <Route path="/activar-cuenta" element={<ActivateAccount />} />
        <Route path="/seleccionar-funcion" element={<SelectFunction />} />

        {/* Rutas Internas Protegidas */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<div className="text-2xl font-bold">Bienvenido al Dashboard</div>} />
          <Route path="/documentos" element={<div className="text-2xl font-bold">Gestión de Documentos</div>} />
          <Route path="/cursos" element={<Courses />} />
          {/* ... agregar el resto de las rutas */}
        </Route>
        
        {/* Redirección por defecto al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
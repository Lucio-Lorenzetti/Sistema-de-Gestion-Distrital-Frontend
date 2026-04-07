// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore'; // Asumimos que Zustand está configurado
import api from '../../api/axios'; // Tu instancia de Axios

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para la imagen 2
    
    const setUser = useAuthStore((state) => state.setUser); // Zustand hook

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Pedir el "permiso" CSRF a Laravel (Obligatorio con Sanctum)
      await api.get('/sanctum/csrf-cookie');

      // 2. Enviar las credenciales
      const response = await api.post('/login', { email, password });
      
      // 3. Si todo sale bien, guardamos el usuario en Zustand
      setUser(response.data.user);
      
      alert("¡Inicio de sesión exitoso!");
      // Aquí podrías usar useNavigate de react-router-dom para ir a /dashboard
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos"); // Esto activa el diseño de la Imagen 2
    }
  };

  return (
    <AuthLayout>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-950 mb-2">Iniciar sesión</h2>
        <p className="text-gray-600 text-sm">Accedé a tu cuenta del sistema</p>
      </div>

      <form onSubmit={handleLogin}>
        
        {/* Input de Email (imagen 5) */}
        <Input
          label="Correo electrónico"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />

        {/* Input de Contraseña (imagen 5) */}
        <Input
          label="Contraseña"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="**********"
          required
        />

        {/* Link Olvidé mi contraseña (imagen 5) */}
        <div className="text-center mb-6">
          <a href="/recuperar-contrasena" className="text-sm text-gray-700 hover:text-black underline">
            Olvidé mi contraseña
          </a>
        </div>

        {/* Botón Ingresar (imagen 5) */}
        <Button type="submit">
          Ingresar
        </Button>
      </form>

      {/* Info Footer (imagen 5) */}
      <div className="mt-12 text-left bg-gray-50 border border-gray-100 p-5 rounded-md flex items-start space-x-3 text-sm text-gray-700">
        <span className="text-gray-500 mt-0.5">ⓘ</span>
        <p>
          Si no tenés usuario, contactá a tu Jefe de Grupo para solicitar acceso al sistema.
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
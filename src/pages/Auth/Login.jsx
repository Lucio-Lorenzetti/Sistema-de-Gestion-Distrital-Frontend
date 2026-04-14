import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos para la navegación
import AuthLayout from '../../components/layouts/AuthLayout';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore'; 
import api from '../../api/axios'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // Opcional: para desactivar el botón mientras carga
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Pedir el "permiso" CSRF a Laravel (Obligatorio con Sanctum)
      await api.get('/sanctum/csrf-cookie');

      // 2. Enviar las credenciales
      const response = await api.post('/login', { email, password });      
      const res = response.data;

      // 3. Guardamos el usuario en Zustand
      setUser(res.user);      
      
      // 4. Lógica de redirección dinámica sincronizada con el Backend
      if (res.must_change_password) {
          navigate('/activar-cuenta');
      } else if (res.has_multiple_roles) {
          navigate('/seleccionar-funcion');
      } else {
          navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      // Manejo de errores más específico
      if (err.response?.status === 422) {
        setError("El correo o la contraseña son incorrectos.");
      } else {
        setError("Error de conexión. Verificá que el servidor esté corriendo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-950 mb-2">Iniciar sesión</h2>
        <p className="text-gray-600 text-sm">Accedé a tu cuenta del sistema</p>
      </div>

      <form onSubmit={handleLogin}>
        
        <Alert message={error} />

        <Input
          label="Correo electrónico"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />

        <Input
          label="Contraseña"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="**********"
          required
        />

        <div className="text-center mb-6">
          {/* Cambiamos <a> por <Link> para no recargar la página */}
          <Link to="/recuperar-contrasena" className="text-sm text-gray-700 hover:text-black underline">
            Olvidé mi contraseña
          </Link>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

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
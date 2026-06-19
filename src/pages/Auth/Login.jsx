import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken); // ← nuevo

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const res = response.data;

      // Guardamos en localStorage Y en el store
      localStorage.setItem('auth_token', res.token);
      setToken(res.token); // ← nuevo
      setUser(res.user);

      if (res.must_change_password) {
        navigate('/activar-cuenta');
      } else if (res.has_multiple_roles) {
        navigate('/seleccionar-funcion');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
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
        <h2 className="text-3xl font-bold text-scout-primary mb-2">Iniciar sesión</h2>
        <p className="text-scout-muted text-sm">Accedé a tu cuenta del sistema</p>
      </div>

      <form onSubmit={handleLogin}>
        <Alert message={error} />
        <Input label="Correo electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
        <Input label="Contraseña" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="**********" required />
        <div className="text-center mb-6">
          <Link to="/recuperar-contrasena" className="text-sm text-scout-primary hover:text-scout-primary-hover underline">
            Olvidé mi contraseña
          </Link>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <div className="mt-12 text-left bg-scout-bg-panel border border-scout-border p-5 rounded-md flex items-start space-x-3 text-sm text-scout-primary">
        <span className="text-scout-muted mt-0.5">ⓘ</span>
        <p>Si no tenés usuario, contactá a tu Jefe de Grupo para solicitar acceso al sistema.</p>
      </div>
    </AuthLayout>
  );
};

export default Login;

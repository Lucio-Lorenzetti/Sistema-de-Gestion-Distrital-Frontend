import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const RecoverPassword = () => {
  return (
    <AuthLayout>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-scout-primary mb-2">Recuperar contraseña</h2>
        <p className="text-scout-muted text-sm">Te enviaremos un enlace para restablecer tu contraseña</p>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <Input label="Correo electrónico" id="email" type="email" placeholder="tu@email.com" required />
        <Button type="submit" className="mt-4">Enviar enlace</Button>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-scout-primary hover:text-scout-primary-hover underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RecoverPassword;

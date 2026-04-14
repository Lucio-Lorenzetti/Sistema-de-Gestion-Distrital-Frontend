import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const EmailSent = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] border border-gray-100 rounded-lg p-10 text-center shadow-sm">
        {/* Icono de Check (Círculo con tick) */}
        <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-950 mb-4">Correo enviado</h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Te enviamos un correo para restablecer tu contraseña.
        </p>

        <div className="bg-[#F9FAFB] p-6 rounded-md mb-8">
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Revisa tu bandeja de entrada y sigue las instrucciones del correo. Si no lo ves, verifica tu carpeta de spam.
          </p>
        </div>

        <Link to="/login">
          <Button>← Volver a iniciar sesión</Button>
        </Link>

        <div className="mt-8">
          <button className="text-[13px] text-gray-500 hover:text-black flex items-center justify-center w-full gap-2">
            <span>❓</span> ¿No recibiste el correo?
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
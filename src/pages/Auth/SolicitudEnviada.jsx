import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const SolicitudEnviada = () => {
    return (
        <div className="min-h-screen bg-scout-bg-card flex items-center justify-center p-6">
            <div className="w-full max-w-[440px] border border-scout-border rounded-lg p-6 md:p-10 text-center shadow-sm">
                <div className="w-16 h-16 border-2 border-scout-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl text-scout-primary">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-scout-primary mb-4">Cuenta creada</h2>
                <p className="text-scout-muted text-sm mb-8 leading-relaxed">
                    Te mandamos un correo para verificar tu cuenta — revisá tu casilla (y la carpeta de spam, por las dudas). Además, tu solicitud de rol quedó pendiente de aprobación. Vas a poder ingresar recién cuando pase lo primero y lo segundo.
                </p>
                <Link to="/login">
                    <Button>← Volver a iniciar sesión</Button>
                </Link>
            </div>
        </div>
    );
};

export default SolicitudEnviada;

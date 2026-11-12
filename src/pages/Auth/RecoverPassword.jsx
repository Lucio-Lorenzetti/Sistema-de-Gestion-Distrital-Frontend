import { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { mensajeDeError } from '../../utils/mensajeDeError';
import { enmascararEmail } from '../../utils/enmascararEmail';

const pareceUnEmail = (texto) => /^\S+@\S+\.\S+$/.test(texto);

// Dos pasos: (1) el correo de la cuenta — se saltea si viene escrito desde el
// login — y (2) una confirmación que dice a qué dirección se va a mandar el mail.
// El servidor manda el link SIEMPRE al correo registrado en esa cuenta: no hay
// forma de pedirlo para una cuenta y recibirlo en otra casilla.
const RecoverPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailDelLogin = (location.state?.email ?? '').trim();

    const [email, setEmail] = useState(emailDelLogin);
    const [paso, setPaso] = useState(pareceUnEmail(emailDelLogin) ? 'confirmar' : 'correo');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinuar = (e) => {
        e.preventDefault();
        setError('');
        setPaso('confirmar');
    };

    const handleEnviar = async () => {
        setError('');
        setIsLoading(true);
        try {
            await api.post('/forgot-password', { email: email.trim() });
            navigate('/correo-enviado', { state: { email: email.trim() } });
        } catch (err) {
            console.error(err);
            setError(mensajeDeError(err, 'No se pudo enviar el correo.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-scout-primary mb-2">Recuperar contraseña</h2>
                <p className="text-scout-muted text-sm">
                    {paso === 'correo'
                        ? 'Ingresá el correo de tu cuenta para continuar'
                        : 'Confirmá a dónde enviamos el link para restablecerla'}
                </p>
            </div>

            {paso === 'correo' && (
                <form onSubmit={handleContinuar}>
                    <Alert message={error} />
                    <Input label="Correo electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                    <Button type="submit" className="mt-4">
                        Continuar
                    </Button>
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-scout-primary hover:text-scout-primary-hover underline">
                            Volver a iniciar sesión
                        </Link>
                    </div>
                </form>
            )}

            {paso === 'confirmar' && (
                <div className="text-left">
                    <Alert message={error} />
                    <div className="bg-scout-bg-panel border border-scout-border rounded-md p-5 mb-6 space-y-3">
                        <p className="text-[15px] text-scout-ink leading-relaxed">
                            Olvidaste la contraseña de la cuenta{' '}
                            <strong className="text-scout-primary break-all">{enmascararEmail(email)}</strong>.
                        </p>
                        <p className="text-sm text-scout-muted leading-relaxed">
                            Si aceptás, enviamos un mail <strong>solo a esa dirección</strong> con un link para elegir una contraseña nueva.
                            Después seguí los pasos del mail.
                        </p>
                    </div>

                    <Button type="button" onClick={handleEnviar} disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Aceptar y enviar el mail'}
                    </Button>

                    <div className="mt-6 flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={() => { setError(''); setPaso('correo'); }}
                            className="text-sm text-scout-primary hover:text-scout-primary-hover underline cursor-pointer"
                        >
                            No es mi cuenta, usar otro correo
                        </button>
                        <Link to="/login" className="text-sm text-scout-muted hover:text-scout-primary underline">
                            Volver a iniciar sesión
                        </Link>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default RecoverPassword;

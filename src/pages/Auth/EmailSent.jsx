import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { mensajeDeError } from '../../utils/mensajeDeError';
import { enmascararEmail } from '../../utils/enmascararEmail';

// El servidor manda un solo mail de recuperación por minuto por cuenta, y si
// se pide antes responde "ok" sin enviar nada. Por eso el botón de reenviar
// espera el mismo tiempo: así nunca parece que reenvió cuando no lo hizo.
const ESPERA_REENVIO_SEGUNDOS = 60;

const EmailSent = () => {
  const location = useLocation();
  // Lo manda RecoverPassword. Si se entra directo a esta pantalla no hay correo
  // y el botón lleva a pedir uno nuevo.
  const email = (location.state?.email ?? '').trim();

  const [segundos, setSegundos] = useState(ESPERA_REENVIO_SEGUNDOS);
  const [enviando, setEnviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (segundos <= 0) return;
    const timer = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [segundos]);

  const handleReenviar = async () => {
    setError('');
    setReenviado(false);
    setEnviando(true);
    try {
      await api.post('/forgot-password', { email });
      setReenviado(true);
      setSegundos(ESPERA_REENVIO_SEGUNDOS);
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo reenviar el correo.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-scout-bg-card flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] border border-scout-border rounded-lg p-6 md:p-10 text-center shadow-sm">
        <div className="w-16 h-16 border-2 border-scout-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-scout-primary">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-scout-primary mb-4">Correo enviado</h2>
        <p className="text-scout-muted text-sm mb-8 leading-relaxed">
          {email
            ? <>Te enviamos un correo a <strong className="text-scout-ink break-all">{enmascararEmail(email)}</strong> para restablecer tu contraseña.</>
            : 'Te enviamos un correo para restablecer tu contraseña.'}
        </p>
        <div className="bg-scout-bg-panel p-6 rounded-md mb-8">
          <p className="text-[13px] text-scout-muted leading-relaxed">
            Revisa tu bandeja de entrada y sigue las instrucciones del correo. Si no lo ves, verifica tu carpeta de spam.
          </p>
        </div>
        <Link to="/login">
          <Button>← Volver a iniciar sesión</Button>
        </Link>

        <div className="mt-8 text-[13px]">
          {reenviado && (
            <p className="text-scout-success font-medium mb-3">Listo, te lo reenviamos. Revisá también spam.</p>
          )}
          {error && <p className="text-scout-accent font-medium mb-3">{error}</p>}

          {email ? (
            <button
              type="button"
              onClick={handleReenviar}
              disabled={segundos > 0 || enviando}
              className="text-scout-primary hover:text-scout-primary-hover underline disabled:text-scout-muted disabled:no-underline disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {enviando
                ? 'Reenviando...'
                : segundos > 0
                  ? `¿No recibiste el correo? Podés reenviarlo en ${segundos} s`
                  : '¿No recibiste el correo? Reenviarlo'}
            </button>
          ) : (
            <Link to="/recuperar-contrasena" className="text-scout-primary hover:text-scout-primary-hover underline">
              ¿No recibiste el correo? Pedir otro
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSent;

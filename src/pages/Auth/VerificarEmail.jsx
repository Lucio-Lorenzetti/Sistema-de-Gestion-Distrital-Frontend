import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import api from '../../api/axios';

const VerificarEmail = () => {
    const { id, hash } = useParams();
    const [searchParams] = useSearchParams();

    const [estado, setEstado] = useState('verificando'); // verificando | ok | error
    const [error, setError] = useState('');

    const [emailReenvio, setEmailReenvio] = useState('');
    const [reenviando, setReenviando] = useState(false);
    const [reenviado, setReenviado] = useState(false);

    const verificar = useCallback(() => {
        setEstado('verificando');
        api.get(`/email/verify/${id}/${hash}`, {
            params: {
                expires: searchParams.get('expires'),
                signature: searchParams.get('signature'),
            },
        })
            .then(() => setEstado('ok'))
            .catch((err) => {
                setError(err.response?.data?.message || 'El link de verificación no es válido o ya venció.');
                setEstado('error');
            });
    }, [id, hash, searchParams]);

    useEffect(() => { verificar(); }, [verificar]);

    const handleReenviar = async (e) => {
        e.preventDefault();
        setReenviando(true);
        try {
            await api.post('/email/verify/reenviar', { email: emailReenvio });
            setReenviado(true);
        } catch (err) {
            console.error(err);
        } finally {
            setReenviando(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-scout-primary mb-2">Verificar email</h2>
            </div>

            {estado === 'verificando' && (
                <p className="text-sm text-scout-muted">Verificando tu email...</p>
            )}

            {estado === 'ok' && (
                <div className="space-y-4">
                    <Alert type="success" message="¡Listo! Tu email quedó verificado." />
                    <p className="text-sm text-scout-muted">
                        Si tu solicitud de rol ya fue aprobada, ya podés ingresar.
                    </p>
                    <Link to="/login">
                        <Button>Ir a iniciar sesión</Button>
                    </Link>
                </div>
            )}

            {estado === 'error' && (
                <div className="space-y-4">
                    <Alert message={error} />
                    {reenviado ? (
                        <p className="text-sm text-scout-muted">
                            Si ese email existe y todavía no está verificado, te reenviamos el link — revisá tu casilla.
                        </p>
                    ) : (
                        <form onSubmit={handleReenviar} className="space-y-1">
                            <p className="text-sm text-scout-muted mb-2">Pedí que te reenvíen el link:</p>
                            <Input
                                label="Email"
                                type="email"
                                value={emailReenvio}
                                onChange={(e) => setEmailReenvio(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                            <Button type="submit" disabled={reenviando}>
                                {reenviando ? 'Enviando...' : 'Reenviar link de verificación'}
                            </Button>
                        </form>
                    )}
                </div>
            )}
        </AuthLayout>
    );
};

export default VerificarEmail;

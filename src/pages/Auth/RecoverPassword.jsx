import { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const RecoverPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await api.post('/forgot-password', { email });
            navigate('/correo-enviado');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No se pudo enviar el correo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-scout-primary mb-2">Recuperar contraseña</h2>
                <p className="text-scout-muted text-sm">Te enviaremos un enlace para restablecer tu contraseña</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Alert message={error} />
                <Input label="Correo electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                <Button type="submit" disabled={isLoading} className="mt-4">
                    {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </Button>
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

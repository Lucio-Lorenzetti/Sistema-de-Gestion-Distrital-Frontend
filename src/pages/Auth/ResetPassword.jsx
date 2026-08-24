import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import api from '../../api/axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token || !email) {
            setError('El link no es válido. Pedí uno nuevo desde "Recuperar contraseña".');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            navigate('/login');
        } catch (err) {
            console.error(err);
            const backendErrors = err.response?.data?.errors;
            const primerError = backendErrors ? Object.values(backendErrors)[0]?.[0] : null;
            setError(primerError || err.response?.data?.message || 'No se pudo restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-scout-primary mb-2">Restablecer contraseña</h2>
                <p className="text-scout-muted text-sm">Ingresá tu nueva contraseña</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-1">
                <Alert message={error} />
                <Input label="Nueva contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} required />
                <Input label="Confirmar contraseña" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Repetí la contraseña" minLength={8} required />
                <p className="text-[12px] text-scout-muted my-4">La contraseña tiene que tener al menos 8 caracteres.</p>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import api from '../../api/axios';
import { ordenarRamas } from '../../utils/ordenRamas';

const Register = () => {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [ramas, setRamas] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [roleId, setRoleId] = useState('');
    const [grupoId, setGrupoId] = useState('');
    const [ramaId, setRamaId] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/roles/solicitables'),
            api.get('/grupos'),
            api.get('/ramas'),
        ]).then(([resRoles, resGrupos, resRamas]) => {
            setRoles(resRoles.data);
            setGrupos(resGrupos.data);
            setRamas(ordenarRamas(resRamas.data));
        }).catch((err) => {
            console.error('Error al cargar roles/grupos/ramas:', err);
            setError('No se pudo cargar el formulario. Recargá la página.');
        });
    }, []);

    const rolSeleccionado = useMemo(
        () => roles.find((r) => String(r.id) === String(roleId)),
        [roles, roleId]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role_id: roleId,
                grupo_id: rolSeleccionado?.requiere_grupo ? grupoId : null,
                rama_id: rolSeleccionado?.requiere_rama ? ramaId : null,
            });
            navigate('/solicitud-enviada');
        } catch (err) {
            console.error(err);
            const backendErrors = err.response?.data?.errors;
            const primerError = backendErrors ? Object.values(backendErrors)[0]?.[0] : null;
            setError(primerError || err.response?.data?.message || 'No se pudo completar el registro.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-scout-primary mb-2">Crear cuenta</h2>
                <p className="text-scout-muted text-sm">
                    Elegí el rol que querés solicitar. Alguien con la potestad correspondiente lo va a revisar antes de activar tu cuenta.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Alert message={error} />

                <Input label="Nombre y apellido" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" required />
                <Input label="Correo electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                <Input label="Contraseña" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} required />
                <Input label="Confirmar contraseña" id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Repetí la contraseña" minLength={8} required />

                <Select
                    label="Rol que querés solicitar"
                    id="role_id"
                    value={roleId}
                    onChange={(e) => { setRoleId(e.target.value); setGrupoId(''); setRamaId(''); }}
                    options={roles.map((r) => ({ value: r.id, label: r.nombre }))}
                    required
                />

                {rolSeleccionado?.requiere_grupo && (
                    <Select
                        label="Grupo"
                        id="grupo_id"
                        value={grupoId}
                        onChange={(e) => setGrupoId(e.target.value)}
                        options={grupos.map((g) => ({ value: g.id, label: g.nombre }))}
                        required
                    />
                )}

                {rolSeleccionado?.requiere_rama && (
                    <Select
                        label="Rama"
                        id="rama_id"
                        value={ramaId}
                        onChange={(e) => setRamaId(e.target.value)}
                        options={ramas.map((r) => ({ value: r.id, label: r.nombre }))}
                        required
                    />
                )}

                <Button type="submit" disabled={isLoading} className="mt-4">
                    {isLoading ? 'Enviando...' : 'Crear cuenta y solicitar rol'}
                </Button>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-scout-primary hover:text-scout-primary-hover underline">
                        Ya tengo cuenta — iniciar sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;

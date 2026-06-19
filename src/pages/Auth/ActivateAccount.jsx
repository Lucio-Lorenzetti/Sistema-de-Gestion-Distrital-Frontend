import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ActivateAccount = () => {
  return (
    <AuthLayout>
      <div className="text-left mb-6">
        <h2 className="text-3xl font-bold text-scout-primary mb-2">Activar cuenta</h2>
        <p className="text-scout-muted text-sm font-normal leading-relaxed">
          Complete la configuración de su cuenta para continuar
        </p>
      </div>

      <form className="space-y-1">
        <Input label="Correo electrónico" value="usuario@gmail.com" disabled />
        <Input label="Nueva contraseña" type="password" placeholder="Ingrese su nueva contraseña" />
        <Input label="Confirmar contraseña" type="password" placeholder="Ingrese su nueva contraseña" />

        <div className="bg-scout-bg-panel border border-scout-border p-4 rounded-sm my-6">
          <p className="text-[13px] font-medium text-scout-primary mb-3">Requisitos de contraseña:</p>
          <ul className="space-y-2">
            <li className="flex items-center text-[12px] text-scout-muted">
              <span className="mr-2 text-scout-success">✓</span> Mínimo 8 caracteres
            </li>
            <li className="flex items-center text-[12px] text-scout-muted">
              <span className="mr-2 text-scout-muted">×</span> Al menos una letra mayúscula
            </li>
          </ul>
        </div>

        <Button type="submit">Activar cuenta</Button>
      </form>
    </AuthLayout>
  );
};

export default ActivateAccount;

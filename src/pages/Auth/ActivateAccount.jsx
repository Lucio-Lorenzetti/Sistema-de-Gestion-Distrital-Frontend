import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ActivateAccount = () => {
  return (
    <AuthLayout>
      <div className="text-left mb-6">
        <h2 className="text-3xl font-bold text-gray-950 mb-2">Activar cuenta</h2>
        <p className="text-gray-600 text-sm font-normal leading-relaxed">
          Complete la configuración de su cuenta para continuar
        </p>
      </div>

      <form className="space-y-1">
        <Input label="Correo electrónico" value="usuario@gmail.com" disabled />
        <Input label="Nueva contraseña" type="password" placeholder="Ingrese su nueva contraseña" />
        <Input label="Confirmar contraseña" type="password" placeholder="Ingrese su nueva contraseña" />

        {/* Card de Requisitos (Calco de Imagen 0) */}
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm my-6">
          <p className="text-[13px] font-medium text-gray-700 mb-3">Requisitos de contraseña:</p>
          <ul className="space-y-2">
            <li className="flex items-center text-[12px] text-gray-600">
              <span className="mr-2 text-green-600">✓</span> Mínimo 8 caracteres
            </li>
            <li className="flex items-center text-[12px] text-gray-500">
              <span className="mr-2 text-gray-400">×</span> Al menos una letra mayúscula
            </li>
            {/* ... agregar el resto según Imagen 0 ... */}
          </ul>
        </div>

        <Button type="submit">Activar cuenta</Button>
      </form>
    </AuthLayout>
  );
};

export default ActivateAccount;
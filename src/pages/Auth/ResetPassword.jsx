import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  return (
    <AuthLayout>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-950 mb-2">Restablecer contraseña</h2>
        <p className="text-gray-600 text-sm">Ingresa tu nueva contraseña</p>
      </div>

      <form className="space-y-1">
        <Input label="Nueva contraseña" type="password" placeholder="Ingresa tu nueva contraseña" />
        <Input label="Confirmar contraseña" type="password" placeholder="Ingresa tu nueva contraseña" />

        <div className="bg-[#F9FAFB] border border-gray-100 p-5 rounded-sm my-8">
          <p className="text-[13px] font-medium text-gray-700 mb-4">Requisitos de contraseña:</p>
          <ul className="space-y-3 text-[12px] text-gray-600">
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Al menos 8 caracteres</li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Una letra mayúscula</li>
            <li className="flex items-center gap-2"><span className="text-red-500">×</span> Una letra minúscula</li>
            <li className="flex items-center gap-2"><span className="text-red-500">×</span> Un número</li>
          </ul>
        </div>

        <Button type="submit">Guardar nueva contraseña</Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
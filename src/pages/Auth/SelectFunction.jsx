import AuthLayout from '../../components/layouts/AuthLayout';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const SelectFunction = () => {
  return (
    <AuthLayout>
      <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-950 mb-2">Seleccionar función</h2>
        <p className="text-gray-600 text-sm">Elija el ámbito y cargo con el que desea ingresar</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <Select 
          label="Organismo / Ámbito" 
          options={[
            { value: '19-de-mayo', label: '19 de Mayo' },
            { value: 'fatima', label: 'Nuestra Señora de Fátima' },
            { value: 'pompeya', label: 'Nuestra Señora de Pompeya' },
            { value: 'perito', label: 'Perito Moreno' },
            { value: 'padua', label: 'San Antonio de Padua' },
            { value: 'san-francisco', label: 'San Francisco de Asís' },
            { value: 'san-jorge', label: 'San Jorge' },
            { value: 'san-pantaleon', label: 'San Pantaleon' },
            { value: 'san-pio', label: 'San Pio X' }
          ]} 
        />
        
        <Select 
          label="Función / Cargo" 
          options={[
            { value: 'director', label: 'Director de Distrito' },
            { value: 'programa-general', label: 'Auxiliar Programa General' },
            { value: 'comunicacion', label: 'Auxiliar Comunicación' },
            { value: 'aux-rama', label: 'Auxiliar de Programa Rama' },
            { value: 'jefe-de-grupo', label: 'Jefe de Grupo' },
            { value: 'educador', label: 'Educador' }
          ]} 
        />

        {/* En la Imagen 6 el botón es azul, así que le pasamos una clase de color personalizada */}
        <Button type="submit" className="bg-[#0056b3] hover:bg-[#004494] mt-4">
          Ingresar al sistema
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SelectFunction;
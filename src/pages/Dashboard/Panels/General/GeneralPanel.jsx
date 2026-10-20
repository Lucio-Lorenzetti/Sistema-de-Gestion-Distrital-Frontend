// src/pages/Dashboard/panels/general/GeneralPanel.jsx
import GeneralMetrics from './GeneralMetrics';
import QuickAccessLinks from './QuickAccessLinks';
import ActividadSistemaCard from './ActividadSistemaCard';
import ProgramasTable from '../../Panels/Programas/ProgramasTable';
import { useProgramas } from '../../Panels/Programas/useProgramas';

const GeneralPanel = () => {
    const { programas, isLoading: isLoadingProgramas } = useProgramas();

    return (
        <>
            <GeneralMetrics programas={programas} />

            <ActividadSistemaCard />

            <QuickAccessLinks />

            {/* Misma tabla completa (filtros de Grupo/Rama/Estado + paginación) que usa
                Aux Programa/Educador en /gestion-programas — pedido explícito para Director. */}
            <div className="lg:col-span-3">
                <ProgramasTable programas={programas} isLoading={isLoadingProgramas} />
            </div>
        </>
    );
};

export default GeneralPanel;

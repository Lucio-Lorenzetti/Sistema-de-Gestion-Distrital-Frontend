// src/pages/Dashboard/Panels/Developer/DeveloperPanel.jsx
import EstadoSistemaCard from './EstadoSistemaCard';
import ErroresRecientesCard from './ErroresRecientesCard';
import MetricasSistema from './MetricasSistema';
import AccesosTecnicosCard from './AccesosTecnicosCard';
import ActividadSistemaCard from '../General/ActividadSistemaCard';
import { useSistemaEstado, useSistemaMetricas } from './useSistemaDashboard';

// Dashboard del Developer: salud del sistema y errores arriba (lo que hay que
// mirar primero), después las métricas del distrito y la actividad.
const DeveloperPanel = () => {
    const { estado, isLoading, isError, isFetching, refetch, actualizadoEn } = useSistemaEstado();
    const { metricas, isLoading: cargandoMetricas, isError: errorMetricas } = useSistemaMetricas();

    return (
        <>
            <EstadoSistemaCard
                estado={estado}
                isLoading={isLoading}
                isError={isError}
                isFetching={isFetching}
                onRefresh={refetch}
                actualizadoEn={actualizadoEn}
            />
            <ErroresRecientesCard errores={estado?.errores_recientes} isLoading={isLoading} />

            <MetricasSistema metricas={metricas} isLoading={cargandoMetricas} isError={errorMetricas} />

            <ActividadSistemaCard />
            <AccesosTecnicosCard />
        </>
    );
};

export default DeveloperPanel;

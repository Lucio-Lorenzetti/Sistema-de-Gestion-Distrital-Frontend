// src/pages/Dashboard/Panels/Developer/DeveloperPanel.jsx
import EstadoSistemaCard from './EstadoSistemaCard';
import ErroresRecientesCard from './ErroresRecientesCard';
import MetricasSistema from './MetricasSistema';
import AccesosTecnicosCard from './AccesosTecnicosCard';
import ActividadSistemaCard from '../General/ActividadSistemaCard';
import { useSistemaEstado, useSistemaMetricas } from './useSistemaDashboard';

// Cada fila de tarjetas es su propia grilla con `items-stretch`: las tarjetas de una
// misma fila terminan siempre a la misma altura, sin importar cuánto contenido tenga cada una.
const FILA = 'lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch';

// Dashboard del Developer: salud del sistema y errores arriba (lo que hay que
// mirar primero), después las métricas del distrito y la actividad.
const DeveloperPanel = () => {
    const { estado, isLoading, isError, isFetching, refetch, actualizadoEn } = useSistemaEstado();
    const { metricas, isLoading: cargandoMetricas, isError: errorMetricas } = useSistemaMetricas();

    return (
        <>
            <div className={FILA}>
                <EstadoSistemaCard
                    estado={estado}
                    isLoading={isLoading}
                    isError={isError}
                    isFetching={isFetching}
                    onRefresh={refetch}
                    actualizadoEn={actualizadoEn}
                />
                <ErroresRecientesCard errores={estado?.errores_recientes} isLoading={isLoading} />
            </div>

            <MetricasSistema metricas={metricas} isLoading={cargandoMetricas} isError={errorMetricas} />

            <div className={FILA}>
                <ActividadSistemaCard itemsPerPage={5} />
                <AccesosTecnicosCard />
            </div>
        </>
    );
};

export default DeveloperPanel;

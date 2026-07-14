// src/pages/Dashboard/panels/cursos/CursosPanel.jsx
import CursosMetrics from './CursosMetrics';
import CursosTable from './CursosTable';
import { useCursos } from './useCursos';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';

const CursosPanel = () => {
    const { cursos } = useCursos();
    const { current, page, setPage, totalPages, filtro, changeFiltro } = usePaginatedFilter(cursos, {
        defaultFilter: 'Todos',
    });

    const handleVer = (id) => {
        // TODO: navegar a detalle del curso o abrir modal, cuando exista esa pantalla
        console.log('Ver curso', id);
    };

    return (
        <>
            <CursosMetrics cursos={cursos} />
            <CursosTable
                cursos={current}
                filtro={filtro}
                onFiltroChange={changeFiltro}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onVer={handleVer}
            />
        </>
    );
};

export default CursosPanel;
// src/pages/Dashboard/panels/noticias/NoticiasPanel.jsx
import { useState } from 'react';
import NoticiasMetrics from './NoticiasMetrics';
import NoticiasTable from './NoticiasTable';
import NoticiaExpandModal from './NoticiaExpandModal';
import { useNoticias } from './useNoticias';
import { usePaginatedFilter } from '../../../../hooks/usePaginatedFilter';

const NoticiasPanel = () => {
    const { noticias, eliminar, publicarRapido } = useNoticias();
    const [expandedId, setExpandedId] = useState(null);

    const { current, page, setPage, totalPages, filtro, changeFiltro } = usePaginatedFilter(noticias, {
        defaultFilter: 'Todas',
    });

    const expandida = noticias.find((n) => n.id === expandedId);

    return (
        <>
            <NoticiasMetrics noticias={noticias} />
            <NoticiasTable
                noticias={current}
                filtro={filtro}
                onFiltroChange={changeFiltro}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onVer={setExpandedId}
                onPublicar={publicarRapido}
                onEliminar={eliminar}
            />
            {expandida && <NoticiaExpandModal noticia={expandida} onClose={() => setExpandedId(null)} />}
        </>
    );
};

export default NoticiasPanel;
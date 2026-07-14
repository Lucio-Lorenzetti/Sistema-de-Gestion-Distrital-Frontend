// src/hooks/usePaginatedFilter.js
import { useState } from 'react';

export function usePaginatedFilter(items, { itemsPerPage = 3, defaultFilter = 'Todos' } = {}) {
    const [page, setPage] = useState(1);
    const [filtro, setFiltro] = useState(defaultFilter);

    const filtered = filtro === defaultFilter ? items : items.filter((i) => i.estado === filtro);
    const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
    const current = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const changeFiltro = (key) => {
        setFiltro(key);
        setPage(1);
    };

    return {
        current,
        page,
        setPage,
        totalPages,
        filtro,
        changeFiltro,
        total: filtered.length,
        itemsPerPage,
    };
}
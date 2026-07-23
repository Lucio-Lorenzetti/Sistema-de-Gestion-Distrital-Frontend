import { useState, useEffect } from 'react';
import api from '../../../../api/axios';

export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/courses')
            .then(res => {
                setCursos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al cargar cursos:', err);
                setLoading(false);
            });
    }, []);

    return { cursos, loading };
};
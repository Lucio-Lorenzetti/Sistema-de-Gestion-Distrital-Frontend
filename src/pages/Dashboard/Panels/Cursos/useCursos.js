import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/courses')
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
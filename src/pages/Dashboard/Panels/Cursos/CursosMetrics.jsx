// src/pages/Dashboard/panels/cursos/CursosMetrics.jsx
import { Calendar, Users, BookOpen } from 'lucide-react';
import MetricCard from '../../../../components/ui/MetricCard';

const CursosMetrics = ({ cursos }) => {
    const abiertos = cursos.filter((c) => c.estado === 'Abierto').length;
    const totalInscriptos = cursos.reduce((acc, c) => acc + c.inscriptos, 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-3">
            <MetricCard icon={<BookOpen />} title="Cursos Abiertos" value={`${abiertos} Disponibles`} sub="Inscripciones activas" color="border-scout-primary" />
            <MetricCard icon={<Users />} title="Total Inscriptos" value={`${totalInscriptos} Educadores`} sub="En todos los cursos" color="border-scout-muted" />
            <MetricCard icon={<Calendar />} title="Total de Cursos" value={`${cursos.length} En Sistema`} sub="Ciclo 2026" color="border-scout-muted" />
        </div>
    );
};

export default CursosMetrics;
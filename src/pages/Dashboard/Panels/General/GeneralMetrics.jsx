// src/pages/Dashboard/panels/general/GeneralMetrics.jsx
import { Users, Milestone, FileText, Newspaper } from 'lucide-react';
import MetricCard from '../../../../components/ui/MetricCard';

const GeneralMetrics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
        <MetricCard icon={<Users />} title="Educadores Registrados" value="124 Activos" sub="Total en Distrito 3" color="border-scout-primary" />
        <MetricCard icon={<Milestone />} title="Programas Observados" value="42 Archivos" sub="Feedback enviado" color="border-scout-muted" />
        <MetricCard icon={<FileText />} title="Programas en Revisión" value="18 Pendientes" sub="Requieren atención" color="border-scout-muted" />
        <MetricCard icon={<Newspaper />} title="Circulares Emitidas" value="18 Oficiales" sub="Año lectivo 2026" color="border-scout-border" />
    </div>
);

export default GeneralMetrics;
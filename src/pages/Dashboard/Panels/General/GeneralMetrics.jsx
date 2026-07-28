// src/pages/Dashboard/panels/general/GeneralMetrics.jsx
import { Users, ShieldCheck, FileText, Newspaper } from 'lucide-react';
import MetricCard from '../../../../components/ui/MetricCard';
import { useNoticias } from '../../Panels/Noticias/useNoticias';

const GeneralMetrics = () => {
    // — Única métrica con backend real hoy: cantidad de noticias publicadas —
    const { noticias } = useNoticias();
    const totalPublicadas = noticias.filter((n) => n.estado === 'Publicada').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
            {/*
              ⚠️ PLACEHOLDER: falta el endpoint de Usuarios (GET /api/users o similar).
              Cuando exista, reemplazar value/sub por el conteo real de educadores.
            */}
            <MetricCard
                icon={<Users />}
                title="Educadores Registrados"
                value="—"
                sub="Falta conectar backend de Usuarios"
                color="border-scout-primary"
            />

            {/*
              ⚠️ PLACEHOLDER: depende del módulo de Programas, que se rehace desde cero.
              Cuando exista el campo de estado definitivo, contar Aprobados acá.
            */}
            <MetricCard
                icon={<ShieldCheck />}
                title="Programas Aprobados"
                value="—"
                sub="Pendiente: módulo de Programas"
                color="border-scout-muted"
            />

            {/* ⚠️ PLACEHOLDER: mismo caso, cuenta de estado "En Revisión" */}
            <MetricCard
                icon={<FileText />}
                title="Programas en Revisión"
                value="—"
                sub="Pendiente: módulo de Programas"
                color="border-scout-muted"
            />

            <MetricCard
                icon={<Newspaper />}
                title="Noticias Publicadas"
                value={`${totalPublicadas} Publicadas`}
                sub="Visibles en el portal público"
                color="border-scout-border"
            />
        </div>
    );
};

export default GeneralMetrics;
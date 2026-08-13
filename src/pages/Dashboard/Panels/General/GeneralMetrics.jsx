// src/pages/Dashboard/panels/general/GeneralMetrics.jsx
import { Users, ShieldCheck, FileText, Newspaper } from 'lucide-react';
import MetricCard from '../../../../components/ui/MetricCard';
import { useNoticias } from '../../Panels/Noticias/useNoticias';

// "programas" llega por prop en vez de pedirse acá con useProgramas(): GeneralPanel
// ya hace ese fetch para la tabla completa, y duplicarlo acá pegaría dos veces
// a /programas en el mismo render del dashboard del Director.
const GeneralMetrics = ({ programas = [] }) => {
    const { noticias } = useNoticias();
    const totalPublicadas = noticias.filter((n) => n.estado === 'Publicada').length;

    const totalAprobados = programas.filter((p) => p.estado === 'aprobado').length;
    // "En revisión" = enviado: incluye tanto los que esperan una primera lectura
    // como los que van y vienen con comentarios — ese ida y vuelta no cambia el
    // estado, el programa sigue en 'enviado' hasta que se aprueba/rechaza/vuelve a borrador.
    const totalEnRevision = programas.filter((p) => p.estado === 'enviado').length;

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

            <MetricCard
                icon={<ShieldCheck />}
                title="Programas Aprobados"
                value={`${totalAprobados} Programas`}
                sub="Ya cerrados y visibles"
                color="border-scout-muted"
            />

            <MetricCard
                icon={<FileText />}
                title="Programas en Revisión"
                value={`${totalEnRevision} Programas`}
                sub="Esperando aprobación o con comentarios abiertos"
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
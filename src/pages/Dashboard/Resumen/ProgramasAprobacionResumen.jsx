// src/pages/Dashboard/Resumen/ProgramasAprobacionResumen.jsx
import React from 'react';
import { CheckCircle2, Hourglass } from 'lucide-react';
import { useProgramas } from '../Panels/Programas/useProgramas';
import ProgramaListaResumen from '../Panels/Programas/ProgramaListaResumen';
import ComentariosRespondidosResumenCard from './ComentariosRespondidosResumenCard';

/**
 * Usado tanto por Aux Prog General como por cada Aux de Rama — el backend ya
 * scopea /programas según el rol (General ve todo, cada Aux de Rama solo la suya),
 * así que este componente no necesita saber cuál de los dos es ni chequear rol.
 *
 * Layout en 2 columnas: izquierda "Te Respondieron" + "Próximos a Aprobar"
 * apilados (lo que requiere una acción), derecha "Aprobados Recientemente"
 * (informativo). Por eso vive acá y no como resumen aparte: para que la
 * columna derecha pueda estirarse (h-full) al alto combinado de la izquierda.
 */
const ProgramasAprobacionResumen = () => {
    const { programas, isLoading } = useProgramas();

    // "Próximos a Aprobar" = el educador pidió explícitamente que se lo apruebe
    // (aprobacion_solicitada_at), no simplemente "está en revisión" — un programa
    // puede estar 'enviado' yendo y viniendo con comentarios sin estar listo todavía.
    const proximosAAprobar = [...programas]
        .filter((p) => p.estado === 'enviado' && p.aprobacion_solicitada_at)
        .sort((a, b) => new Date(a.aprobacion_solicitada_at) - new Date(b.aprobacion_solicitada_at))
        .slice(0, 5);

    // Informativo, no requiere acción — se muestra con menos peso visual.
    const aprobadosRecientes = [...programas]
        .filter((p) => p.estado === 'aprobado')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);

    if (isLoading) {
        return (
            <div className="lg:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando programas...</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
                <ComentariosRespondidosResumenCard />
                <ProgramaListaResumen
                    titulo="Próximos a Aprobar"
                    icon={<Hourglass size={16} />}
                    programas={proximosAAprobar}
                    emptyText="Nadie solicitó una aprobación todavía"
                    fechaCampo="aprobacion_solicitada_at"
                    fechaLabel="Solicitado"
                />
            </div>
            <div className="md:col-span-1">
                <ProgramaListaResumen
                    titulo="Programas Aprobados Recientemente"
                    icon={<CheckCircle2 size={16} />}
                    programas={aprobadosRecientes}
                    emptyText="Todavía no hay programas publicados"
                    fechaCampo="updated_at"
                    fechaLabel="Aprobado"
                    compact
                />
            </div>
        </div>
    );
};

export default ProgramasAprobacionResumen;
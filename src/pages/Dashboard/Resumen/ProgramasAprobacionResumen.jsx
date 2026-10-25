// src/pages/Dashboard/Resumen/ProgramasAprobacionResumen.jsx
import React from 'react';
import { CheckCircle2, Hourglass } from 'lucide-react';
import { useProgramas } from '../Panels/Programas/useProgramas';
import ProgramaListaResumen from '../Panels/Programas/ProgramaListaResumen';
import NovedadesRevisionResumenCard from './NovedadesRevisionResumenCard';

// Igual que las tarjetas de Noticias / Cursos / Documentación: ninguna pasa de este
// tope, así el Dashboard del auxiliar entra en la pantalla sin scroll.
const MAX_FILAS = 6;

/**
 * Usado tanto por Aux Prog General como por cada Aux de Rama — el backend ya
 * scopea /programas según el rol (General ve todo, cada Aux de Rama solo la suya),
 * así que este componente no necesita saber cuál de los dos es ni chequear rol.
 *
 * Devuelve tres tarjetas que se acomodan en la grilla de 3 columnas del Dashboard:
 * "Novedades" (lo que pasó en revisión), "Próximos a Aprobar" y "Aprobados".
 */
const ProgramasAprobacionResumen = () => {
    const { programas, isLoading } = useProgramas();

    // "Próximos a Aprobar" = el educador pidió explícitamente que se lo apruebe
    // (aprobacion_solicitada_at), no simplemente "está en revisión" — un programa
    // puede estar 'enviado' yendo y viniendo con comentarios sin estar listo todavía.
    const proximosAAprobar = [...programas]
        .filter((p) => p.estado === 'enviado' && p.aprobacion_solicitada_at)
        .sort((a, b) => new Date(a.aprobacion_solicitada_at) - new Date(b.aprobacion_solicitada_at))
        .slice(0, MAX_FILAS);

    const aprobadosRecientes = [...programas]
        .filter((p) => p.estado === 'aprobado')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, MAX_FILAS);

    if (isLoading) {
        return (
            <div className="md:col-span-3 bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando programas...</p>
            </div>
        );
    }

    return (
        <>
            <NovedadesRevisionResumenCard />
            <ProgramaListaResumen
                titulo="Próximos a Aprobar"
                icon={<Hourglass size={16} />}
                programas={proximosAAprobar}
                emptyText="Nadie solicitó una aprobación"
                fechaCampo="aprobacion_solicitada_at"
                fechaLabel="Solicitado"
            />
            <ProgramaListaResumen
                titulo="Aprobados"
                icon={<CheckCircle2 size={16} />}
                programas={aprobadosRecientes}
                emptyText="Todavía no hay programas aprobados"
                fechaCampo="updated_at"
                fechaLabel="Aprobado"
            />
        </>
    );
};

export default ProgramasAprobacionResumen;

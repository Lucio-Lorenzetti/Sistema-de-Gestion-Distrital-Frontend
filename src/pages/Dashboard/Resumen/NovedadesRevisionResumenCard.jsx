// src/pages/Dashboard/Resumen/NovedadesRevisionResumenCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNovedadesRevision } from '../Panels/Programas/useNovedadesRevision';

// Cuántas filas entran sin que el Dashboard pase del alto de la pantalla: esta tarjeta
// comparte la columna izquierda con "Próximos a Aprobar" (ver ProgramasAprobacionResumen).
const MAX_FILAS = 3;

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

// Qué le pasó al programa.
const LABEL_POR_TIPO = {
    enviado: 'Nuevo en revisión',
    reenviado: 'Corregido y reenviado',
    respuesta: 'Respondió',
    resuelto: 'Resolvió un hilo',
};

const nombre = (usuario) => usuario?.nombre_visible || usuario?.name;

// Lo que pasó en revisión: programas que entraron, que volvieron corregidos tras
// comentarios, e hilos respondidos o resueltos. Lo usan Aux Prog General (todas las
// ramas) y cada Aux de Rama (la suya); el backend ya acota.
// Mismo formato de fila que "Próximos a Aprobar": título + metadato + fecha.
const NovedadesRevisionResumenCard = () => {
    const { novedades, isLoading } = useNovedadesRevision();
    const filas = novedades.filter((n) => LABEL_POR_TIPO[n.tipo]).slice(0, MAX_FILAS);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                <Bell size={16} /> Novedades en Revisión
            </h3>
            <div className="h-px bg-scout-border my-4" />

            {isLoading ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando...</p>
            ) : filas.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-2">Sin novedades en los últimos 14 días</p>
            ) : (
                <div className="flex flex-col divide-y divide-scout-border">
                    {filas.map((n) => {
                        const quien = nombre(n.actor) || nombre(n.program?.owner);

                        return (
                            <Link
                                key={`${n.tipo}-${n.program?.id}-${n.fecha}`}
                                to={`/gestion-programas/revisar/${n.program?.id}`}
                                className="py-3 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-scout-bg-panel transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-scout-ink truncate">{n.program?.titulo}</p>
                                    <p className="text-xs text-scout-muted truncate">
                                        <span className="font-bold text-scout-ink">{LABEL_POR_TIPO[n.tipo]}</span>
                                        {quien && <> · {quien}</>}
                                        {n.detalle && <>: {n.detalle}</>}
                                    </p>
                                </div>
                                <span className="shrink-0 text-[9px] font-bold text-scout-muted uppercase tracking-widest whitespace-nowrap">
                                    {formatFecha(n.fecha)}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NovedadesRevisionResumenCard;

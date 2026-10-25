// src/pages/Dashboard/Resumen/NovedadesRevisionResumenCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Clock } from 'lucide-react';
import EstadoBadge from '../../../components/ui/EstadoBadge';
import { useNovedadesRevision } from '../Panels/Programas/useNovedadesRevision';

// Cuántas filas entran sin que el Dashboard pase del alto de la pantalla (igual que
// las tarjetas de Noticias / Cursos / Documentación).
const MAX_FILAS = 6;

const formatFecha = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
};

// Qué le pasó al programa → texto del badge (colores en EstadoBadge).
const BADGE_POR_TIPO = {
    enviado: 'Nuevo',
    reenviado: 'Corregido',
    respuesta: 'Respuesta',
    resuelto: 'Resuelto',
};

const nombre = (usuario) => usuario?.nombre_visible || usuario?.name;

// Lo que pasó en revisión: programas que entraron, que volvieron corregidos tras
// comentarios, e hilos respondidos o resueltos. Lo usan Aux Prog General (todas las
// ramas) y cada Aux de Rama (la suya); el backend ya acota.
const NovedadesRevisionResumenCard = () => {
    const { novedades, isLoading } = useNovedadesRevision();
    const filas = novedades.filter((n) => BADGE_POR_TIPO[n.tipo]).slice(0, MAX_FILAS);

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-sm font-black uppercase tracking-tight text-scout-primary flex items-center gap-2">
                    <Bell size={16} /> Novedades
                </h2>
                <Link to="/gestion-programas" className="text-scout-muted hover:text-scout-primary transition-colors">
                    <ChevronRight size={16} />
                </Link>
            </div>
            <div className="h-px bg-scout-border shrink-0 my-4" />

            {isLoading ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse py-4 text-center">Cargando...</p>
            ) : filas.length === 0 ? (
                <p className="text-xs font-bold text-scout-muted uppercase tracking-tight py-4 text-center">Sin novedades en 14 días</p>
            ) : (
                <div className="space-y-4 flex-1">
                    {filas.map((n) => {
                        const quien = nombre(n.actor) || nombre(n.program?.owner);

                        return (
                            <Link
                                key={`${n.tipo}-${n.program?.id}-${n.fecha}`}
                                to={`/gestion-programas/revisar/${n.program?.id}`}
                                title={n.detalle ? `${quien ? `${quien}: ` : ''}${n.detalle}` : undefined}
                                className="block space-y-1"
                            >
                                <p className="text-xs font-bold text-scout-ink line-clamp-1">{n.program?.titulo}</p>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] text-scout-muted flex items-center gap-1 min-w-0">
                                        <Clock size={10} className="shrink-0" />
                                        <span className="truncate">{formatFecha(n.fecha)}{quien ? ` · ${quien}` : ''}</span>
                                    </span>
                                    <EstadoBadge estado={BADGE_POR_TIPO[n.tipo]} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <Link
                to="/gestion-programas"
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-scout-primary hover:text-scout-primary-hover transition-colors flex items-center gap-1"
            >
                Ver todos <ChevronRight size={12} />
            </Link>
        </div>
    );
};

export default NovedadesRevisionResumenCard;

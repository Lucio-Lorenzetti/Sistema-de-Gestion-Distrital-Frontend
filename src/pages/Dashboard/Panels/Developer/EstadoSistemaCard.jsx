// src/pages/Dashboard/Panels/Developer/EstadoSistemaCard.jsx
import { RefreshCw } from 'lucide-react';
import { tiempoRelativo, horasDesde } from '../../../../utils/tiempo';

const COLOR_NIVEL = {
    ok: 'bg-scout-success',
    warn: 'bg-amber-500',
    bad: 'bg-scout-accent',
};

// Cada fila es un chequeo: { label, nivel: ok | warn | bad, detalle }.
const armarChequeos = (estado) => {
    const { base_de_datos, heartbeat, servicios, entorno } = estado;

    // El heartbeat vive en cache con 2 días de vida: si no hay registro, hace más
    // que eso (o nunca corrió). Con más de 24 h ya conviene mirarlo: Supabase
    // pausa la base tras varios días sin actividad.
    let chequeoCron;
    if (!heartbeat.cron_secret_configurado) {
        chequeoCron = { nivel: 'bad', detalle: 'Falta CRON_SECRET: el endpoint rechaza al cron' };
    } else if (!heartbeat.ultimo) {
        chequeoCron = { nivel: 'warn', detalle: 'Sin llamadas en los últimos 2 días' };
    } else {
        chequeoCron = {
            nivel: horasDesde(heartbeat.ultimo) <= 24 ? 'ok' : 'warn',
            detalle: `Última llamada ${tiempoRelativo(heartbeat.ultimo)}`,
        };
    }

    const enProduccion = entorno.app_env === 'production';
    const discoLocal = servicios.almacenamiento.disco === 'public' || servicios.almacenamiento.disco === 'local';

    return [
        {
            label: 'Base de datos',
            nivel: base_de_datos.ok ? 'ok' : 'bad',
            detalle: base_de_datos.ok ? `Responde (${base_de_datos.ms} ms)` : 'No responde',
        },
        { label: 'Cron anti-pausa', ...chequeoCron },
        {
            label: 'Correo',
            nivel: servicios.correo.configurado ? 'ok' : 'warn',
            detalle: servicios.correo.configurado
                ? `${servicios.correo.driver} · ${servicios.correo.host}`
                : `Modo "${servicios.correo.driver}": no se envían correos`,
        },
        {
            label: 'Asistente IA (Gemini)',
            nivel: servicios.gemini.configurado ? 'ok' : 'warn',
            detalle: servicios.gemini.configurado ? servicios.gemini.modelo : 'Falta GEMINI_API_KEY',
        },
        {
            label: 'Archivos subidos',
            nivel: enProduccion && discoLocal ? 'warn' : 'ok',
            detalle: enProduccion && discoLocal
                ? `Disco "${servicios.almacenamiento.disco}": se pierde en cada deploy`
                : `Disco "${servicios.almacenamiento.disco}"`,
        },
        {
            label: 'Entorno',
            nivel: enProduccion && entorno.debug ? 'warn' : 'ok',
            detalle: enProduccion && entorno.debug
                ? 'APP_DEBUG activo en producción'
                : `${entorno.app_env}${entorno.debug ? ' · debug' : ''}`,
        },
    ];
};

const EstadoSistemaCard = ({ estado, isLoading, isError, isFetching, onRefresh, actualizadoEn }) => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col gap-4 min-h-[340px] h-full">
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">Estado del Sistema</h2>
            <button
                type="button"
                onClick={onRefresh}
                disabled={isFetching}
                title="Actualizar"
                className="p-2 rounded-xl border border-scout-border text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer disabled:opacity-40"
            >
                <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </button>
        </div>
        <div className="h-px bg-scout-border" />

        {isLoading ? (
            <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse py-4">Verificando...</p>
        ) : isError || !estado ? (
            <p className="text-xs font-bold text-scout-accent uppercase tracking-tight py-4">
                No se pudo consultar el estado del sistema. Si esto pasa seguido, el backend puede estar caído.
            </p>
        ) : (
            <>
                {/* Una línea por chequeo: etiqueta a la izquierda, detalle a la derecha (si es
                    largo, baja a la línea siguiente). Reparte las filas en el alto disponible. */}
                <ul className="flex-1 flex flex-col justify-evenly gap-2">
                    {armarChequeos(estado).map(({ label, nivel, detalle }) => (
                        <li key={label} className="flex items-start gap-3 text-xs">
                            <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${COLOR_NIVEL[nivel]}`} />
                            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
                                <p className="font-bold text-scout-ink uppercase tracking-tight shrink-0">{label}</p>
                                <p className="text-scout-muted text-right leading-snug break-words min-w-0">{detalle}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="text-[10px] text-scout-muted font-medium pt-3 border-t border-scout-border">
                    PHP {estado.entorno.php} · Laravel {estado.entorno.laravel}
                    {estado.entorno.commit ? ` · commit ${estado.entorno.commit}` : ''}
                    {actualizadoEn ? ` · actualizado ${tiempoRelativo(new Date(actualizadoEn).toISOString())}` : ''}
                </p>
            </>
        )}
    </div>
);

export default EstadoSistemaCard;

// src/pages/Dashboard/Panels/Developer/MetricasSistema.jsx
import { Users, UserCheck, MailWarning, FileText } from 'lucide-react';
import MetricCard from '../../../../components/ui/MetricCard';
import { ORDEN_RAMAS } from '../../../../utils/ordenRamas';

const ETIQUETA_ESTADO = { borrador: 'Borrador', enviado: 'En revisión', aprobado: 'Aprobado', rechazado: 'Rechazado' };

const Tarjeta = ({ titulo, children }) => (
    <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-8 shadow-sm flex flex-col gap-5 h-full">
        <h2 className="text-xl font-black uppercase tracking-tight text-left text-scout-primary">{titulo}</h2>
        <div className="h-px bg-scout-border" />
        {children}
    </div>
);

// Fila con barra proporcional: etiqueta, barra y número.
const FilaBarra = ({ label, valor, max }) => (
    <div className="flex items-center gap-3 text-xs">
        <span className="w-32 shrink-0 font-bold text-scout-ink uppercase tracking-tight truncate">{label}</span>
        <div className="flex-1 h-2 rounded-full bg-scout-bg-panel overflow-hidden">
            <div className="h-full rounded-full bg-scout-primary" style={{ width: max > 0 ? `${(valor / max) * 100}%` : '0%' }} />
        </div>
        <span className="w-8 text-right font-black text-scout-primary">{valor}</span>
    </div>
);

const Cargando = () => (
    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse py-4">Cargando...</p>
);

const MetricasSistema = ({ metricas, isLoading, isError }) => {
    if (isError) {
        return (
            <p className="lg:col-span-3 text-xs font-bold text-scout-accent uppercase tracking-tight">
                No se pudieron cargar las métricas.
            </p>
        );
    }

    if (isLoading || !metricas) {
        return <div className="lg:col-span-3"><Cargando /></div>;
    }

    const { usuarios, usuarios_por_rol, programas, grupos } = metricas;

    const maxRol = Math.max(0, ...usuarios_por_rol.map((r) => r.total));
    const ramas = [...programas.por_rama].sort(
        (a, b) => (ORDEN_RAMAS.indexOf(a.rama) + 1 || 99) - (ORDEN_RAMAS.indexOf(b.rama) + 1 || 99)
    );
    const maxRama = Math.max(0, ...ramas.map((r) => r.total));

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
                <MetricCard
                    icon={<Users />}
                    title="Usuarios"
                    value={`${usuarios.total} Registrados`}
                    sub={`${usuarios.activos} activos`}
                    color="border-scout-primary"
                />
                <MetricCard
                    icon={<UserCheck />}
                    title="Pendientes de aprobación"
                    value={`${usuarios.pendientes_de_aprobacion} Cuentas`}
                    sub={`${usuarios.solicitudes_de_rol_pendientes} solicitudes de rol por resolver`}
                    color="border-scout-muted"
                />
                <MetricCard
                    icon={<MailWarning />}
                    title="Sin verificar el correo"
                    value={`${usuarios.sin_verificar_correo} Cuentas`}
                    sub="No pueden ingresar hasta verificarlo"
                    color="border-scout-muted"
                />
                <MetricCard
                    icon={<FileText />}
                    title="Programas"
                    value={`${programas.total} En Sistema`}
                    sub={Object.entries(programas.por_estado)
                        .map(([estado, n]) => `${n} ${ETIQUETA_ESTADO[estado].toLowerCase()}`)
                        .join(' · ')}
                    color="border-scout-border"
                />
            </div>

            {/* Fila propia con items-stretch: las tres tarjetas terminan a la misma altura. */}
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <Tarjeta titulo="Personas por Rol">
                <div className="flex-1 flex flex-col justify-evenly gap-3">
                    {usuarios_por_rol.map((r) => (
                        <FilaBarra key={r.rol} label={r.rol} valor={r.total} max={maxRol} />
                    ))}
                </div>
                <p className="text-[10px] text-scout-muted font-medium">Una persona con varios roles cuenta en cada uno.</p>
            </Tarjeta>

            <Tarjeta titulo="Programas por Rama">
                <div className="flex-1 flex flex-col justify-evenly gap-3">
                    {ramas.map((r) => (
                        <FilaBarra key={r.rama} label={r.rama} valor={r.total} max={maxRama} />
                    ))}
                </div>
            </Tarjeta>

            <Tarjeta titulo="Perfil Público de Grupos">
                <p className="text-xs text-scout-muted">
                    <span className="font-black text-scout-primary">{grupos.con_perfil_completo}</span> de {grupos.total} grupos tienen el perfil completo
                    (descripción, foto, dirección y teléfono).
                </p>
                {grupos.incompletos.length === 0 ? (
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">Todos los grupos están completos.</p>
                ) : (
                    <ul className="flex-1 min-h-0 space-y-3 max-h-56 overflow-y-auto pr-1">
                        {grupos.incompletos.map((g) => (
                            <li key={g.id} className="text-xs">
                                <p className="font-bold text-scout-ink uppercase tracking-tight">{g.nombre}</p>
                                <p className="text-scout-muted leading-snug">Falta: {g.faltan.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Tarjeta>
            </div>
        </>
    );
};

export default MetricasSistema;

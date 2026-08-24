// src/pages/Dashboard/Panels/Usuarios/SolicitudesRolTable.jsx
import React, { useState } from 'react';
import { ClipboardCheck, Check, XCircle } from 'lucide-react';
import { useAuthorizedFetch } from '../../../../hooks/useAuthorizedFetch';
import RechazarProgramaModal from '../../../../components/ui/RechazarProgramaModal';
import { claseColorRol } from './rolColores';

const formatFecha = (fechaIso) => {
    if (!fechaIso) return '—';
    return new Date(fechaIso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const SolicitudesRolTable = ({ solicitudes, isLoading, onCambio }) => {
    const { authorizedFetch } = useAuthorizedFetch();
    const [aprobandoId, setAprobandoId] = useState(null);
    const [rechazandoId, setRechazandoId] = useState(null);
    const [solicitudARechazar, setSolicitudARechazar] = useState(null);
    const [error, setError] = useState(null);

    const handleAprobar = async (solicitud) => {
        setAprobandoId(solicitud.id);
        setError(null);
        try {
            await authorizedFetch(`/solicitudes-rol/${solicitud.id}/aprobar`, { method: 'PATCH' });
            await onCambio?.();
        } catch (err) {
            console.error('Error al aprobar la solicitud:', err);
            setError('No se pudo aprobar la solicitud: ' + err.message);
        } finally {
            setAprobandoId(null);
        }
    };

    const handleRechazar = async (motivo) => {
        const solicitud = solicitudARechazar;
        setRechazandoId(solicitud.id);
        setError(null);
        try {
            await authorizedFetch(`/solicitudes-rol/${solicitud.id}/rechazar`, {
                method: 'PATCH',
                body: { motivo },
            });
            setSolicitudARechazar(null);
            await onCambio?.();
        } catch (err) {
            console.error('Error al rechazar la solicitud:', err);
            setError('No se pudo rechazar la solicitud: ' + err.message);
        } finally {
            setRechazandoId(null);
        }
    };

    return (
        <div className="bg-scout-bg-card rounded-[2rem] border border-scout-border p-6 shadow-sm flex flex-col" style={{ minHeight: 0 }}>
            {error && (
                <div className="mb-4 px-5 py-3 bg-scout-accent-light border border-scout-accent/20 rounded-2xl text-xs font-bold text-scout-accent uppercase tracking-wide shrink-0">
                    {error}
                </div>
            )}
            <h2 className="text-base font-black uppercase tracking-tight text-scout-primary shrink-0">Solicitudes de Rol Pendientes</h2>
            <div className="h-px bg-scout-border shrink-0 mt-3" />

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-4">
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-widest animate-pulse">Cargando solicitudes...</p>
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
                    <div className="w-9 h-9 bg-scout-bg-panel border border-scout-border rounded-xl flex items-center justify-center text-scout-muted"><ClipboardCheck size={16} /></div>
                    <p className="text-xs font-bold text-scout-muted uppercase tracking-tight">No hay solicitudes pendientes</p>
                </div>
            ) : (
                <div className="overflow-x-auto overflow-y-auto mt-4 flex-1" style={{ maxHeight: 220 }}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-scout-border text-[10px] font-black uppercase tracking-widest text-scout-muted">
                                <th className="pb-3 font-black">Usuario</th>
                                <th className="pb-3 font-black">Rol pedido</th>
                                <th className="pb-3 font-black">Rama / Grupo</th>
                                <th className="pb-3 font-black">Fecha</th>
                                <th className="pb-3 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-scout-border">
                            {solicitudes.map((solicitud) => (
                                <tr key={solicitud.id} className="group hover:bg-scout-bg-panel transition-colors">
                                    <td className="py-4 pr-4">
                                        <p className="text-xs font-bold text-scout-ink">{solicitud.user?.nombre_visible || solicitud.user?.name}</p>
                                        <p className="text-[10px] text-scout-muted font-medium">{solicitud.user?.email}</p>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap ${claseColorRol(solicitud.role?.nombre)}`}>
                                            {solicitud.role?.nombre}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">
                                        {[solicitud.rama?.nombre, solicitud.grupo?.nombre].filter(Boolean).join(' / ') || '—'}
                                    </td>
                                    <td className="py-4 pr-4 text-xs text-scout-muted font-medium whitespace-nowrap">{formatFecha(solicitud.created_at)}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleAprobar(solicitud)}
                                                disabled={aprobandoId === solicitud.id}
                                                className="p-1.5 rounded-lg border border-scout-success/30 hover:bg-scout-success/10 text-scout-success transition-colors cursor-pointer disabled:opacity-40"
                                                title="Aprobar solicitud"
                                            >
                                                <Check size={13} />
                                            </button>
                                            <button
                                                onClick={() => setSolicitudARechazar(solicitud)}
                                                disabled={rechazandoId === solicitud.id}
                                                className="p-1.5 rounded-lg border border-scout-accent/30 hover:bg-scout-accent-light text-scout-accent transition-colors cursor-pointer disabled:opacity-40"
                                                title="Rechazar solicitud"
                                            >
                                                <XCircle size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {solicitudARechazar && (
                <RechazarProgramaModal
                    titulo={`${solicitudARechazar.user?.nombre_visible || solicitudARechazar.user?.name} → ${solicitudARechazar.role?.nombre}`}
                    heading="Rechazar Solicitud"
                    mensaje="contale a quien la pidió por qué se rechaza."
                    onConfirm={handleRechazar}
                    onClose={() => setSolicitudARechazar(null)}
                    isSubmitting={rechazandoId === solicitudARechazar.id}
                />
            )}
        </div>
    );
};

export default SolicitudesRolTable;

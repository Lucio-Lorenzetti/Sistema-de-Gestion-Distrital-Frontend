// src/pages/Dashboard/Panels/Programas/ProgramaDetalleModal.jsx
import React from 'react';
import { X, Layers, Users, Tag, MapPin, Wallet, Bus } from 'lucide-react';
import EstadoBadge from '../../../../components/ui/EstadoBadge';

const ESTADO_LABELS = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
};

const TIPO_LABELS = {
    cuatrimestre: 'Programa de Cuatrimestre',
    campamento: 'Campamento / Acantonamiento',
    cfa: 'Campamento Anual',
};

// Overlay del fondo del modal, coloreado según la rama del programa (misma opacidad que el celeste original).
const RAMA_OVERLAY_COLORS = {
    'Castores': '#010101',//'#F97316', // naranja
    'Lobatos': '#010101', //'#FACC15', // amarillo
    'Unidad Scout': '#010101', //'#16A34A', // verde
    'Caminantes': '#010101', //'#00AAF2', // celeste (color original)
    'Rovers': '#010101', //'#DA251C', // rojo
};
const OVERLAY_COLOR_DEFAULT = '#00AAF2';

const hexToRgba = (hex, alpha) => {
    const valor = hex.replace('#', '');
    const r = parseInt(valor.substring(0, 2), 16);
    const g = parseInt(valor.substring(2, 4), 16);
    const b = parseInt(valor.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Lugar/Valor/Transporte no son columnas propias: viven como líneas de texto libre
// dentro de la plantilla generada ("- Lugar: ...", etc). Se extraen del HTML guardado.
const extraerInfoAdicional = (programa) => {
    if (!['campamento', 'cfa'].includes(programa.tipo)) return null;

    const cronograma = programa.cronograma || {};
    let html = '';

    if (Array.isArray(cronograma) || cronograma.dias) {
        const dias = Array.isArray(cronograma) ? cronograma : cronograma.dias || [];
        html = dias[0]?.contenidoHtml || dias[0]?.contenido_html || '';
    } else {
        html = cronograma.contenidoHtml || cronograma.contenido_html || '';
    }

    if (!html) return null;

    // No se puede usar innerText acá: requiere que el nodo esté en el layout renderizado,
    // y este <div> se procesa desconectado del documento. textContent no inserta saltos de
    // línea entre los <div> de cada renglón de la plantilla, así que se reemplazan a mano.
    const texto = html
        .replace(/<\/(div|p|li)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');

    const extraerCampo = (regex) => {
        const match = texto.match(regex);
        const valor = match?.[1]?.trim();
        return valor || null;
    };

    const lugar = extraerCampo(/^-\s*Lugar:\s*(.*)$/im);
    const valor = extraerCampo(/^-\s*Valor:\s*(.*)$/im);
    const transporte = extraerCampo(/^-\s*Transporte[^:]*:\s*(.*)$/im);

    if (!lugar && !valor && !transporte) return null;
    return { lugar, valor, transporte };
};

const ProgramaDetalleModal = ({ programa, onClose }) => {
    const overlayColor = RAMA_OVERLAY_COLORS[programa.rama?.nombre] || OVERLAY_COLOR_DEFAULT;
    const infoAdicional = extraerInfoAdicional(programa);

    return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
        <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: hexToRgba(overlayColor, 0.6) }}
            onClick={onClose}
        />
        <div className="relative bg-scout-bg-card w-full max-w-3xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-scout-primary text-white rounded-full hover:scale-110 transition-transform">
                <X size={20} />
            </button>
            <div className="p-8 md:p-16 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <EstadoBadge estado={ESTADO_LABELS[programa.estado] || programa.estado} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                        <Layers size={11} /> {programa.rama?.nombre || '—'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                        <Users size={11} /> {programa.grupo?.nombre || '—'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-scout-muted flex items-center gap-1">
                        <Tag size={11} /> {TIPO_LABELS[programa.tipo] || programa.tipo || '—'}
                    </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-6 text-scout-ink text-left">
                    {programa.titulo}
                </h2>
                {infoAdicional && (
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-scout-bg-panel border border-scout-border">
                            <MapPin size={14} className="text-scout-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-scout-muted">Lugar</p>
                                <p className="text-xs font-bold text-scout-ink">{infoAdicional.lugar || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-scout-bg-panel border border-scout-border">
                            <Wallet size={14} className="text-scout-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-scout-muted">Valor</p>
                                <p className="text-xs font-bold text-scout-ink">{infoAdicional.valor || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-scout-bg-panel border border-scout-border">
                            <Bus size={14} className="text-scout-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-scout-muted">Transporte</p>
                                <p className="text-xs font-bold text-scout-ink">{infoAdicional.transporte || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {programa.diagnostico && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Diagnóstico</h3>
                        <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programa.diagnostico}</p>
                    </div>
                )}
                {programa.objetivos && (
                    <div className="mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-scout-muted mb-2">Objetivos</h3>
                        <p className="text-sm text-scout-muted leading-relaxed whitespace-pre-line">{programa.objetivos}</p>
                    </div>
                )}
                <p className="text-[10px] font-black uppercase tracking-widest text-scout-muted">
                    Autor: <span className="text-scout-ink">{programa.owner?.name || 'Sin asignar'}</span>
                </p>
            </div>
        </div>
    </div>
    );
};

export default ProgramaDetalleModal;
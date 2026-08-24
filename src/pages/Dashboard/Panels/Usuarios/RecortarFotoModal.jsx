// src/pages/Dashboard/Panels/Usuarios/RecortarFotoModal.jsx
// Antes de subir la foto de perfil: arrastrar/zoom para elegir qué parte de la
// imagen queda dentro del círculo, y de paso la redimensiona — una foto de
// cámara de 8-10MB sale de acá como un JPEG de unos cientos de KB, así que en
// la práctica deja de chocar con el límite de tamaño del backend.
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn } from 'lucide-react';

const TAMANIO_SALIDA = 512; // px, cuadrado — coincide con el avatar circular

const cargarImagen = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = src;
    });

// Recorta el área elegida y la reescala a TAMANIO_SALIDA x TAMANIO_SALIDA.
const recortarABlob = async (imageSrc, areaRecortePx) => {
    const imagen = await cargarImagen(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = TAMANIO_SALIDA;
    canvas.height = TAMANIO_SALIDA;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        imagen,
        areaRecortePx.x,
        areaRecortePx.y,
        areaRecortePx.width,
        areaRecortePx.height,
        0,
        0,
        TAMANIO_SALIDA,
        TAMANIO_SALIDA
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen recortada'))),
            'image/jpeg',
            0.85
        );
    });
};

const RecortarFotoModal = ({ imageSrc, onCancel, onConfirmar }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaRecortePx, setAreaRecortePx] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState(null);

    const handleCropComplete = useCallback((_areaRecortePorcentaje, areaPx) => {
        setAreaRecortePx(areaPx);
    }, []);

    const handleConfirmar = async () => {
        if (!areaRecortePx) return;
        setError(null);
        setProcesando(true);
        try {
            const blob = await recortarABlob(imageSrc, areaRecortePx);
            await onConfirmar(blob);
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-scout-bg-card w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-scout-border animate-in zoom-in-95 duration-200">
                <button onClick={onCancel} className="absolute top-5 right-5 z-10 p-1.5 rounded-full text-scout-muted hover:text-scout-primary hover:bg-scout-bg-panel transition-colors cursor-pointer">
                    <X size={16} />
                </button>

                <h2 className="text-sm font-black uppercase tracking-widest text-scout-ink mb-1">Ajustar foto de perfil</h2>
                <p className="text-xs text-scout-muted font-medium mb-4">Arrastrá para mover, deslizá para hacer zoom.</p>

                {error && (
                    <div className="mb-3 px-4 py-3 bg-scout-accent-light border border-scout-accent/20 rounded-xl text-xs font-bold text-scout-accent">
                        {error}
                    </div>
                )}

                <div className="relative w-full rounded-2xl overflow-hidden bg-scout-bg-panel" style={{ height: 320 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <ZoomIn size={14} className="text-scout-muted shrink-0" />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-scout-primary cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 mt-5">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-scout-muted hover:text-scout-primary transition-colors cursor-pointer">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmar}
                        disabled={procesando || !areaRecortePx}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-scout-primary text-white hover:bg-scout-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
                    >
                        <Check size={13} /> {procesando ? 'Guardando...' : 'Guardar foto'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecortarFotoModal;

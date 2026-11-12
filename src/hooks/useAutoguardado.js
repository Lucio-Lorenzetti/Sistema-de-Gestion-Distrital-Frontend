// src/hooks/useAutoguardado.js
//
// Autoguardado de borradores de los formularios de creación (programas,
// noticias, cursos y biblioteca). Guarda en localStorage de ESTE navegador —
// no hay borrador en el servidor — así que no hace falta tocar el backend.
//
// Uso típico:
//   const [borrador] = useState(() => leerBorrador('noticia'));
//   const [form, setForm] = useState(() => ({ ...valoresPorDefecto, ...borrador?.datos }));
//   const aviso = useAutoguardado({ clave: 'noticia', datos: form, borrador, tieneContenido });
//   ...al guardar de verdad:  aviso.limpiar();
//   ...en el JSX:             <AvisoAutoguardado {...aviso} />
//
// Los archivos (imágenes, PDFs) no se pueden guardar acá: hay que volver a elegirlos.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const PREFIJO = 'autosave:v1';
const VIGENCIA_MS = 30 * 24 * 60 * 60 * 1000; // un borrador de más de 30 días se descarta
const RETRASO_MS = 800;

// Una clave por usuario: en una compu compartida cada uno ve solo lo suyo.
const claveStorage = (clave) => `${PREFIJO}:${useAuthStore.getState().user?.id ?? 'anon'}:${clave}`;

export const leerBorrador = (clave) => {
    try {
        const k = claveStorage(clave);
        const raw = localStorage.getItem(k);
        if (!raw) return null;
        const borrador = JSON.parse(raw);
        if (!borrador?.datos || Date.now() - borrador.guardadoEn > VIGENCIA_MS) {
            localStorage.removeItem(k);
            return null;
        }
        return borrador; // { datos, guardadoEn }
    } catch {
        return null;
    }
};

export const borrarBorrador = (clave) => {
    try {
        localStorage.removeItem(claveStorage(clave));
    } catch {
        /* storage bloqueado: no hay nada que borrar */
    }
};

export const useAutoguardado = ({ clave, datos, borrador = null, tieneContenido }) => {
    const serial = JSON.stringify(datos);
    const inicial = useRef(serial);
    const tocado = useRef(false);
    const pendiente = useRef(null);
    const cerrado = useRef(false);
    const tieneRef = useRef(tieneContenido);
    const [guardadoEn, setGuardadoEn] = useState(borrador?.guardadoEn ?? null);

    useEffect(() => {
        tieneRef.current = tieneContenido;
    });

    // Escribe lo pendiente. `notificar` = actualizar el "guardado hace…" (no se
    // hace al desmontar ni al ocultar la pestaña, donde ya no importa).
    const flush = useCallback((notificar) => {
        if (cerrado.current || pendiente.current === null) return;
        const crudo = pendiente.current;
        pendiente.current = null;
        try {
            const datosAGuardar = JSON.parse(crudo);
            const k = claveStorage(clave);
            if (!tieneRef.current(datosAGuardar)) {
                // El usuario vació todo: no dejamos un borrador en blanco.
                localStorage.removeItem(k);
                if (notificar) setGuardadoEn(null);
                return;
            }
            const ahora = Date.now();
            localStorage.setItem(k, JSON.stringify({ datos: datosAGuardar, guardadoEn: ahora }));
            if (notificar) setGuardadoEn(ahora);
        } catch {
            // Storage lleno o bloqueado (modo privado): el borrador es un extra,
            // nunca tiene que impedir completar el formulario.
        }
    }, [clave]);

    // Cada cambio de datos reprograma el guardado (debounce).
    useEffect(() => {
        if (!tocado.current && serial === inicial.current) return; // todavía no se tocó nada
        tocado.current = true;
        pendiente.current = serial;
        const timer = setTimeout(() => flush(true), RETRASO_MS);
        return () => clearTimeout(timer);
    }, [serial, flush]);

    // Si se cierra o se oculta la pestaña (p. ej. el celular pasa a otra app)
    // o se sale de la pantalla, no se pierde lo que estaba en el debounce.
    useEffect(() => {
        const alOcultar = () => {
            if (document.visibilityState === 'hidden') flush(false);
        };
        const alSalir = () => flush(false);
        document.addEventListener('visibilitychange', alOcultar);
        window.addEventListener('pagehide', alSalir);
        return () => {
            document.removeEventListener('visibilitychange', alOcultar);
            window.removeEventListener('pagehide', alSalir);
            flush(false);
        };
    }, [flush]);

    // Llamar cuando el contenido ya se guardó de verdad en el servidor.
    const limpiar = useCallback(() => {
        cerrado.current = true;
        pendiente.current = null;
        borrarBorrador(clave);
    }, [clave]);

    // "Empezar de cero": borra el borrador y recarga la pantalla con los valores por defecto.
    const descartar = useCallback(() => {
        limpiar();
        window.location.reload();
    }, [limpiar]);

    return { restaurado: Boolean(borrador), restauradoEn: borrador?.guardadoEn ?? null, guardadoEn, limpiar, descartar };
};

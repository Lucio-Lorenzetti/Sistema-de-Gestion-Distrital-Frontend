// src/utils/mensajeDeError.js
//
// Convierte un error de axios en un texto que se entienda en pantalla.
// Laravel devuelve cosas como "Server Error" o "The titulo field is required.
// (and 2 more errors)", que no le dicen nada a quien está cargando un formulario.
//
//   catch (err) { setError(mensajeDeError(err, 'No se pudo guardar el curso.')); }
export const mensajeDeError = (err, porDefecto = 'Ocurrió un error inesperado.') => {
    const respuesta = err?.response;

    // Sin respuesta: nunca llegó al servidor (sin internet, servidor caído, CORS).
    if (!respuesta) {
        return 'No pudimos conectarnos con el servidor. Revisá tu conexión a internet y volvé a intentar.';
    }

    const { status, data } = respuesta;

    // Validación del back (422): el primer error ya viene redactado en español.
    if (status === 422 && data?.errors) {
        const primero = Object.values(data.errors).flat()[0];
        if (primero) return primero;
    }

    if (status === 403) return 'No tenés permiso para hacer esto.';
    if (status === 413) return 'El archivo es demasiado grande.';
    if (status >= 500) {
        return 'Falló algo en el servidor. Probá de nuevo en unos minutos y, si sigue pasando, avisale al Developer.';
    }

    return data?.message || porDefecto;
};

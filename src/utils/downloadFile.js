export const downloadFile = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo descargar el archivo');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error('Error al descargar:', err);
        alert('No se pudo descargar el archivo. Intentá de nuevo.');
    }
};

export const buildFilename = (nombre, url) => {
    const ext = url?.split('.').pop()?.split('?')[0] || 'pdf';
    const safeName = nombre?.trim().replace(/[^\w\sáéíóúÁÉÍÓÚñÑ-]/g, '') || 'documento';
    return `${safeName}.${ext}`;
};
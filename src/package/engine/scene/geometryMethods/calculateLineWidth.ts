export function calculateLineWidth (lineWidth: number, ignoreZoom = false) {
    if (ignoreZoom) {
        return lineWidth;
    }

    return lineWidth / this.camera.zoom;
}

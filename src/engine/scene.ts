export class Scene {
    canvas: HTMLCanvasElement;

    constructor (rootElement: Element) {
        const canvas = document.createElement("canvas");

        const rootWidth = rootElement.clientWidth;
        const rootHeight = rootElement.clientHeight;

        canvas.width = rootWidth;
        canvas.height = rootHeight;

        this.canvas = canvas;

        rootElement.appendChild(canvas);
    }
}

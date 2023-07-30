import { point2D } from "./types";


const DEFAULT_ZOOM_STEP = 0.8;
const MAX_ZOOM = 1000;
const MIN_ZOOM = 0.001;

export class Camera {
    private __realZoom = 0;
    public position: point2D;


    constructor () {
        this.zoom = 1;
        this.position = { x: 0, y: 0 };
    }


    public translateX(n: number) {
        this.position.x = this.position.x + n;
    }

    public translateY(n: number) {
        this.position.y = this.position.y + n;
    }

    get zoom() {
        return this.__realZoom;
    }

    set zoom(value) {
        if (typeof value !== "number" || Number.isNaN(value)) return ;

        let newZoom = value;

        if (newZoom > MAX_ZOOM) {
            newZoom = MAX_ZOOM;
        }

        if (newZoom < MIN_ZOOM) {
            newZoom = MIN_ZOOM;
        }

        this.__realZoom = newZoom;
    }

    public zoomIn() {
        this.zoom = this.zoom * DEFAULT_ZOOM_STEP;
    }

    public zoomOut() {
        this.zoom = this.zoom / DEFAULT_ZOOM_STEP;
    }
}

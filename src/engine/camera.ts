import { Scene } from "./scene";
import { point2D } from "./types";


const DEFAULT_ZOOM_STEP = 0.97;
const MAX_ZOOM = 1000000;
const MIN_ZOOM = 0.00000001;

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

    public zoomIn(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom * value;
    }

    public zoomOut(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom / value;
    }

    public getVisibleBoundaries (scene: Scene) {
        const centerX = this.position.x;
        const centerY = this.position.y;

        return {
            leftBoundary: centerX - (scene.width / 2) * this.zoom,
            rightBoundary: centerX + (scene.width / 2) * this.zoom,
            topBoundary: centerY + (scene.height / 2) * this.zoom,
            bottomBoundary: centerY - (scene.height / 2) * this.zoom,
        };
    }
}

import { point2D } from "./types";

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

        this.__realZoom = value;
    }
}

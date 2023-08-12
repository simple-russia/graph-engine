import { BoundingBox } from "./basicObjects/types";
import { Scene } from "./scene/scene";
import { point2D } from "./types";


const DEFAULT_ZOOM_STEP = 0.97;
const MAX_ZOOM = 1000000;
const MIN_ZOOM = 0.00000001;

export class Camera {
    private __realZoom = 1;
    public position: point2D = { x: 0, y: 0 };

    // TODO fix initial bounding
    private viewBoundingBox: BoundingBox = { max: { x: 10, y: 10 }, min: { x: 0, y: 0 } };

    public scene: Scene;


    constructor () {
        this.zoom = 1;
        this.position = { x: 0, y: 0 };
    }


    public translateX(n: number) {
        // TODO move to observable
        this.computeViewBoundingBox();
        this.position.x = this.position.x + n;
    }

    public translateY(n: number) {
        this.computeViewBoundingBox();
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

        this.computeViewBoundingBox();
    }

    onAddedToScene (scene: Scene) {
        this.scene = scene;
        this.computeViewBoundingBox();
    }

    public zoomIn(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom * value;
    }

    public zoomOut(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom / value;
    }

    public getVisibleBoundaries () {
        const bbox = this.getViewBoundingBox();

        return {
            leftBoundary: bbox.min.x,
            rightBoundary: bbox.max.x,
            topBoundary: bbox.max.y,
            bottomBoundary: bbox.min.y,
        };
    }

    public getViewBoundingBox () {
        return this.viewBoundingBox;
    }

    public computeViewBoundingBox () {
        if (!this.scene) {
            return ;
        }

        const OFFSET = 0 * this.zoom;

        const centerX = this.position.x;
        const centerY = this.position.y;
        const width = this.scene.width;
        const height = this.scene.height;

        const leftBoundary = centerX - (width / 2) * this.zoom;
        const rightBoundary = centerX + (width / 2) * this.zoom;
        const bottomBoundary = centerY - (height / 2) * this.zoom;
        const topBoundary = centerY + (height / 2) * this.zoom;

        this.viewBoundingBox = {
            max: {
                x: rightBoundary - OFFSET,
                y: topBoundary - OFFSET,
            },
            min: {
                x: leftBoundary + OFFSET,
                y: bottomBoundary + OFFSET,
            }
        };
    }
}

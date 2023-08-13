import { createPositionObservable } from "../utils/observables/position";
import { BoundingBox } from "./basicObjects/types";
import { Scene } from "./scene/scene";
import { point2D } from "./types";


const DEFAULT_ZOOM_STEP = 0.97;
const MIN_ZOOM = 10000000;
const MAX_ZOOM = 0.0000001;

export class Camera {
    public position: point2D = createPositionObservable({
        onUpdate: this.computeViewBoundingBox.bind(this)
    });

    public scene: Scene;
    private __realZoom = 1;

    // TODO fix initial bounding
    private viewBoundingBox: BoundingBox = { max: { x: 10, y: 10 }, min: { x: 0, y: 0 } };
    public boundingBoxViewOffset: number;




    constructor () {
        this.zoom = 1;
        this.boundingBoxViewOffset = 50;
    }




    onAddedToScene (scene: Scene) {
        this.scene = scene;

        this.computeViewBoundingBox();

        function canvasResizeCameraCallback () {
            this.computeViewBoundingBox();
        }

        scene.eventHandler.subscribe("canvasResize", canvasResizeCameraCallback.bind(this));
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

        if (newZoom > MIN_ZOOM) {
            newZoom = MIN_ZOOM;
        }

        if (newZoom < MAX_ZOOM) {
            newZoom = MAX_ZOOM;
        }

        this.__realZoom = newZoom;

        this.computeViewBoundingBox();
    }

    public zoomIn(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom / value;
    }
    public zoomOut(value=DEFAULT_ZOOM_STEP) {
        this.zoom = this.zoom * value;
    }


    // Getting camera boundaries in scene's pixels
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

    // Getting camera viewbox in CSS pixels
    public getCanvasViewbox () {
        const bbox = this.getViewBoundingBox();

        const pointMax = this.scene.map2DPointToCanvas(bbox.max);
        const pointMin = this.scene.map2DPointToCanvas(bbox.min);

        return {
            max: { x: pointMax.x, y: pointMin.y },
            min: { x: pointMin.x, y: pointMax.y },
        };
    }

    // Computed camera's bounding viewbox (in scene's pixels)
    public computeViewBoundingBox () {
        if (!this.scene) {
            return ;
        }

        // Viewbox padding, where OFFSET is in scene pixels, boundingBoxViewOffsset in CSS pixels
        const OFFSET = this.scene.translateToSceneLength(this.boundingBoxViewOffset);

        const centerX = this.position.x;
        const centerY = this.position.y;
        const width = this.scene.width;
        const height = this.scene.height;

        // TODO use scene methods
        const leftBoundary = centerX - (width / 2) / this.zoom;
        const rightBoundary = centerX + (width / 2) / this.zoom;
        const bottomBoundary = centerY - (height / 2) / this.zoom;
        const topBoundary = centerY + (height / 2) / this.zoom;

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

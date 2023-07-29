import { Scene } from "../scene";

const enum MouseButtons {
    LEFT = 0,
    WHEEL = 1,
    RIGHT = 2,
}

export class CameraControls {
    public isObject2D = false;
    public scene: Scene;
    public mouseDragButton: MouseButtons;

    private isMouseDown = false;

    private onWheel: (e: WheelEvent) => void;
    private onMouseMove: (e: MouseEvent) => void;
    private onMouseDown: (e: MouseEvent) => void;
    private onMouseUp: (e: MouseEvent) => void;


    constructor (scene: Scene) {
        this.scene = scene;
        this.mouseDragButton = MouseButtons.RIGHT;

        this.startWheelZoom();
        this.startMouseDrag();
    }


    private startWheelZoom () {
        this.onWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                this.scene.camera.zoomOut();
            } else {
                this.scene.camera.zoomIn();
            }
        };

        this.scene.canvas.addEventListener("wheel", this.onWheel);
    }

    private startMouseDrag () {
        this.onMouseDown = (e) => {
            if (e.button === this.mouseDragButton) {
                this.isMouseDown = true;
            }
        };

        this.onMouseUp = (e) => {
            if (e.button === this.mouseDragButton) {
                this.isMouseDown = false;
            }
        };

        this.onMouseMove = (e) => {
            if (this.isMouseDown) {
                const camera = this.scene.camera;

                camera.translateX(-e.movementX * camera.zoom);
                camera.translateY(e.movementY * camera.zoom);
            }
        };

        this.scene.canvas.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
    }
}

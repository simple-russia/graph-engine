import { color } from "../utils/color";
import { Object2D } from "./basicObjects/object2d";
import { Camera } from "./camera";
import { EventHandler } from "./events/eventsHandler";
import { point2D } from "./types";

export class Scene {
    public canvas: HTMLCanvasElement;
    public bgColor = 0x00FF00;
    public readonly width: number;
    public readonly height: number;
    public camera: Camera;
    public isRunning = false;

    private maxFps = 30;
    private renderIntervalId: number;
    private objectsRendered = 0;

    public children: Object2D[];

    private currentFramesCount = 0;

    public eventHandler: EventHandler;


    constructor (rootElement: Element) {
        const canvas = document.createElement("canvas");

        const rootWidth = rootElement.clientWidth;
        const rootHeight = rootElement.clientHeight;

        canvas.width = rootWidth;
        canvas.height = rootHeight;

        this.canvas = canvas;
        this.width = rootWidth;
        this.height = rootHeight;

        this.camera = new Camera();
        this.camera.scene = this;

        this.children = [];

        rootElement.appendChild(canvas);

        this.preventContextMenu();
        this.fpsMeasure();

        this.eventHandler = new EventHandler(["render", "fpsUpdate"]);
    }


    start () {
        if (this.isRunning) throw new Error("Scene is already running");

        const frame_time = 1000 / this.maxFps;

        this.renderIntervalId = window.setInterval(() => {
            queueMicrotask(this.render.bind(this));
        }, frame_time);

        this.isRunning = true;
    }

    stop () {
        clearInterval(this.renderIntervalId);
        this.isRunning = false;
    }

    restart () {
        this.stop();
        this.start();
    }

    get fps() {
        return this.maxFps;
    }

    set fps(newFps) {
        if (this.maxFps === newFps) return ;
        if (typeof newFps !== "number") throw new Error(`FPS must be Number, instead got ${typeof newFps}`);
        if (Number.isNaN(newFps)) throw new Error("Scene FPS cannot be NaN");
        if (!Number.isInteger(newFps)) throw new Error(`FPS must be an integer. Instead got ${newFps}`);

        this.maxFps = newFps;

        if (this.isRunning) {
            this.restart();
        }
    }

    render () {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        let objectsRendered = 0;

        const fillStyle = color(this.bgColor);
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, this.width, this.height);


        this.children.forEach(object2d => {
            if (this.objectSeen(object2d)) {
                object2d.render(this);
                objectsRendered++;
            }
        });

        this.currentFramesCount += 1;
        this.objectsRendered = objectsRendered;
        this.eventHandler.emit("render");
    }

    add (object2d: Object2D) {
        if (this.children.includes(object2d)) return ;

        this.children.push(object2d);

        if (object2d.onAddedToScene) {
            object2d.onAddedToScene(this);
        }

    }

    remove (object2d: Object2D) {
        this.children = this.children.filter(obj => obj !== object2d);

        if (object2d.onRemovedFromScene) {
            object2d.onRemovedFromScene(this);
        }
    }

    private preventContextMenu () {
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    }

    private fpsMeasure () {
        setInterval(() => {
            this.eventHandler.emit("fpsUpdate", { fps: this.currentFramesCount, obj: this.objectsRendered });

            this.currentFramesCount = 0;
        }, 1000);
    }


    map2DPointToCanvas (point: point2D): point2D {
        let pointX = point.x;
        let pointY = point.y;

        pointY *= -1;

        pointX = pointX / this.camera.zoom;
        pointY = pointY / this.camera.zoom;

        pointX += this.width / 2;
        pointY += this.height / 2;

        pointX += -this.camera.position.x / this.camera.zoom;
        pointY += this.camera.position.y / this.camera.zoom;

        return {
            x: pointX,
            y: pointY,
        };
    }

    getLineWidth (lineWidth: number, ignoreZoom = false) {
        if (ignoreZoom) {
            return lineWidth;
        }

        return lineWidth / this.camera.zoom;
    }


    objectSeen (object: Object2D) {
        const boundingBox = object.getBoundingBox();
        const viewBox = this.camera.getViewBoundingBox();

        if (boundingBox === undefined || boundingBox === null) {
            return true;
        }

        if (!viewBox || boundingBox.max.x < viewBox.min.x || boundingBox.min.x > viewBox.max.x) {
            // console.log(boundingBox.min.x, boundingBox.max.x);
            return false;
        }

        if (boundingBox.max.y < viewBox.min.y || boundingBox.min.y > viewBox.max.y) {
            return false ;
        }

        return true;
    }
}

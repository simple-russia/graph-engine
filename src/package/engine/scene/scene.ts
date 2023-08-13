import { color } from "../../utils/color";
import { Object2D } from "../basicObjects/object2d";
import { Camera } from "../camera";
import { EventHandler } from "../events/eventsHandler";
import { getCanvasPixelSize } from "./geometryMethods/getCanvasPixelSize";
import { calculateLineWidth } from "./geometryMethods/calculateLineWidth";
import { getObjectToPixelRatio } from "./geometryMethods/getObjectToPixelRatio";
import { map2DPointToCanvas } from "./geometryMethods/map2DPointToCanvas";
import { objectSeen } from "./geometryMethods/objectSeen";
import { translateToCanvasLength } from "./geometryMethods/translateToCanvasLength";
import { translateToSceneLength } from "./geometryMethods/translateTpSceneLength";
import { addToScene } from "./generalMethods/addToScene";
import { recomputeObjectRenderPosition } from "./generalMethods/recomputeObjectRenderPosition";
import { removeFromScene } from "./generalMethods/removeFromScene";



export class Scene {
    public canvas: HTMLCanvasElement;
    public children: Object2D[];
    public eventHandler: EventHandler;
    public camera: Camera;

    public bgColor = 0x00FF00;
    public width: number;
    public height: number;
    public isRenderCycleRunning = false;

    private maxFps = 30;
    private renderIntervalId: number;
    private objectsRendered = 0;
    private currentFramesCount = 0;




    constructor (rootElement: Element) {
        const canvas = document.createElement("canvas");
        this.eventHandler = new EventHandler(["render", "fpsUpdate", "canvasResize"]);

        const rootWidth = rootElement.clientWidth;
        const rootHeight = rootElement.clientHeight;

        canvas.width = rootWidth;
        canvas.height = rootHeight;

        this.canvas = canvas;
        this.width = rootWidth;
        this.height = rootHeight;

        this.camera = new Camera();
        this.camera.onAddedToScene(this);

        this.children = [];

        rootElement.appendChild(canvas);

        this.preventContextMenu(); // Start preventing context menu
        this.fpsMeasure(); // Start measuring fps


        // Start observing parent's resizing
        function resizeCallback () {
            this.eventHandler.emit("canvasResize");
            this.computeCanvasDimensions();
        }
        const sizeObserver = new ResizeObserver(resizeCallback.bind(this));
        sizeObserver.observe(this.canvas.parentElement);
    }




    // Synchronously render whole scene once
    render () {
        const viewbox = this.camera.getCanvasViewbox();
        const ctx = this.canvas.getContext("2d");

        ctx.clearRect(0, 0, this.width, this.height);
        let objectsRendered = 0;

        const fillStyle = color(this.bgColor);
        ctx.fillStyle = fillStyle;
        ctx.fillRect(viewbox.min.x, viewbox.min.y, viewbox.max.x - viewbox.min.x, viewbox.max.y - viewbox.min.y);


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

    // Start constant rerender cycle
    start () {
        if (this.isRenderCycleRunning) throw new Error("Scene is already running");

        const frame_time = 1000 / this.maxFps;

        this.renderIntervalId = window.setInterval(() => {
            queueMicrotask(this.render.bind(this));
        }, frame_time);

        this.isRenderCycleRunning = true;
    }

    // Stop active running rerender cycle
    stop () {
        clearInterval(this.renderIntervalId);
        this.isRenderCycleRunning = false;
    }

    // Restart rerender cycle
    restart () {
        this.stop();
        this.start();
    }


    // Max scene fps setting getter
    get fps() {
        return this.maxFps;
    }

    // Max scene fps setting etter
    set fps(newFps) {
        if (this.maxFps === newFps) return ;
        if (typeof newFps !== "number") throw new Error(`FPS must be Number, instead got ${typeof newFps}`);
        if (Number.isNaN(newFps)) throw new Error("Scene FPS cannot be NaN");
        if (!Number.isInteger(newFps)) throw new Error(`FPS must be an integer. Instead got ${newFps}`);

        this.maxFps = newFps;

        if (this.isRenderCycleRunning) {
            this.restart();
        }
    }

    // General scene methods
    add = addToScene; // Add an object to scene
    recomputeObjectRenderPosition = recomputeObjectRenderPosition; // Recompute child's position in the children list based on its renderPriority
    remove = removeFromScene; // Remove an object from scene


    private preventContextMenu () {
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    }

    // Constant emitting of fps update event (every second)
    private fpsMeasure () {
        setInterval(() => {
            this.eventHandler.emit("fpsUpdate", { fps: this.currentFramesCount, obj: this.objectsRendered });

            this.currentFramesCount = 0;
        }, 1000);
    }

    // For resize callback
    computeCanvasDimensions () {
        const cont = this.canvas.parentElement;

        this.canvas.width = cont.clientWidth;
        this.canvas.height = cont.clientHeight;
        this.width = cont.clientWidth;
        this.height = cont.clientHeight;

        this.render();
    }


    // Geometry-related canvas methods
    map2DPointToCanvas = map2DPointToCanvas;
    getCanvasPixelSize = getCanvasPixelSize;

    getLineWidth = calculateLineWidth;
    translateToCanvasLength = translateToCanvasLength;
    translateToSceneLength = translateToSceneLength;

    objectSeen = objectSeen;
    getObjectToPixelRatio = getObjectToPixelRatio;
}

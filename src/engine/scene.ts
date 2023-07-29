import { color } from "../utils/color";
import { Object2D } from "./basicObjects/object2d";
import { Camera } from "./camera";

export class Scene {
    public canvas: HTMLCanvasElement;
    public bgColor = 0x00FF00;
    public readonly width: number;
    public readonly height: number;
    public camera: Camera;
    public isRunning = false;

    private maxFps = 30;
    private renderIntervalId: number;

    public children: Object2D[];

    public onRender?: () => void;


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

        this.children = [];

        rootElement.appendChild(canvas);

        this.preventContextMenu();
    }


    start () {
        if (this.isRunning) throw new Error("Scene is already running");

        const frame_time = 1000 / this.maxFps;

        this.renderIntervalId = window.setInterval(() => {
            this.render();
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

        const fillStyle = color(this.bgColor);
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, this.width, this.height);


        this.children.forEach(object2d => {
            object2d.render(this);
        });
    }

    add (object2d: Object2D) {
        this.children.push(object2d);
    }

    remove (object2d: Object2D) {
        this.children = this.children.filter(obj => obj !== object2d);
    }

    private preventContextMenu () {
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    }
}

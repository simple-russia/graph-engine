import { color } from "../../utils/color";
import { Scene } from "../scene";
import { point2D } from "../types";
import { Object2D } from "./object2d";



export class BeizerCurve extends Object2D {
    public point1: point2D;
    public point2: point2D;
    public lineWidth: number;
    public color: number;


    constructor(point1: point2D, point2: point2D, lineWidth = 1, color = 0x000000) {
        super();
        this.point1 = point1;
        this.point2 = point2;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    render (scene: Scene) {
        const ctx = scene.canvas.getContext("2d");
        const camera = scene.camera;

        ctx.lineWidth = this.lineWidth * 1 / camera.zoom;
        ctx.fillStyle = color(this.color);

        const p1: point2D = { ...this.point1 };
        const p2: point2D = { ...this.point2 };


    }
}

import type { point2D } from "../types";
import { Scene } from "../scene";
import { Object2D } from "./object2d";
import { color } from "../../utils/color";



export class Line extends Object2D {
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

        p1.y *= -1;
        p2.y *= -1;

        p1.x *= 1 / camera.zoom;
        p1.y *= 1 / camera.zoom;
        p2.x *= 1 / camera.zoom;
        p2.y *= 1 / camera.zoom;

        p1.x += scene.width / 2;
        p1.y += scene.height / 2;
        p2.x += scene.width / 2;
        p2.y += scene.height / 2;

        p1.x += -scene.camera.position.x * 1 / camera.zoom;
        p1.y += scene.camera.position.y * 1 / camera.zoom;
        p2.x += -scene.camera.position.x * 1 / camera.zoom;
        p2.y += scene.camera.position.y * 1 / camera.zoom;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
    }
}

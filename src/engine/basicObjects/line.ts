import type { point2D } from "../types";
import { Scene } from "../scene";
import { Object2D } from "./object2d";
import { color } from "../../utils/color";
import { COLORS } from "../../utils/colors";
import { restrictNumber } from "../../utils/restrictNumber";


interface ILineOptions {
    lineWidth: number;
    color: number;
    opacity: number;
    ignoreZoom: boolean;
}

const LINE_DEFAULT_OPTIONS: ILineOptions = {
    lineWidth: 1,
    color: COLORS.BLACK,
    ignoreZoom: false,
    opacity: 1,
};

export class Line extends Object2D {
    public point1: point2D;
    public point2: point2D;
    public lineWidth: number;
    public color: number;
    public ignoreZoom: boolean;
    public opacity: number;


    constructor(point1: point2D, point2: point2D, options?: Partial<ILineOptions>) {
        super();
        options = Object.assign({ ...LINE_DEFAULT_OPTIONS }, options);
        this.point1 = point1;
        this.point2 = point2;
        this.color = options.color;
        this.lineWidth = options.lineWidth;
        this.ignoreZoom = options.ignoreZoom;
        this.opacity = restrictNumber(options.opacity, 0, 1);
    }

    render (scene: Scene) {
        const ctx = scene.canvas.getContext("2d");
        const camera = scene.camera;

        ctx.lineWidth = this.lineWidth * (this.ignoreZoom ? 1 : 1 / camera.zoom);
        ctx.strokeStyle = color(this.color, this.opacity);

        const p1: point2D = scene.map2DPointToCanvas({ ...this.point1 });
        const p2: point2D = scene.map2DPointToCanvas({ ...this.point2 });

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
    }
}

import { color } from "../../../utils/color";
import { Scene } from "../../scene";
import { Object2D } from "../object2d";
import { IPolylinePrimitiveArgs, PolylinePrimitivePoint } from "./types";


const DEFAULT_POLYLINE_OPTIONS: IPolylinePrimitiveArgs = {
    bgColor: null,
    strokeColor: null,
    ignoreZoom: false,
    lineWidth: 1,
    points: [],
};


export class PolylinePrimitive extends Object2D {
    public lineWidth: number;
    public strokeColor: number | null;
    public bgColor: number | null;
    public points: PolylinePrimitivePoint[];
    public ignoreZoom: boolean;


    constructor(options: Partial<IPolylinePrimitiveArgs> = {}) {
        options = { ...DEFAULT_POLYLINE_OPTIONS, ...options };
        super();

        this.bgColor = options.bgColor;
        this.strokeColor = options.strokeColor;
        this.lineWidth = options.lineWidth;
        this.points = options.points;
        this.ignoreZoom = options.ignoreZoom;
    }


    render (scene: Scene) {
        if (this.points.length === 0) {
            // Nothing to draw
            return ;
        }
        const ctx = scene.canvas.getContext("2d");
        const camera = scene.camera;
        const points = this.points;

        const start = scene.map2DPointToCanvas({ ...points[0] });

        ctx.lineWidth = this.lineWidth * 1 / camera.zoom;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);


        for (const point of points.slice(1)) {
            const pointType = (point.cp1x !== null) ? "beizer" : "regular";

            // draw point
            if (pointType === "beizer") {
                const pos = scene.map2DPointToCanvas({ x: point.x, y: point.y });
                const cp1 = scene.map2DPointToCanvas({ x: point.cp1x, y: point.cp1y });
                const cp2 = scene.map2DPointToCanvas({ x: point.cp2x, y: point.cp2y });

                ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pos.x, pos.y);
            }
            if (pointType === "regular") {
                const pos = scene.map2DPointToCanvas({ x: point.x, y: point.y });

                ctx.lineTo(pos.x, pos.y);
            }
        }

        if (typeof this.bgColor === "number") {
            ctx.fillStyle = color(this.bgColor);
            ctx.fill();
        }

        if (typeof this.strokeColor === "number") {
            ctx.strokeStyle = color(this.strokeColor);
            ctx.stroke();
        }
    }
}

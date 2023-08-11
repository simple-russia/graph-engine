import { color } from "../../../utils/color";
import { restrictNumber } from "../../../utils/restrictNumber";
import { Scene } from "../../scene";
import { Object2D } from "../object2d";
import { BoundingBox } from "../types";
import { IPolylinePrimitiveArgs, PolylinePrimitivePoint } from "./types";


const DEFAULT_POLYLINE_OPTIONS: IPolylinePrimitiveArgs = {
    bgColor: null,
    strokeColor: null,
    ignoreZoom: false,
    lineWidth: 1,
    points: [],
    bgOpacity: 1,
    strokeOpacity: 1,
};

export class PolylinePrimitive extends Object2D {
    public lineWidth: number;

    public strokeColor: number | null;
    public strokeOpacity: number;
    public bgColor: number | null;
    public bgOpacity: number;

    public points: PolylinePrimitivePoint[];
    public ignoreZoom: boolean;
    private boundingBox: BoundingBox;
    // private isObjectTooSmall: boolean;


    constructor(options: Partial<IPolylinePrimitiveArgs> = {}) {
        options = { ...DEFAULT_POLYLINE_OPTIONS, ...options };
        super();

        this.strokeOpacity = restrictNumber(options.strokeOpacity, 0, 1);
        this.bgOpacity =restrictNumber(options.bgOpacity, 0, 1);
        this.bgColor = options.bgColor;
        this.strokeColor = options.strokeColor;

        this.points = options.points;
        this.ignoreZoom = options.ignoreZoom;

        this.lineWidth = options.lineWidth;


        this.computeBoundingBox();
    }

    getBoundingBox(): BoundingBox {
        return this.boundingBox;
    }

    computeBoundingBox () {
        if (this.points.length === 0) {
            return ;
        }

        const arrX = this.points.reduce((acc, cur) => [...acc, cur.cp1x, cur.cp2x, cur.x], []).filter(x => typeof x === "number");
        const arrY = this.points.reduce((acc, cur) => [...acc, cur.cp1y, cur.cp2y, cur.y], []).filter(x => typeof x === "number");

        this.boundingBox = {
            max: { x: Math.max(...arrX), y: Math.max(...arrY) },
            min: { x: Math.min(...arrX), y: Math.min(...arrY) },
        };
    }

    render (scene: Scene) {
        const isObjectTooSmall = scene.objectTooSmall(this);

        if (this.points.length === 0) {
            // Nothing to draw
            return ;
        }


        const ctx = scene.canvas.getContext("2d");
        const points = this.points;

        const start = scene.map2DPointToCanvas({ ...points[0] });

        ctx.lineWidth = scene.getLineWidth(this.lineWidth, this.ignoreZoom);

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

        if (typeof this.bgColor === "number" && !isObjectTooSmall) {
            ctx.fillStyle = color(this.bgColor, this.bgOpacity);
            ctx.fill();
        }

        if (typeof this.strokeColor === "number" && !isObjectTooSmall) {
            ctx.strokeStyle = color(this.strokeColor, this.strokeOpacity);
            ctx.stroke();
        }

        if (isObjectTooSmall) {
            const bbox = this.getBoundingBox();

            const p1 = scene.map2DPointToCanvas(bbox.min);
            const p2 = scene.map2DPointToCanvas(bbox.max);
            const width = p2.x - p1.x;
            const height = p2.y - p1.y;

            ctx.fillStyle = color(this.bgColor, this.bgOpacity);
            ctx.fillRect(p1.x, p1.y, width, height);
        }
    }
}

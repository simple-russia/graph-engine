import { color } from "../../../utils/color";
import { restrictNumber } from "../../../utils/restrictNumber";
import { Scene } from "../../scene/scene";
import { Object2D } from "../object2d";
import { BoundingBox } from "../types";
import { FILL_MIN_PIXEL_SIZE, SMALL_POINT_MAX_PIXEL_SIZE, SMALL_POINT_MIN_PIXEL_SIZE, STROKE_MIN_PIXEL_SIZE } from "./constants";
import { IPolylinePrimitiveArgs, PolylinePrimitivePoint } from "./types";


const DEFAULT_POLYLINE_OPTIONS: IPolylinePrimitiveArgs = {
    bgColor: null,
    strokeColor: null,
    ignoreZoom: false,
    lineWidth: 1,
    points: [],
    bgOpacity: 1,
    strokeOpacity: 1,
    ignoreSmallPointOptimization: false,
};

export class PolylinePrimitive extends Object2D {
    public lineWidth: number;

    public strokeColor: number | null;
    public strokeOpacity: number;
    public bgColor: number | null;
    public bgOpacity: number;

    public points: PolylinePrimitivePoint[];
    public ignoreZoom: boolean;
    public ignoreSmallPointOptimization: boolean;

    private boundingBox: BoundingBox;


    constructor(options: Partial<IPolylinePrimitiveArgs> = {}) {
        options = { ...DEFAULT_POLYLINE_OPTIONS, ...options };
        super();

        this.strokeOpacity = restrictNumber(options.strokeOpacity, 0, 1);
        this.bgOpacity =restrictNumber(options.bgOpacity, 0, 1);
        this.bgColor = options.bgColor;
        this.strokeColor = options.strokeColor;

        this.points = options.points;
        this.ignoreZoom = options.ignoreZoom;
        this.ignoreSmallPointOptimization = options.ignoreSmallPointOptimization;

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

        const EXTRA_BOUNDING_PAD = 0;

        const arrX = this.points.reduce((acc, cur) => [...acc, cur.cp1x, cur.cp2x, cur.x], []).filter(x => typeof x === "number");
        const arrY = this.points.reduce((acc, cur) => [...acc, cur.cp1y, cur.cp2y, cur.y], []).filter(x => typeof x === "number");

        this.boundingBox = {
            max: { x: Math.max(...arrX) + EXTRA_BOUNDING_PAD, y: Math.max(...arrY) + EXTRA_BOUNDING_PAD },
            min: { x: Math.min(...arrX) - EXTRA_BOUNDING_PAD, y: Math.min(...arrY) - EXTRA_BOUNDING_PAD },
        };
    }

    render (scene: Scene) {
        const ratioToPixel = scene.getObjectToPixelRatio(this);

        if (this.points.length === 0) {
            // Nothing to draw
            return ;
        }

        if (ratioToPixel < SMALL_POINT_MIN_PIXEL_SIZE) {
            // The object is way too small to draw
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

        const isBgColorNotNull = typeof this.bgColor === "number";
        const isStrokeColorNotNull = typeof this.strokeColor === "number";

        // Draw only if the color is defined & size at is at least 1 pixel of size on cavas
        if (isBgColorNotNull && (this.ignoreSmallPointOptimization || ratioToPixel >= FILL_MIN_PIXEL_SIZE)) {
            ctx.fillStyle = color(this.bgColor, this.bgOpacity);
            ctx.fill();
        }

        // Draw only if the color is defined & size at is at least 7 pixels of size on cavas
        if (isStrokeColorNotNull && (this.ignoreSmallPointOptimization || ratioToPixel >= STROKE_MIN_PIXEL_SIZE)) {
            ctx.strokeStyle = color(this.strokeColor, this.strokeOpacity);
            ctx.stroke();
        }

        // If object's size on canvas is between 0.5 and 1 pixel draw a pixel of bgColor color
        if (!this.ignoreSmallPointOptimization && typeof this.bgColor === "number" && SMALL_POINT_MIN_PIXEL_SIZE < ratioToPixel && ratioToPixel < SMALL_POINT_MAX_PIXEL_SIZE) {
            const bbox = this.getBoundingBox();

            const p1 = scene.map2DPointToCanvas(bbox.min);
            const p2 = scene.map2DPointToCanvas(bbox.max);
            const width = p2.x - p1.x;
            const height = p2.y - p1.y;

            // The smaller it is the less transparent it's going to be untill it's not rendered at all
            const opacity = (ratioToPixel - SMALL_POINT_MIN_PIXEL_SIZE) / (SMALL_POINT_MAX_PIXEL_SIZE - SMALL_POINT_MIN_PIXEL_SIZE);

            ctx.fillStyle = color(this.bgColor, opacity);
            ctx.fillRect(p1.x, p1.y, width, height);
        }
    }
}

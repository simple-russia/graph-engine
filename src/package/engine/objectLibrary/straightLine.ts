import { COLORS } from "../../utils/colors";
import { PolylinePrimitive } from "../basicObjects/polylinePrimitive/polylinePrimitive";
import { BoundingBox } from "../basicObjects/types";
import { Scene } from "../scene/scene";
import { point2D } from "../types";


interface ILineOptions {
    lineWidth: number;
    color: number;
    opacity: number;
    ignoreZoom: boolean;
    ignoreSmallPointOptimization: boolean;
    zIndex: number;
}

const LINE_DEFAULT_OPTIONS: ILineOptions = {
    lineWidth: 1,
    color: COLORS.BLACK,
    ignoreZoom: false,
    opacity: 1,
    ignoreSmallPointOptimization: false,
    zIndex: 1,
};


export class StraightLine extends PolylinePrimitive {
    public lineWidth: number;
    public ignoreZoom: boolean;
    public opacity: number;
    public ignoreSmallPointOptimization: boolean;


    constructor(point1: point2D, point2: point2D, options?: Partial<ILineOptions>) {
        super();
        options = { ...LINE_DEFAULT_OPTIONS, ...options };

        // TODO fix params
        this.strokeColor = options.color;
        this.lineWidth = options.lineWidth;
        this.ignoreZoom = options.ignoreZoom;
        this.strokeOpacity = options.opacity;
        this.ignoreSmallPointOptimization = options.ignoreSmallPointOptimization;

        // TODO make observable and do compute bbox on points change
        this.points = [
            { x: point1.x, y: point1.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
            { x: point2.x, y: point2.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null }
        ];
        this.computeBoundingBox();
        this.renderPriority = options.zIndex;
    }

    render (scene: Scene) {
        super.render(scene);
    }

    setPoints (point1: point2D, point2: point2D) {
        this.points = [
            { x: point1.x, y: point1.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
            { x: point2.x, y: point2.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
        ];
        this.computeBoundingBox();
    }

    getBoundingBox(): BoundingBox {
        return super.getBoundingBox();
    }
}

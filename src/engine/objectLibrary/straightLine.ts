import { color } from "../../utils/color";
import { COLORS } from "../../utils/colors";
import { restrictNumber } from "../../utils/restrictNumber";
import { PolylinePrimitive } from "../basicObjects/polylinePrimitive/polylinePrimitive";
import { Scene } from "../scene/scene";
import { point2D } from "../types";


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


export class StraightLine extends PolylinePrimitive {
    public lineWidth: number;
    public ignoreZoom: boolean;
    public opacity: number;


    constructor(point1: point2D, point2: point2D, options?: Partial<ILineOptions>) {
        super();
        options = { ...LINE_DEFAULT_OPTIONS, ...options };

        // TODO fix params
        this.strokeColor = options.color;
        this.lineWidth = options.lineWidth;
        this.ignoreZoom = options.ignoreZoom;
        this.strokeOpacity = options.opacity;

        this.points = [
            { x: point1.x, y: point1.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
            { x: point2.x, y: point2.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null }
        ];
    }

    render (scene: Scene) {
        super.render(scene);
    }
}

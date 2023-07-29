import { Line } from "../basicObjects/line";
import { Object2D } from "../basicObjects/object2d";
import { Scene } from "../scene";

export class MathFunction extends Object2D {
    public readonly formula: (x: number) => number;
    public fromX: number;
    public toX: number;
    public step: number;
    public color: number;

    private lineSegments: Line[];

    constructor (formula: (x: number) => number, fromX = 1000, toX = 1000, step = 25, color=0xFF0000) {
        super();
        this.fromX = fromX;
        this.toX = toX;
        this.step = step;
        this.color = color;
        this.formula = formula;
        this.lineSegments = [];
    }

    render (scene: Scene) {
        for (const line of this.lineSegments) {
            scene.remove(line);
        }
        this.lineSegments = [];

        let prevX: null | number = null;
        let prevY: null | number = null;

        for (let i = this.fromX; i <= this.toX; i += this.step) {
            const x = i;
            const y = this.formula(x);

            if (prevX !== null && prevY !== null) {
                const line = new Line({ x: prevX, y: prevY }, { x, y }, 1, this.color, true);
                this.lineSegments.push(line);
                scene.add(line);
            }
            prevX = x;
            prevY = y;
        }
    }
}

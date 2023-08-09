import { Line } from "../basicObjects/line";
import { Object2D } from "../basicObjects/object2d";
import { Scene } from "../scene";

const stepsPerVisible = 1000;
const leftExtraSteps = -2;
const rightExtraSteps = -1;
const totalSteps = stepsPerVisible + leftExtraSteps + rightExtraSteps;
const totalLines = totalSteps - 1;


export class MathFunction extends Object2D {
    public readonly formula: (x: number) => number;
    public fromX: number;
    public toX: number;
    public step: number;
    public color: number;
    private functionLines: Line[];

    private bounbaryLine: Line;


    constructor (formula: (x: number) => number, color=0xFF0000) {
        super();

        this.color = color;
        this.formula = formula;

        this.functionLines = Array(totalLines).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { color, lineWidth: 2, ignoreZoom: true }));
    }


    public onAddedToScene(scene: Scene): void {
        this.functionLines.forEach(line => {
            scene.add(line);
        });
    }

    public onRemovedFromScene(scene: Scene): void {
        this.functionLines.forEach(line => scene.remove(line));
    }

    render (scene: Scene) {
        const visibleXRange = scene.width * scene.camera.zoom;
        const step = visibleXRange / stepsPerVisible;

        let center = scene.camera.position.x;

        let normalizedCenter = center - center % step;
        let leftBoundaryXnormalized = normalizedCenter - (Math.floor(stepsPerVisible / 2) + leftExtraSteps) * step;
        let rightBoundaryXnormalized = normalizedCenter + (Math.floor(stepsPerVisible / 2) + rightExtraSteps) * step;

        const functionCords: number[][] = [];

        let currentX = leftBoundaryXnormalized;
        while (currentX <= rightBoundaryXnormalized) {
            const x = currentX;
            const y = this.formula(x);

            functionCords.push([x, y]);

            currentX += step;
        }

        for (let i = 0; i < this.functionLines.length; i++) {
            const line = this.functionLines[i];

            const isTooDistant = false;

            if (isTooDistant) {
                this.functionLines[i].point1.x = 0;
                this.functionLines[i].point1.y = 0;
                this.functionLines[i].point2.x = 0;
                this.functionLines[i].point2.y = 0;
                continue ;
            }

            this.functionLines[i].point1.x = functionCords[i][0];
            this.functionLines[i].point1.y = functionCords[i][1];
            this.functionLines[i].point2.x = functionCords[i+1][0];
            this.functionLines[i].point2.y = functionCords[i+1][1];
        }
    }
}

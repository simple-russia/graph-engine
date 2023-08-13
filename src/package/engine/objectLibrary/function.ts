import { StraightLine } from "./straightLine";
import { Object2D } from "../basicObjects/object2d";
import { Scene } from "../scene/scene";
import { BoundingBox } from "../basicObjects/types";
import { randomColor } from "../../utils/randomColor";

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
    private functionLines: StraightLine[];



    constructor (formula: (x: number) => number, color=0xFF0000) {
        super();

        this.color = color;
        this.formula = formula;

        this.functionLines = Array(totalLines).fill(null).map(() => new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { color, lineWidth: 2, ignoreZoom: true, ignoreSmallPointOptimization: true, zIndex: 50 }));
    }


    public onAddedToScene(scene: Scene): void {
        this.functionLines.forEach(line => {
            scene.add(line);
        });
    }

    public onRemovedFromScene(scene: Scene): void {
        this.functionLines.forEach(line => scene.remove(line));
    }

    getBoundingBox(): BoundingBox {
        return null;
    }

    render (scene: Scene) {
        // TODO use scene methods
        const visibleXRange = scene.width / scene.camera.zoom;
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
            this.functionLines[i].points[0].x = functionCords[i][0];
            this.functionLines[i].points[0].y = functionCords[i][1];
            this.functionLines[i].points[1].x = functionCords[i+1][0];
            this.functionLines[i].points[1].y = functionCords[i+1][1];
            this.functionLines[i].computeBoundingBox();
        }

        // @ts-ignore
        window.f = this;
    }
}

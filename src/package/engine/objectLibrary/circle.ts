import { PolylinePrimitive } from "../basicObjects/polylinePrimitive/polylinePrimitive";
import { Scene } from "../scene/scene";
import { point2D } from "../types";



interface ICircleArgs {
    radius: number
    position: point2D
    bgColor: number | null
    strokeColor: number | null
}

const CIRCLE_DEFAULT_OPTIONS: ICircleArgs = {
    radius: 10,
    bgColor: null,
    strokeColor: null,
    position: { x: 0, y: 0 }
};

export class Circle extends PolylinePrimitive {
    public width: number;
    public height: number;


    constructor (options: Partial<ICircleArgs> = {}) {
        options = { ...CIRCLE_DEFAULT_OPTIONS, ...options };

        const x = options.position.x;
        const y = options.position.y;
        const r = options.radius;

        const C = 1.02;

        super({
            bgColor: options.bgColor,
            strokeColor: options.strokeColor,
            ignoreZoom: false,
            lineWidth: 1,
            points: [
                { x: options.position.x - options.radius, y: options.position.y, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
                { x: options.position.x, y: options.position.y - options.radius, cp1x: x - (r*C) , cp1y: y - (r*C)/2, cp2x: x - (r*C)/2, cp2y: y - (r*C) },
                { x: options.position.x + options.radius, y: options.position.y, cp1x: x + (r*C)/2, cp1y: y - (r*C), cp2x: x + (r*C), cp2y: y - (r*C)/2 },
                { x: options.position.x, y: options.position.y + options.radius, cp1x: x + (r*C), cp1y: y + (r*C)/2, cp2x: x + (r*C)/2, cp2y: y + (r*C) },
                { x: options.position.x - options.radius, y: options.position.y, cp1x: x - (r*C)/2, cp1y: y + (r*C), cp2x: x - (r*C), cp2y: y + (r*C)/2 },
            ],
        });
    }


    public onAddedToScene(scene: Scene): void {

    }

    public onRemovedFromScene(scene: Scene): void {

    }

    render (scene: Scene) {
        super.render(scene);
    }
}

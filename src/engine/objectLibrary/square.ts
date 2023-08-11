import { PolylinePrimitive } from "../basicObjects/polylinePrimitive/polylinePrimitive";
import { BoundingBox } from "../basicObjects/types";
import { Scene } from "../scene/scene";
import { point2D } from "../types";



interface ISquareArgs {
    width: number
    height: number
    position: point2D
    bgColor: number | null
    strokeColor: number | null
}

const SQUARE_DEFAULT_OPTIONS: ISquareArgs = {
    width: 10,
    height: 10,
    bgColor: null,
    strokeColor: null,
    position: { x: 0, y: 0 }
};

export class Square extends PolylinePrimitive {
    public width: number;
    public height: number;


    constructor (options: Partial<ISquareArgs> = {}) {
        options = { ...SQUARE_DEFAULT_OPTIONS, ...options };

        super({
            bgColor: options.bgColor,
            strokeColor: options.strokeColor,
            ignoreZoom: false,
            lineWidth: 6,
            points: [
                { x: options.position.x - options.width / 2, y: options.position.y - options.height / 2, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
                { x: options.position.x + options.width / 2, y: options.position.y - options.height / 2, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
                { x: options.position.x + options.width / 2, y: options.position.y + options.height / 2, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
                { x: options.position.x - options.width / 2, y: options.position.y + options.height / 2, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
                { x: options.position.x - options.width / 2, y: options.position.y - options.height / 2, cp1x: null, cp1y: null, cp2x: null, cp2y: null },
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

    getBoundingBox () {
        return super.getBoundingBox();
    }
}

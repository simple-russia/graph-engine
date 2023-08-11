import { generateUUID } from "../../utils/uuid";
import { Scene } from "../scene/scene";
import { BoundingBox } from "./types";



export abstract class Object2D {
    public id: string;
    public isObject2D = true;
    public renderPriority = 0;

    constructor () {
        this.id = generateUUID();
    }

    public onAddedToScene?(scene: Scene): void;

    public onRemovedFromScene?(scene: Scene): void;

    abstract render (scene: Scene): void;

    public getBoundingBox?(): BoundingBox
}

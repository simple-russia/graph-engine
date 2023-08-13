import { generateUUID } from "../../utils/uuid";
import { Scene } from "../scene/scene";
import { BoundingBox } from "./types";



export abstract class Object2D {
    public id: string;
    public isObject2D = true;
    public scene: Scene;

    private __realRenderPriority = 1;
    // public renderPriority = 0;
    get renderPriority () {
        return this.__realRenderPriority;
    }
    set renderPriority (value) {
        this.__realRenderPriority = value;
        // TODO make a separate method for recalculating this

        if (this.scene) {
            this.scene.recomputePositionInChildren(this);
        }
    }

    constructor () {
        this.id = generateUUID();
    }

    public onAddedToScene?(scene: Scene): void;

    public onRemovedFromScene?(scene: Scene): void;

    abstract render (scene: Scene): void;

    public getBoundingBox?(): BoundingBox
}

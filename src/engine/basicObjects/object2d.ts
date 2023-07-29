import { generateUUID } from "../../utils/uuid";
import { Scene } from "../scene";

export abstract class Object2D {
    public id: string;
    public isObject2D = true;

    constructor () {
        this.id = generateUUID();
    }

    abstract render (scene: Scene): void;
}

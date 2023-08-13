import { Object2D } from "../../basicObjects/object2d";
import { Scene } from "../scene";


export function removeFromScene (this: Scene, object2d: Object2D) {
    this.children = this.children.filter(obj => obj !== object2d);

    if (object2d.onRemovedFromScene) {
        object2d.onRemovedFromScene(this);
    }
}

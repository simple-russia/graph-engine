import { Object2D } from "../../basicObjects/object2d";

export function recomputeObjectRenderPosition (object2d: Object2D) {
    this.remove(object2d);
    this.add(object2d);
}

import { Object2D } from "../../basicObjects/object2d";


export function objectSeen (object: Object2D) {
    const boundingBox = object.getBoundingBox();
    const viewBox = this.camera.getViewBoundingBox();

    if (boundingBox === undefined || boundingBox === null) {
        return true;
    }

    if (!viewBox || boundingBox.max.x < viewBox.min.x || boundingBox.min.x > viewBox.max.x) {
        // console.log(boundingBox.min.x, boundingBox.max.x);
        return false;
    }

    if (boundingBox.max.y < viewBox.min.y || boundingBox.min.y > viewBox.max.y) {
        return false ;
    }

    return true;
}

import { Object2D } from "../../basicObjects/object2d";


export function getObjectToPixelRatio (object: Object2D) {
    const boundingBox = object.getBoundingBox();

    if (!boundingBox) {
        return Infinity;
    }

    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;
    const pixelSize = this.getCanvasPixelSize();

    const biggerDimension = Math.max(width, height);

    return biggerDimension / pixelSize;
}

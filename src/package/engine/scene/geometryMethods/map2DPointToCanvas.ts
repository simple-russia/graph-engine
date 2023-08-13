import { point2D } from "../../types";

export function map2DPointToCanvas (point: point2D): point2D {
    let pointX = point.x;
    let pointY = point.y;

    pointY *= -1;

    // TODO use scene methods (or move them to camera)
    pointX = pointX * this.camera.zoom;
    pointY = pointY * this.camera.zoom;

    pointX += this.width / 2;
    pointY += this.height / 2;

    pointX += -this.camera.position.x * this.camera.zoom;
    pointY += this.camera.position.y * this.camera.zoom;

    return {
        x: pointX,
        y: pointY,
    };
}

import { PolylinePrimitivePoint } from "../../engine/basicObjects/polylinePrimitive/types";

interface IPolylinePointProps {
    onUpdate?: (position: {x: number, y: number}) => void
    point: PolylinePrimitivePoint
}

export const createPolylinePointObservable = ({ onUpdate, point }: IPolylinePointProps) => {
    const pointProxy = new Proxy(point, {
        get(point, prop) {
            return Reflect.get(point, prop);
        },
        set(point, prop, value) {
            if (!(prop === "x" || prop === "y")) {
                throw new TypeError(`Property ${prop.toString()} does not exist on type`);
            }
            if (typeof value !== "number") {
                throw new TypeError(`${prop} can only be a number`);
            }
            if (!Number.isFinite(value)) {
                throw new TypeError(`${prop} cannot be an Infinity or NaN`);
            }

            // console.log(value);
            point[prop] = value;

            onUpdate && onUpdate({ x: point.x, y: point.y });

            return true;
        }
    });

    return pointProxy;
};

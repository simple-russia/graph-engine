import { PolylinePrimitivePoint } from "../../engine/basicObjects/polylinePrimitive/types";
import { createPolylinePointObservable } from "./polylinePoint";

interface IPointsProps {
    onUpdate?: () => void
    points?: PolylinePrimitivePoint[]
}

export const createPointsObservable = ({ onUpdate, points }: IPointsProps = {}): PolylinePrimitivePoint[] => {
    const pointsArr: PolylinePrimitivePoint[] = points || [];
    const observablePointsArr = pointsArr.map(point => createPolylinePointObservable({ point, onUpdate }));

    const pointsProxy = new Proxy(observablePointsArr, {
        get(points, index) {
            // Consider adding push and other array methods
            return Reflect.get(points, index);
        },
        set(points, index, value) {
            if (typeof index === "symbol") {
                throw new TypeError("Index cannot be of type Symbol");
            }

            const idx = Number(index);
            points[idx] = value;

            onUpdate && onUpdate();

            return true;
        }
    });


    return pointsProxy;
};

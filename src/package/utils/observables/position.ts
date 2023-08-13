import { point2D } from "../../engine/types";

interface IPositionProps {
    onUpdate?: (position: {x: number, y: number}) => void
    x?: number,
    y?: number,
}

export const createPositionObservable = ({ onUpdate, x = 0, y = 0 }: IPositionProps = {}) => {
    const position: point2D = {
        x: x || 0,
        y: y || 0,
    };

    const positionProxy = new Proxy(position, {
        get(position, prop) {
            if (prop === "x" || prop === "y") {
                return position[prop];
            }
            return undefined;
        },
        set(position, prop, value) {
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
            position[prop] = value;

            onUpdate && onUpdate({ x: position.x, y: position.y });

            return true;
        }
    });

    return positionProxy;
};

import { Object2D } from "../../basicObjects/object2d";


const insertIntoChildren = (children: Object2D[], object2d: Object2D): Object2D[] => {
    if (children.length === 0) {
        return [object2d];
    }

    let leftBoundaryIndex = 0;
    let rightBoundaryIndex = children.length - 1;

    if (children[rightBoundaryIndex].renderPriority < object2d.renderPriority) {
        return [...children, object2d];
    }
    if (children[leftBoundaryIndex].renderPriority > object2d.renderPriority) {
        return [object2d, ...children];
    }

    while ((rightBoundaryIndex - leftBoundaryIndex) !== 0) {
        if ((rightBoundaryIndex - leftBoundaryIndex) === 1) {
            break;
        }

        const medianIndex = Math.floor((rightBoundaryIndex + leftBoundaryIndex) / 2);
        const medianValue = children[medianIndex].renderPriority;

        if (medianValue < object2d.renderPriority) {
            leftBoundaryIndex = medianIndex;
        } else {
            rightBoundaryIndex = medianIndex;
        }
    }

    const leftArray = children.slice(0, rightBoundaryIndex);
    const rightArray = children.slice(rightBoundaryIndex, children.length);

    return [...leftArray, object2d, ...rightArray];
};


export function addToScene (object2d: Object2D) {
    object2d.scene = this;

    if (this.children.includes(object2d)) return ;

    const newChildren = insertIntoChildren(this.children, object2d);

    this.children = newChildren;

    if (object2d.onAddedToScene) {
        object2d.onAddedToScene(this);
    }
}

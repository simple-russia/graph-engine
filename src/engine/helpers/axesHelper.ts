import { COLORS } from "../../utils/colors";
import { restrictNumber } from "../../utils/restrictNumber";
import { StraightLine } from "../objectLibrary/straightLine";
import { Object2D } from "../basicObjects/object2d";
import { Text } from "../basicObjects/text";
import { Scene } from "../scene/scene";
import { BoundingBox } from "../basicObjects/types";


const yLabelOffset = 10;
const xLabelOffset = 10;

const maxXSteps = 15;
const minXSteps = 7;

const secondaryGridAdditionalOpacity = 0.8;

const AXES_COLOR = 0x333333;


type LabelStep = number;
type SecondaryGridStep = number;
type SecondaryGridOpacity = number;

const getClosestPrettyStep = (width: number): [LabelStep, SecondaryGridStep, SecondaryGridOpacity] => {
    const maxDecimalStep = width / minXSteps;

    const power10 = Math.floor(Math.log10(maxDecimalStep));
    const closest1 = 10 ** power10 * 1;


    if (width / closest1 > maxXSteps) {
        const steps = width / closest1;
        const a = (steps - maxXSteps) / (minXSteps * 10 - maxXSteps);
        const opacity = 1 - restrictNumber(a, 0, 1);

        return [closest1 * 5, closest1, opacity];
    }

    const steps = width / closest1;
    const overflow = steps - minXSteps;
    const a1 = 1 - overflow / steps;
    const a2 = 1 - minXSteps / maxXSteps - overflow / steps;
    const opacity = restrictNumber(a1 - 0.5 + a2, 0, 1);

    return [closest1, closest1 / 2, opacity];
};


const isZero = (n: number) => {
    const EPSILON = 0.1 ** 8;
    return Math.abs(0 - n) < EPSILON;
};


export class AxesHelper extends Object2D {
    private xAxis: StraightLine;
    private yAxis: StraightLine;

    private xLabels: Text[];
    private yLabels: Text[];

    private gridVerticalLines: StraightLine[];
    private gridHorizontalLines: StraightLine[];

    private gridSecondaryVerticalLines: StraightLine[];
    private gridSecondaryHorizontalLines: StraightLine[];

    constructor () {
        super();

        this.xAxis = new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: COLORS.WHITE });
        this.yAxis = new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: COLORS.WHITE });

        this.xLabels = Array(maxXSteps).fill(null).map(() => new Text("", { x: 50, y: 10 }, 15, COLORS.WHITE, true, 0, 100));
        this.yLabels = Array(maxXSteps).fill(null).map(() => new Text("", { x: 10, y: 50 }, 15, COLORS.WHITE, true, 0, 100));
        // 0x333333
        this.gridVerticalLines = Array(maxXSteps).fill(null).map(() => new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: AXES_COLOR, zIndex: -10000 }));
        this.gridHorizontalLines = Array(maxXSteps).fill(null).map(() => new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: AXES_COLOR, zIndex: -10000 }));
        // @ts-ignore
        window.gr = this.gridHorizontalLines;
        // @ts-ignore
        window.vr = this.gridVerticalLines;
        this.gridSecondaryVerticalLines = Array(maxXSteps * 5).fill(null).map(() => new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: AXES_COLOR, zIndex: -10000 }));
        this.gridSecondaryHorizontalLines = Array(maxXSteps * 5).fill(null).map(() => new StraightLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: AXES_COLOR, zIndex: -10000 }));
    }


    public onAddedToScene(scene: Scene): void {
        this.gridHorizontalLines.forEach(line => scene.add(line));
        this.gridVerticalLines.forEach(line => scene.add(line));
        this.gridSecondaryHorizontalLines.forEach(line => scene.add(line));
        this.gridSecondaryVerticalLines.forEach(line => scene.add(line));
        scene.add(this.xAxis);
        scene.add(this.yAxis);
        this.yLabels.forEach(label => scene.add(label));
        this.xLabels.forEach(label => scene.add(label));
    }

    public hideLabelsAndGrid () {
        this.xLabels.forEach(label => {
            label.text = "";
            label.opacity = 1;
        });
        this.yLabels.forEach(label => {
            label.text = "";
            label.opacity = 1;
        });

        for (const grid of [this.gridVerticalLines, this.gridSecondaryHorizontalLines, this.gridSecondaryVerticalLines, this.gridHorizontalLines]) {
            grid.forEach(axis => {
                axis.points[0].y = 0;
                axis.points[0].x = 0;
                axis.points[1].y = 0;
                axis.points[1].x = 0;
            });
        }
    }


    getBoundingBox(): BoundingBox {
        return null;
    }


    render (scene: Scene) {
        // TODO fix this using new canvas point methods

        // First hide all the axes and labels, then compute them again.
        this.hideLabelsAndGrid();

        const bounds = scene.camera.getVisibleBoundaries();

        const width = bounds.rightBoundary - bounds.leftBoundary;
        // const height = bounds.topBoundary - bounds.bottomBoundary;

        // Axes points
        this.xAxis.points[0].x = bounds.leftBoundary;
        this.xAxis.points[1].x = bounds.rightBoundary;
        this.xAxis.computeBoundingBox();
        this.yAxis.points[0].y = bounds.topBoundary;
        this.yAxis.points[1].y = bounds.bottomBoundary;
        this.yAxis.computeBoundingBox();

        const cameraViewBox = scene.camera.getViewBoundingBox();

        // What step to use for labels
        const [step, secondaryStep, secondaryOpacity] = getClosestPrettyStep(width);

        // How many decimals to show on labels
        let showDecimalNumbers = -Math.floor(Math.log10(step));
        showDecimalNumbers = showDecimalNumbers < 0 ? 0 : showDecimalNumbers;


        //  Going through all x's
        const xStart = (Math.floor(bounds.leftBoundary / step)) * step;
        let i_1: number;

        for (i_1 = 0; i_1 < maxXSteps; i_1++) {
            const x = xStart + i_1 * step;
            const label = this.xLabels[i_1];

            if (isZero(x)) {
                // Draw zero
                label.position.x = x;
                label.position.y = yLabelOffset * scene.camera.zoom;
                continue;
            };

            // Change the label
            label.position.x = x;
            label.position.y = yLabelOffset * scene.camera.zoom;
            label.text = x.toFixed(showDecimalNumbers);

            // Labels opacity
            if (label.position.y < cameraViewBox.min.y) {
                label.position.y = cameraViewBox.min.y;
            }
            if (label.position.y > cameraViewBox.max.y) {
                label.position.y = cameraViewBox.max.y;
            }

            // TODO change to some contanct. Step is always different
            const TRANSPARENCY_OFFSET = scene.translateToCanvasLength(350);
            if (label.position.x > bounds.rightBoundary - TRANSPARENCY_OFFSET) {
                const gap = bounds.rightBoundary - TRANSPARENCY_OFFSET;
                label.opacity = 1 - (label.position.x - gap) / TRANSPARENCY_OFFSET;
            }
            if (label.position.x < bounds.leftBoundary + TRANSPARENCY_OFFSET) {
                const gap = bounds.leftBoundary + TRANSPARENCY_OFFSET;
                label.opacity = 1 - (gap - label.position.x) / TRANSPARENCY_OFFSET;
            }

            if (label.position.x > bounds.rightBoundary) {
                label.opacity = 0;
            }
            if (label.position.x < bounds.leftBoundary) {
                label.opacity = 0;
            }

            // Add a vertical line
            const verticalLine = this.gridVerticalLines[i_1];
            verticalLine.points[0].y = bounds.bottomBoundary;
            verticalLine.points[1].y = bounds.topBoundary;
            verticalLine.points[0].x = label.position.x;
            verticalLine.points[1].x = label.position.x;
            verticalLine.computeBoundingBox();
        }

        let i_2: number;

        for (i_2 = 0; i_2 < maxXSteps * 5; i_2++) {
            const x = xStart + i_2 * secondaryStep;

            const verticalSecondaryLine = this.gridSecondaryVerticalLines[i_2];
            verticalSecondaryLine.points[0].y = bounds.bottomBoundary;
            verticalSecondaryLine.points[1].y = bounds.topBoundary;
            verticalSecondaryLine.points[0].x = x;
            verticalSecondaryLine.points[1].x = x;
            verticalSecondaryLine.strokeOpacity = secondaryOpacity * secondaryGridAdditionalOpacity;
            verticalSecondaryLine.computeBoundingBox();
        }

        // Going through all y's
        const yStart = (Math.floor(bounds.bottomBoundary / step)) * step;
        let j: number;

        for (j = 0; j < maxXSteps; j++) {
            const y = yStart + j * step;
            const label = this.yLabels[j];

            if (isZero(y)) {
                continue;
            };

            // Change the label
            label.position.y = y;
            label.position.x = xLabelOffset * scene.camera.zoom;
            label.text = y.toFixed(showDecimalNumbers);

            // Labels opacity
            if (label.position.x < cameraViewBox.min.x) {
                label.position.x = cameraViewBox.min.x;
            }
            if (label.position.x > cameraViewBox.max.x) {
                label.position.x = cameraViewBox.max.x;
            }

            const TRANSPARENCY_OFFSET = scene.translateToCanvasLength(100);
            if (label.position.y > bounds.topBoundary - TRANSPARENCY_OFFSET) {
                const gap = bounds.topBoundary - TRANSPARENCY_OFFSET;
                label.opacity = 1 - (label.position.y - gap) / TRANSPARENCY_OFFSET;
            }
            if (label.position.y < bounds.bottomBoundary + TRANSPARENCY_OFFSET) {
                const gap = bounds.bottomBoundary + TRANSPARENCY_OFFSET;
                label.opacity = 1 - (gap - label.position.y) / TRANSPARENCY_OFFSET;
            }

            if (label.position.y > bounds.topBoundary) {
                label.opacity = 0;
            }
            if (label.position.y < bounds.bottomBoundary) {
                label.opacity = 0;
            }

            // Add a vertical line
            const horizontal = this.gridHorizontalLines[j];
            horizontal.points[0].y = label.position.y;
            horizontal.points[1].y = label.position.y;
            horizontal.points[0].x = bounds.leftBoundary;
            horizontal.points[1].x = bounds.rightBoundary;
            horizontal.computeBoundingBox();
        }


        let j_2: number;

        for (j_2 = 0; j_2 < maxXSteps * 5; j_2++) {
            const y = yStart + j_2 * secondaryStep;

            const horizontalVerticalLine = this.gridSecondaryHorizontalLines[j_2];

            horizontalVerticalLine.points[0].y = y;
            horizontalVerticalLine.points[1].y = y;
            horizontalVerticalLine.points[0].x = bounds.leftBoundary;
            horizontalVerticalLine.points[1].x = bounds.rightBoundary;
            horizontalVerticalLine.strokeOpacity = secondaryOpacity * secondaryGridAdditionalOpacity;
            horizontalVerticalLine.computeBoundingBox();
        }
    }
}
